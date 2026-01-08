import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { authControllerRefreshV1 } from "./api/generated/authentication/authentication";
import { ApiError, configure } from "./api/client";
import { routing } from "./i18n/routing";

// Configure API client with base URL for middleware
configure({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

const intlMiddleware = createMiddleware(routing);

// Public routes that don't require authentication (or have their own token validation)
const PUBLIC_ROUTES = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/2fa",
    "/2fa-setup",
    "/restricted",
];

// Check if route is public
function isPublicRoute(pathname: string): boolean {
    // Remove locale prefix from pathname for checking
    const pathWithoutLocale = pathname.replace(/^\/(en|th)/, "");
    // Root path should be handled by the page component itself
    if (pathWithoutLocale === "" || pathWithoutLocale === "/") {
        return true;
    }
    return PUBLIC_ROUTES.some((route) => pathWithoutLocale.startsWith(route));
}

/**
 * Decode JWT to get expiry time (without verification)
 */
function decodeJwtExpiry(token: string): number | undefined {
    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return undefined;

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = atob(base64);
        const payload = JSON.parse(jsonPayload);

        // JWT exp is in seconds, convert to milliseconds
        return payload.exp ? payload.exp * 1000 : undefined;
    } catch {
        return undefined;
    }
}

/**
 * Check if token is about to expire (within 60 seconds)
 * Access tokens last 5 minutes, so we refresh 60 seconds before expiry
 */
function isTokenExpiring(token: string): boolean {
    const expiryTime = decodeJwtExpiry(token);
    if (!expiryTime) return false;

    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;
    const sixtySeconds = 60 * 1000;
    return timeUntilExpiry < sixtySeconds;
}

// Refresh access token using refresh token
async function refreshAccessToken(refreshToken: string): Promise<{
    headers: Headers;
    data: { accessToken: string; refreshToken: string };
} | null> {
    try {
        // Send refresh token in the request body (as per API spec)
        const response = await authControllerRefreshV1({
            refreshToken: refreshToken,
        });

        // Response has structure: { data: AuthLoginSuccess, status, headers }
        // AuthLoginSuccess has: { success, data: AuthLoginSuccessData, message }
        // AuthLoginSuccessData contains: { accessToken, refreshToken, user, requiresPasswordChange }

        // Check if response has data (status 200)
        if (
            response.status === 200 &&
            response.data &&
            "data" in response.data
        ) {
            const tokenData = response.data.data;

            return {
                headers: response.headers,
                data: {
                    accessToken: tokenData.accessToken,
                    refreshToken: tokenData.refreshToken,
                },
            };
        }

        console.error("Invalid refresh response status:", response.status);
        return null;
    } catch (error) {
        // Handle API errors with detailed messages
        if (error instanceof ApiError) {
            try {
                const errorData = JSON.parse(error.body || "{}");
                const errorMessage = errorData.message || errorData.error;
                console.error(
                    "Error refreshing token:",
                    errorMessage || error.message,
                );
            } catch {
                console.error("Error refreshing token:", error.message);
            }
        } else {
            console.error("Error refreshing token:", error);
        }
        return null;
    }
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get tokens from cookies
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    // Check if route is public
    const isPublic = isPublicRoute(pathname);

    // Check if token needs refreshing (missing or expiring soon)
    const needsRefresh =
        !isPublic &&
        refreshToken &&
        (!accessToken || isTokenExpiring(accessToken));

    // If token needs refresh, try to refresh
    if (needsRefresh) {
        console.log(
            accessToken
                ? "Access token expiring soon, attempting to refresh..."
                : "Access token missing, attempting to refresh...",
        );
        const refreshResult = await refreshAccessToken(refreshToken);

        if (refreshResult) {
            // Create response with intl middleware
            const response = intlMiddleware(request);

            // Forward Set-Cookie headers from the refresh API response
            // Using getSetCookie() to properly handle multiple Set-Cookie headers
            const setCookieHeaders: string[] =
                "getSetCookie" in refreshResult.headers &&
                typeof (
                    refreshResult.headers as unknown as {
                        getSetCookie?: () => string[];
                    }
                ).getSetCookie === "function"
                    ? (
                          refreshResult.headers as unknown as {
                              getSetCookie: () => string[];
                          }
                      ).getSetCookie()
                    : [refreshResult.headers.get("set-cookie")].filter(
                          (v): v is string => v !== null,
                      );

            for (const cookieStr of setCookieHeaders) {
                // Parse cookie string: "name=value; attribute1; attribute2=value2"
                const [nameValue, ...attributes] = cookieStr.split(";");
                const [name, value] = nameValue.split("=").map((s) => s.trim());

                if (name === "access_token" || name === "refresh_token") {
                    const cookieOptions: {
                        httpOnly?: boolean;
                        secure?: boolean;
                        sameSite?: "lax" | "strict" | "none";
                        path?: string;
                        maxAge?: number;
                    } = {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/",
                    };

                    // Parse cookie attributes
                    for (const attr of attributes) {
                        const [attrName, attrValue] = attr
                            .split("=")
                            .map((s) => s.trim().toLowerCase());
                        if (attrName === "max-age" && attrValue) {
                            cookieOptions.maxAge = Number.parseInt(
                                attrValue,
                                10,
                            );
                        }
                    }

                    response.cookies.set(name, value, cookieOptions);
                }
            }

            console.log("Token refresh successful");
            return response;
        }

        console.log(
            "Token refresh failed, clearing cookies and redirecting to login",
        );

        // Refresh failed, clear cookies and redirect to login
        // Preserve locale in redirect
        const locale = pathname.match(/^\/(en|th)/)?.[1] || "en";
        const loginUrl = new URL(`/${locale}/login`, request.url);
        const pathWithoutLocale = pathname.replace(/^\/(en|th)/, "");
        if (pathWithoutLocale && pathWithoutLocale !== "/") {
            loginUrl.searchParams.set("redirect", pathWithoutLocale);
        }

        // Create redirect response and clear auth cookies to prevent redirect loop
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        response.cookies.delete("user_data");

        return response;
    }

    // Check if user is authenticated
    const isAuthenticated = !!accessToken;

    // Redirect to login if not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublic) {
        // Preserve locale in redirect
        const locale = pathname.match(/^\/(en|th)/)?.[1] || "en";
        const loginUrl = new URL(`/${locale}/login`, request.url);
        // Remove locale from pathname for redirect parameter
        const pathWithoutLocale = pathname.replace(/^\/(en|th)/, "");
        if (pathWithoutLocale && pathWithoutLocale !== "/") {
            loginUrl.searchParams.set("redirect", pathWithoutLocale);
        }
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to dashboard if authenticated and trying to access login page
    if (isAuthenticated && pathname.includes("/login")) {
        const dashboardUrl = new URL("/dashboard", request.url);
        // Preserve locale
        const locale = pathname.match(/^\/(en|th)/)?.[1] || "en";
        dashboardUrl.pathname = `/${locale}/dashboard`;
        return NextResponse.redirect(dashboardUrl);
    }

    // Run intl middleware
    return intlMiddleware(request);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
