
      let global = globalThis;

      class MessageChannel {
        constructor() {
          this.port1 = new MessagePort();
          this.port2 = new MessagePort();
        }
      }
      class MessagePort {
        constructor() {
          this.onmessage = null;
        }
        postMessage(data) {
          if (this.onmessage) {
            setTimeout(() => this.onmessage({ data }), 0);
          }
        }
      }
      global.MessageChannel = MessageChannel;

      async function handleRequest(context){
        let routeParams = {};
        let pagesFunctionResponse = null;
        const request = context.request;
        const waitUntil = context.waitUntil;
        const urlInfo = new URL(request.url);

        if (urlInfo.pathname !== '/' && urlInfo.pathname.endsWith('/')) {
          urlInfo.pathname = urlInfo.pathname.slice(0, -1);
        }

        let matchedFunc = false;
        
          if('/edge' === urlInfo.pathname) {
            matchedFunc = true;
              "use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/next/dist/shared/lib/i18n/detect-domain-locale.js
  var require_detect_domain_locale = __commonJS({
    "node_modules/next/dist/shared/lib/i18n/detect-domain-locale.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "detectDomainLocale", {
        enumerable: true,
        get: function() {
          return detectDomainLocale;
        }
      });
      function detectDomainLocale(domainItems, hostname, detectedLocale) {
        if (!domainItems)
          return;
        if (detectedLocale) {
          detectedLocale = detectedLocale.toLowerCase();
        }
        for (const item of domainItems) {
          var _item_domain, _item_locales;
          const domainHostname = (_item_domain = item.domain) == null ? void 0 : _item_domain.split(":", 1)[0].toLowerCase();
          if (hostname === domainHostname || detectedLocale === item.defaultLocale.toLowerCase() || ((_item_locales = item.locales) == null ? void 0 : _item_locales.some((locale) => locale.toLowerCase() === detectedLocale))) {
            return item;
          }
        }
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js
  var require_remove_trailing_slash = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "removeTrailingSlash", {
        enumerable: true,
        get: function() {
          return removeTrailingSlash;
        }
      });
      function removeTrailingSlash(route) {
        return route.replace(/\/$/, "") || "/";
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/parse-path.js
  var require_parse_path = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/parse-path.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "parsePath", {
        enumerable: true,
        get: function() {
          return parsePath;
        }
      });
      function parsePath(path) {
        const hashIndex = path.indexOf("#");
        const queryIndex = path.indexOf("?");
        const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
        if (hasQuery || hashIndex > -1) {
          return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : void 0) : "",
            hash: hashIndex > -1 ? path.slice(hashIndex) : ""
          };
        }
        return {
          pathname: path,
          query: "",
          hash: ""
        };
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js
  var require_add_path_prefix = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "addPathPrefix", {
        enumerable: true,
        get: function() {
          return addPathPrefix;
        }
      });
      var _parsepath = require_parse_path();
      function addPathPrefix(path, prefix) {
        if (!path.startsWith("/") || !prefix) {
          return path;
        }
        const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
        return "" + prefix + pathname + query + hash;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/add-path-suffix.js
  var require_add_path_suffix = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/add-path-suffix.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "addPathSuffix", {
        enumerable: true,
        get: function() {
          return addPathSuffix;
        }
      });
      var _parsepath = require_parse_path();
      function addPathSuffix(path, suffix) {
        if (!path.startsWith("/") || !suffix) {
          return path;
        }
        const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
        return "" + pathname + suffix + query + hash;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js
  var require_path_has_prefix = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "pathHasPrefix", {
        enumerable: true,
        get: function() {
          return pathHasPrefix;
        }
      });
      var _parsepath = require_parse_path();
      function pathHasPrefix(path, prefix) {
        if (typeof path !== "string") {
          return false;
        }
        const { pathname } = (0, _parsepath.parsePath)(path);
        return pathname === prefix || pathname.startsWith(prefix + "/");
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/add-locale.js
  var require_add_locale = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/add-locale.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "addLocale", {
        enumerable: true,
        get: function() {
          return addLocale;
        }
      });
      var _addpathprefix = require_add_path_prefix();
      var _pathhasprefix = require_path_has_prefix();
      function addLocale(path, locale, defaultLocale, ignorePrefix) {
        if (!locale || locale === defaultLocale)
          return path;
        const lower = path.toLowerCase();
        if (!ignorePrefix) {
          if ((0, _pathhasprefix.pathHasPrefix)(lower, "/api"))
            return path;
          if ((0, _pathhasprefix.pathHasPrefix)(lower, "/" + locale.toLowerCase()))
            return path;
        }
        return (0, _addpathprefix.addPathPrefix)(path, "/" + locale);
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/format-next-pathname-info.js
  var require_format_next_pathname_info = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/format-next-pathname-info.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "formatNextPathnameInfo", {
        enumerable: true,
        get: function() {
          return formatNextPathnameInfo;
        }
      });
      var _removetrailingslash = require_remove_trailing_slash();
      var _addpathprefix = require_add_path_prefix();
      var _addpathsuffix = require_add_path_suffix();
      var _addlocale = require_add_locale();
      function formatNextPathnameInfo(info) {
        let pathname = (0, _addlocale.addLocale)(info.pathname, info.locale, info.buildId ? void 0 : info.defaultLocale, info.ignorePrefix);
        if (info.buildId || !info.trailingSlash) {
          pathname = (0, _removetrailingslash.removeTrailingSlash)(pathname);
        }
        if (info.buildId) {
          pathname = (0, _addpathsuffix.addPathSuffix)((0, _addpathprefix.addPathPrefix)(pathname, "/_next/data/" + info.buildId), info.pathname === "/" ? "index.json" : ".json");
        }
        pathname = (0, _addpathprefix.addPathPrefix)(pathname, info.basePath);
        return !info.buildId && info.trailingSlash ? !pathname.endsWith("/") ? (0, _addpathsuffix.addPathSuffix)(pathname, "/") : pathname : (0, _removetrailingslash.removeTrailingSlash)(pathname);
      }
    }
  });

  // node_modules/next/dist/shared/lib/get-hostname.js
  var require_get_hostname = __commonJS({
    "node_modules/next/dist/shared/lib/get-hostname.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "getHostname", {
        enumerable: true,
        get: function() {
          return getHostname;
        }
      });
      function getHostname(parsed, headers) {
        let hostname;
        if ((headers == null ? void 0 : headers.host) && !Array.isArray(headers.host)) {
          hostname = headers.host.toString().split(":", 1)[0];
        } else if (parsed.hostname) {
          hostname = parsed.hostname;
        } else
          return;
        return hostname.toLowerCase();
      }
    }
  });

  // node_modules/next/dist/shared/lib/i18n/normalize-locale-path.js
  var require_normalize_locale_path = __commonJS({
    "node_modules/next/dist/shared/lib/i18n/normalize-locale-path.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "normalizeLocalePath", {
        enumerable: true,
        get: function() {
          return normalizeLocalePath;
        }
      });
      var cache = /* @__PURE__ */ new WeakMap();
      function normalizeLocalePath(pathname, locales) {
        if (!locales)
          return {
            pathname
          };
        let lowercasedLocales = cache.get(locales);
        if (!lowercasedLocales) {
          lowercasedLocales = locales.map((locale) => locale.toLowerCase());
          cache.set(locales, lowercasedLocales);
        }
        let detectedLocale;
        const segments = pathname.split("/", 2);
        if (!segments[1])
          return {
            pathname
          };
        const segment = segments[1].toLowerCase();
        const index = lowercasedLocales.indexOf(segment);
        if (index < 0)
          return {
            pathname
          };
        detectedLocale = locales[index];
        pathname = pathname.slice(detectedLocale.length + 1) || "/";
        return {
          pathname,
          detectedLocale
        };
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/remove-path-prefix.js
  var require_remove_path_prefix = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/remove-path-prefix.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "removePathPrefix", {
        enumerable: true,
        get: function() {
          return removePathPrefix;
        }
      });
      var _pathhasprefix = require_path_has_prefix();
      function removePathPrefix(path, prefix) {
        if (!(0, _pathhasprefix.pathHasPrefix)(path, prefix)) {
          return path;
        }
        const withoutPrefix = path.slice(prefix.length);
        if (withoutPrefix.startsWith("/")) {
          return withoutPrefix;
        }
        return "/" + withoutPrefix;
      }
    }
  });

  // node_modules/next/dist/shared/lib/router/utils/get-next-pathname-info.js
  var require_get_next_pathname_info = __commonJS({
    "node_modules/next/dist/shared/lib/router/utils/get-next-pathname-info.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "getNextPathnameInfo", {
        enumerable: true,
        get: function() {
          return getNextPathnameInfo;
        }
      });
      var _normalizelocalepath = require_normalize_locale_path();
      var _removepathprefix = require_remove_path_prefix();
      var _pathhasprefix = require_path_has_prefix();
      function getNextPathnameInfo(pathname, options) {
        var _options_nextConfig;
        const { basePath, i18n, trailingSlash } = (_options_nextConfig = options.nextConfig) != null ? _options_nextConfig : {};
        const info = {
          pathname,
          trailingSlash: pathname !== "/" ? pathname.endsWith("/") : trailingSlash
        };
        if (basePath && (0, _pathhasprefix.pathHasPrefix)(info.pathname, basePath)) {
          info.pathname = (0, _removepathprefix.removePathPrefix)(info.pathname, basePath);
          info.basePath = basePath;
        }
        let pathnameNoDataPrefix = info.pathname;
        if (info.pathname.startsWith("/_next/data/") && info.pathname.endsWith(".json")) {
          const paths = info.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
          const buildId = paths[0];
          info.buildId = buildId;
          pathnameNoDataPrefix = paths[1] !== "index" ? "/" + paths.slice(1).join("/") : "/";
          if (options.parseData === true) {
            info.pathname = pathnameNoDataPrefix;
          }
        }
        if (i18n) {
          let result = options.i18nProvider ? options.i18nProvider.analyze(info.pathname) : (0, _normalizelocalepath.normalizeLocalePath)(info.pathname, i18n.locales);
          info.locale = result.detectedLocale;
          var _result_pathname;
          info.pathname = (_result_pathname = result.pathname) != null ? _result_pathname : info.pathname;
          if (!result.detectedLocale && info.buildId) {
            result = options.i18nProvider ? options.i18nProvider.analyze(pathnameNoDataPrefix) : (0, _normalizelocalepath.normalizeLocalePath)(pathnameNoDataPrefix, i18n.locales);
            if (result.detectedLocale) {
              info.locale = result.detectedLocale;
            }
          }
        }
        return info;
      }
    }
  });

  // node_modules/next/dist/server/web/next-url.js
  var require_next_url = __commonJS({
    "node_modules/next/dist/server/web/next-url.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "NextURL", {
        enumerable: true,
        get: function() {
          return NextURL;
        }
      });
      var _detectdomainlocale = require_detect_domain_locale();
      var _formatnextpathnameinfo = require_format_next_pathname_info();
      var _gethostname = require_get_hostname();
      var _getnextpathnameinfo = require_get_next_pathname_info();
      var REGEX_LOCALHOST_HOSTNAME = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function parseURL(url, base) {
        return new URL(String(url).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"), base && String(base).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"));
      }
      var Internal = Symbol("NextURLInternal");
      var NextURL = class _NextURL {
        constructor(input, baseOrOpts, opts) {
          let base;
          let options;
          if (typeof baseOrOpts === "object" && "pathname" in baseOrOpts || typeof baseOrOpts === "string") {
            base = baseOrOpts;
            options = opts || {};
          } else {
            options = opts || baseOrOpts || {};
          }
          this[Internal] = {
            url: parseURL(input, base ?? options.base),
            options,
            basePath: ""
          };
          this.analyze();
        }
        analyze() {
          var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig, _this_Internal_domainLocale, _this_Internal_options_nextConfig_i18n1, _this_Internal_options_nextConfig1;
          const info = (0, _getnextpathnameinfo.getNextPathnameInfo)(this[Internal].url.pathname, {
            nextConfig: this[Internal].options.nextConfig,
            parseData: !process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE,
            i18nProvider: this[Internal].options.i18nProvider
          });
          const hostname = (0, _gethostname.getHostname)(this[Internal].url, this[Internal].options.headers);
          this[Internal].domainLocale = this[Internal].options.i18nProvider ? this[Internal].options.i18nProvider.detectDomainLocale(hostname) : (0, _detectdomainlocale.detectDomainLocale)((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.domains, hostname);
          const defaultLocale = ((_this_Internal_domainLocale = this[Internal].domainLocale) == null ? void 0 : _this_Internal_domainLocale.defaultLocale) || ((_this_Internal_options_nextConfig1 = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n1 = _this_Internal_options_nextConfig1.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n1.defaultLocale);
          this[Internal].url.pathname = info.pathname;
          this[Internal].defaultLocale = defaultLocale;
          this[Internal].basePath = info.basePath ?? "";
          this[Internal].buildId = info.buildId;
          this[Internal].locale = info.locale ?? defaultLocale;
          this[Internal].trailingSlash = info.trailingSlash;
        }
        formatPathname() {
          return (0, _formatnextpathnameinfo.formatNextPathnameInfo)({
            basePath: this[Internal].basePath,
            buildId: this[Internal].buildId,
            defaultLocale: !this[Internal].options.forceLocale ? this[Internal].defaultLocale : void 0,
            locale: this[Internal].locale,
            pathname: this[Internal].url.pathname,
            trailingSlash: this[Internal].trailingSlash
          });
        }
        formatSearch() {
          return this[Internal].url.search;
        }
        get buildId() {
          return this[Internal].buildId;
        }
        set buildId(buildId) {
          this[Internal].buildId = buildId;
        }
        get locale() {
          return this[Internal].locale ?? "";
        }
        set locale(locale) {
          var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig;
          if (!this[Internal].locale || !((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.locales.includes(locale))) {
            throw Object.defineProperty(new TypeError(`The NextURL configuration includes no locale "${locale}"`), "__NEXT_ERROR_CODE", {
              value: "E597",
              enumerable: false,
              configurable: true
            });
          }
          this[Internal].locale = locale;
        }
        get defaultLocale() {
          return this[Internal].defaultLocale;
        }
        get domainLocale() {
          return this[Internal].domainLocale;
        }
        get searchParams() {
          return this[Internal].url.searchParams;
        }
        get host() {
          return this[Internal].url.host;
        }
        set host(value) {
          this[Internal].url.host = value;
        }
        get hostname() {
          return this[Internal].url.hostname;
        }
        set hostname(value) {
          this[Internal].url.hostname = value;
        }
        get port() {
          return this[Internal].url.port;
        }
        set port(value) {
          this[Internal].url.port = value;
        }
        get protocol() {
          return this[Internal].url.protocol;
        }
        set protocol(value) {
          this[Internal].url.protocol = value;
        }
        get href() {
          const pathname = this.formatPathname();
          const search = this.formatSearch();
          return `${this.protocol}//${this.host}${pathname}${search}${this.hash}`;
        }
        set href(url) {
          this[Internal].url = parseURL(url);
          this.analyze();
        }
        get origin() {
          return this[Internal].url.origin;
        }
        get pathname() {
          return this[Internal].url.pathname;
        }
        set pathname(value) {
          this[Internal].url.pathname = value;
        }
        get hash() {
          return this[Internal].url.hash;
        }
        set hash(value) {
          this[Internal].url.hash = value;
        }
        get search() {
          return this[Internal].url.search;
        }
        set search(value) {
          this[Internal].url.search = value;
        }
        get password() {
          return this[Internal].url.password;
        }
        set password(value) {
          this[Internal].url.password = value;
        }
        get username() {
          return this[Internal].url.username;
        }
        set username(value) {
          this[Internal].url.username = value;
        }
        get basePath() {
          return this[Internal].basePath;
        }
        set basePath(value) {
          this[Internal].basePath = value.startsWith("/") ? value : `/${value}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return {
            href: this.href,
            origin: this.origin,
            protocol: this.protocol,
            username: this.username,
            password: this.password,
            host: this.host,
            hostname: this.hostname,
            port: this.port,
            pathname: this.pathname,
            search: this.search,
            searchParams: this.searchParams,
            hash: this.hash
          };
        }
        clone() {
          return new _NextURL(String(this), this[Internal].options);
        }
      };
    }
  });

  // node_modules/next/dist/lib/constants.js
  var require_constants = __commonJS({
    "node_modules/next/dist/lib/constants.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        ACTION_SUFFIX: function() {
          return ACTION_SUFFIX;
        },
        APP_DIR_ALIAS: function() {
          return APP_DIR_ALIAS;
        },
        CACHE_ONE_YEAR: function() {
          return CACHE_ONE_YEAR;
        },
        DOT_NEXT_ALIAS: function() {
          return DOT_NEXT_ALIAS;
        },
        ESLINT_DEFAULT_DIRS: function() {
          return ESLINT_DEFAULT_DIRS;
        },
        GSP_NO_RETURNED_VALUE: function() {
          return GSP_NO_RETURNED_VALUE;
        },
        GSSP_COMPONENT_MEMBER_ERROR: function() {
          return GSSP_COMPONENT_MEMBER_ERROR;
        },
        GSSP_NO_RETURNED_VALUE: function() {
          return GSSP_NO_RETURNED_VALUE;
        },
        INFINITE_CACHE: function() {
          return INFINITE_CACHE;
        },
        INSTRUMENTATION_HOOK_FILENAME: function() {
          return INSTRUMENTATION_HOOK_FILENAME;
        },
        MATCHED_PATH_HEADER: function() {
          return MATCHED_PATH_HEADER;
        },
        MIDDLEWARE_FILENAME: function() {
          return MIDDLEWARE_FILENAME;
        },
        MIDDLEWARE_LOCATION_REGEXP: function() {
          return MIDDLEWARE_LOCATION_REGEXP;
        },
        NEXT_BODY_SUFFIX: function() {
          return NEXT_BODY_SUFFIX;
        },
        NEXT_CACHE_IMPLICIT_TAG_ID: function() {
          return NEXT_CACHE_IMPLICIT_TAG_ID;
        },
        NEXT_CACHE_REVALIDATED_TAGS_HEADER: function() {
          return NEXT_CACHE_REVALIDATED_TAGS_HEADER;
        },
        NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER: function() {
          return NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER;
        },
        NEXT_CACHE_SOFT_TAG_MAX_LENGTH: function() {
          return NEXT_CACHE_SOFT_TAG_MAX_LENGTH;
        },
        NEXT_CACHE_TAGS_HEADER: function() {
          return NEXT_CACHE_TAGS_HEADER;
        },
        NEXT_CACHE_TAG_MAX_ITEMS: function() {
          return NEXT_CACHE_TAG_MAX_ITEMS;
        },
        NEXT_CACHE_TAG_MAX_LENGTH: function() {
          return NEXT_CACHE_TAG_MAX_LENGTH;
        },
        NEXT_DATA_SUFFIX: function() {
          return NEXT_DATA_SUFFIX;
        },
        NEXT_INTERCEPTION_MARKER_PREFIX: function() {
          return NEXT_INTERCEPTION_MARKER_PREFIX;
        },
        NEXT_META_SUFFIX: function() {
          return NEXT_META_SUFFIX;
        },
        NEXT_QUERY_PARAM_PREFIX: function() {
          return NEXT_QUERY_PARAM_PREFIX;
        },
        NEXT_RESUME_HEADER: function() {
          return NEXT_RESUME_HEADER;
        },
        NON_STANDARD_NODE_ENV: function() {
          return NON_STANDARD_NODE_ENV;
        },
        PAGES_DIR_ALIAS: function() {
          return PAGES_DIR_ALIAS;
        },
        PRERENDER_REVALIDATE_HEADER: function() {
          return PRERENDER_REVALIDATE_HEADER;
        },
        PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER: function() {
          return PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER;
        },
        PUBLIC_DIR_MIDDLEWARE_CONFLICT: function() {
          return PUBLIC_DIR_MIDDLEWARE_CONFLICT;
        },
        ROOT_DIR_ALIAS: function() {
          return ROOT_DIR_ALIAS;
        },
        RSC_ACTION_CLIENT_WRAPPER_ALIAS: function() {
          return RSC_ACTION_CLIENT_WRAPPER_ALIAS;
        },
        RSC_ACTION_ENCRYPTION_ALIAS: function() {
          return RSC_ACTION_ENCRYPTION_ALIAS;
        },
        RSC_ACTION_PROXY_ALIAS: function() {
          return RSC_ACTION_PROXY_ALIAS;
        },
        RSC_ACTION_VALIDATE_ALIAS: function() {
          return RSC_ACTION_VALIDATE_ALIAS;
        },
        RSC_CACHE_WRAPPER_ALIAS: function() {
          return RSC_CACHE_WRAPPER_ALIAS;
        },
        RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS: function() {
          return RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS;
        },
        RSC_MOD_REF_PROXY_ALIAS: function() {
          return RSC_MOD_REF_PROXY_ALIAS;
        },
        RSC_PREFETCH_SUFFIX: function() {
          return RSC_PREFETCH_SUFFIX;
        },
        RSC_SEGMENTS_DIR_SUFFIX: function() {
          return RSC_SEGMENTS_DIR_SUFFIX;
        },
        RSC_SEGMENT_SUFFIX: function() {
          return RSC_SEGMENT_SUFFIX;
        },
        RSC_SUFFIX: function() {
          return RSC_SUFFIX;
        },
        SERVER_PROPS_EXPORT_ERROR: function() {
          return SERVER_PROPS_EXPORT_ERROR;
        },
        SERVER_PROPS_GET_INIT_PROPS_CONFLICT: function() {
          return SERVER_PROPS_GET_INIT_PROPS_CONFLICT;
        },
        SERVER_PROPS_SSG_CONFLICT: function() {
          return SERVER_PROPS_SSG_CONFLICT;
        },
        SERVER_RUNTIME: function() {
          return SERVER_RUNTIME;
        },
        SSG_FALLBACK_EXPORT_ERROR: function() {
          return SSG_FALLBACK_EXPORT_ERROR;
        },
        SSG_GET_INITIAL_PROPS_CONFLICT: function() {
          return SSG_GET_INITIAL_PROPS_CONFLICT;
        },
        STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR: function() {
          return STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR;
        },
        UNSTABLE_REVALIDATE_RENAME_ERROR: function() {
          return UNSTABLE_REVALIDATE_RENAME_ERROR;
        },
        WEBPACK_LAYERS: function() {
          return WEBPACK_LAYERS;
        },
        WEBPACK_RESOURCE_QUERIES: function() {
          return WEBPACK_RESOURCE_QUERIES;
        }
      });
      var NEXT_QUERY_PARAM_PREFIX = "nxtP";
      var NEXT_INTERCEPTION_MARKER_PREFIX = "nxtI";
      var MATCHED_PATH_HEADER = "x-matched-path";
      var PRERENDER_REVALIDATE_HEADER = "x-prerender-revalidate";
      var PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER = "x-prerender-revalidate-if-generated";
      var RSC_PREFETCH_SUFFIX = ".prefetch.rsc";
      var RSC_SEGMENTS_DIR_SUFFIX = ".segments";
      var RSC_SEGMENT_SUFFIX = ".segment.rsc";
      var RSC_SUFFIX = ".rsc";
      var ACTION_SUFFIX = ".action";
      var NEXT_DATA_SUFFIX = ".json";
      var NEXT_META_SUFFIX = ".meta";
      var NEXT_BODY_SUFFIX = ".body";
      var NEXT_CACHE_TAGS_HEADER = "x-next-cache-tags";
      var NEXT_CACHE_REVALIDATED_TAGS_HEADER = "x-next-revalidated-tags";
      var NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER = "x-next-revalidate-tag-token";
      var NEXT_RESUME_HEADER = "next-resume";
      var NEXT_CACHE_TAG_MAX_ITEMS = 128;
      var NEXT_CACHE_TAG_MAX_LENGTH = 256;
      var NEXT_CACHE_SOFT_TAG_MAX_LENGTH = 1024;
      var NEXT_CACHE_IMPLICIT_TAG_ID = "_N_T_";
      var CACHE_ONE_YEAR = 31536e3;
      var INFINITE_CACHE = 4294967294;
      var MIDDLEWARE_FILENAME = "middleware";
      var MIDDLEWARE_LOCATION_REGEXP = `(?:src/)?${MIDDLEWARE_FILENAME}`;
      var INSTRUMENTATION_HOOK_FILENAME = "instrumentation";
      var PAGES_DIR_ALIAS = "private-next-pages";
      var DOT_NEXT_ALIAS = "private-dot-next";
      var ROOT_DIR_ALIAS = "private-next-root-dir";
      var APP_DIR_ALIAS = "private-next-app-dir";
      var RSC_MOD_REF_PROXY_ALIAS = "private-next-rsc-mod-ref-proxy";
      var RSC_ACTION_VALIDATE_ALIAS = "private-next-rsc-action-validate";
      var RSC_ACTION_PROXY_ALIAS = "private-next-rsc-server-reference";
      var RSC_CACHE_WRAPPER_ALIAS = "private-next-rsc-cache-wrapper";
      var RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS = "private-next-rsc-track-dynamic-import";
      var RSC_ACTION_ENCRYPTION_ALIAS = "private-next-rsc-action-encryption";
      var RSC_ACTION_CLIENT_WRAPPER_ALIAS = "private-next-rsc-action-client-wrapper";
      var PUBLIC_DIR_MIDDLEWARE_CONFLICT = `You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict`;
      var SSG_GET_INITIAL_PROPS_CONFLICT = `You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`;
      var SERVER_PROPS_GET_INIT_PROPS_CONFLICT = `You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`;
      var SERVER_PROPS_SSG_CONFLICT = `You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps`;
      var STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = `can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props`;
      var SERVER_PROPS_EXPORT_ERROR = `pages with \`getServerSideProps\` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export`;
      var GSP_NO_RETURNED_VALUE = "Your `getStaticProps` function did not return an object. Did you forget to add a `return`?";
      var GSSP_NO_RETURNED_VALUE = "Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?";
      var UNSTABLE_REVALIDATE_RENAME_ERROR = "The `unstable_revalidate` property is available for general use.\nPlease use `revalidate` instead.";
      var GSSP_COMPONENT_MEMBER_ERROR = `can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member`;
      var NON_STANDARD_NODE_ENV = `You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env`;
      var SSG_FALLBACK_EXPORT_ERROR = `Pages with \`fallback\` enabled in \`getStaticPaths\` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export`;
      var ESLINT_DEFAULT_DIRS = [
        "app",
        "pages",
        "components",
        "lib",
        "src"
      ];
      var SERVER_RUNTIME = {
        edge: "edge",
        experimentalEdge: "experimental-edge",
        nodejs: "nodejs"
      };
      var WEBPACK_LAYERS_NAMES = {
        /**
        * The layer for the shared code between the client and server bundles.
        */
        shared: "shared",
        /**
        * The layer for server-only runtime and picking up `react-server` export conditions.
        * Including app router RSC pages and app router custom routes and metadata routes.
        */
        reactServerComponents: "rsc",
        /**
        * Server Side Rendering layer for app (ssr).
        */
        serverSideRendering: "ssr",
        /**
        * The browser client bundle layer for actions.
        */
        actionBrowser: "action-browser",
        /**
        * The Node.js bundle layer for the API routes.
        */
        apiNode: "api-node",
        /**
        * The Edge Lite bundle layer for the API routes.
        */
        apiEdge: "api-edge",
        /**
        * The layer for the middleware code.
        */
        middleware: "middleware",
        /**
        * The layer for the instrumentation hooks.
        */
        instrument: "instrument",
        /**
        * The layer for assets on the edge.
        */
        edgeAsset: "edge-asset",
        /**
        * The browser client bundle layer for App directory.
        */
        appPagesBrowser: "app-pages-browser",
        /**
        * The browser client bundle layer for Pages directory.
        */
        pagesDirBrowser: "pages-dir-browser",
        /**
        * The Edge Lite bundle layer for Pages directory.
        */
        pagesDirEdge: "pages-dir-edge",
        /**
        * The Node.js bundle layer for Pages directory.
        */
        pagesDirNode: "pages-dir-node"
      };
      var WEBPACK_LAYERS = {
        ...WEBPACK_LAYERS_NAMES,
        GROUP: {
          builtinReact: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser
          ],
          serverOnly: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.instrument,
            WEBPACK_LAYERS_NAMES.middleware
          ],
          neutralTarget: [
            // pages api
            WEBPACK_LAYERS_NAMES.apiNode,
            WEBPACK_LAYERS_NAMES.apiEdge
          ],
          clientOnly: [
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser
          ],
          bundled: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser,
            WEBPACK_LAYERS_NAMES.shared,
            WEBPACK_LAYERS_NAMES.instrument,
            WEBPACK_LAYERS_NAMES.middleware
          ],
          appPages: [
            // app router pages and layouts
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser,
            WEBPACK_LAYERS_NAMES.actionBrowser
          ]
        }
      };
      var WEBPACK_RESOURCE_QUERIES = {
        edgeSSREntry: "__next_edge_ssr_entry__",
        metadata: "__next_metadata__",
        metadataRoute: "__next_metadata_route__",
        metadataImageMeta: "__next_metadata_image_meta__"
      };
    }
  });

  // node_modules/next/dist/server/web/utils.js
  var require_utils = __commonJS({
    "node_modules/next/dist/server/web/utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        fromNodeOutgoingHttpHeaders: function() {
          return fromNodeOutgoingHttpHeaders;
        },
        normalizeNextQueryParam: function() {
          return normalizeNextQueryParam;
        },
        splitCookiesString: function() {
          return splitCookiesString;
        },
        toNodeOutgoingHttpHeaders: function() {
          return toNodeOutgoingHttpHeaders;
        },
        validateURL: function() {
          return validateURL;
        }
      });
      var _constants = require_constants();
      function fromNodeOutgoingHttpHeaders(nodeHeaders) {
        const headers = new Headers();
        for (let [key, value] of Object.entries(nodeHeaders)) {
          const values = Array.isArray(value) ? value : [
            value
          ];
          for (let v of values) {
            if (typeof v === "undefined")
              continue;
            if (typeof v === "number") {
              v = v.toString();
            }
            headers.append(key, v);
          }
        }
        return headers;
      }
      function splitCookiesString(cookiesString) {
        var cookiesStrings = [];
        var pos = 0;
        var start;
        var ch;
        var lastComma;
        var nextStart;
        var cookiesSeparatorFound;
        function skipWhitespace() {
          while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
            pos += 1;
          }
          return pos < cookiesString.length;
        }
        function notSpecialChar() {
          ch = cookiesString.charAt(pos);
          return ch !== "=" && ch !== ";" && ch !== ",";
        }
        while (pos < cookiesString.length) {
          start = pos;
          cookiesSeparatorFound = false;
          while (skipWhitespace()) {
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
              lastComma = pos;
              pos += 1;
              skipWhitespace();
              nextStart = pos;
              while (pos < cookiesString.length && notSpecialChar()) {
                pos += 1;
              }
              if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                cookiesSeparatorFound = true;
                pos = nextStart;
                cookiesStrings.push(cookiesString.substring(start, lastComma));
                start = pos;
              } else {
                pos = lastComma + 1;
              }
            } else {
              pos += 1;
            }
          }
          if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
          }
        }
        return cookiesStrings;
      }
      function toNodeOutgoingHttpHeaders(headers) {
        const nodeHeaders = {};
        const cookies = [];
        if (headers) {
          for (const [key, value] of headers.entries()) {
            if (key.toLowerCase() === "set-cookie") {
              cookies.push(...splitCookiesString(value));
              nodeHeaders[key] = cookies.length === 1 ? cookies[0] : cookies;
            } else {
              nodeHeaders[key] = value;
            }
          }
        }
        return nodeHeaders;
      }
      function validateURL(url) {
        try {
          return String(new URL(String(url)));
        } catch (error) {
          throw Object.defineProperty(new Error(`URL is malformed "${String(url)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, {
            cause: error
          }), "__NEXT_ERROR_CODE", {
            value: "E61",
            enumerable: false,
            configurable: true
          });
        }
      }
      function normalizeNextQueryParam(key) {
        const prefixes = [
          _constants.NEXT_QUERY_PARAM_PREFIX,
          _constants.NEXT_INTERCEPTION_MARKER_PREFIX
        ];
        for (const prefix of prefixes) {
          if (key !== prefix && key.startsWith(prefix)) {
            return key.substring(prefix.length);
          }
        }
        return null;
      }
    }
  });

  // node_modules/next/dist/server/web/error.js
  var require_error = __commonJS({
    "node_modules/next/dist/server/web/error.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        PageSignatureError: function() {
          return PageSignatureError;
        },
        RemovedPageError: function() {
          return RemovedPageError;
        },
        RemovedUAError: function() {
          return RemovedUAError;
        }
      });
      var PageSignatureError = class extends Error {
        constructor({ page }) {
          super(`The middleware "${page}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      };
      var RemovedPageError = class extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      };
      var RemovedUAError = class extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      };
    }
  });

  // node_modules/next/dist/compiled/@edge-runtime/cookies/index.js
  var require_cookies = __commonJS({
    "node_modules/next/dist/compiled/@edge-runtime/cookies/index.js"(exports, module) {
      "use strict";
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export2 = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var src_exports = {};
      __export2(src_exports, {
        RequestCookies: () => RequestCookies,
        ResponseCookies: () => ResponseCookies,
        parseCookie: () => parseCookie,
        parseSetCookie: () => parseSetCookie,
        stringifyCookie: () => stringifyCookie
      });
      module.exports = __toCommonJS(src_exports);
      function stringifyCookie(c) {
        var _a;
        const attrs = [
          "path" in c && c.path && `Path=${c.path}`,
          "expires" in c && (c.expires || c.expires === 0) && `Expires=${(typeof c.expires === "number" ? new Date(c.expires) : c.expires).toUTCString()}`,
          "maxAge" in c && typeof c.maxAge === "number" && `Max-Age=${c.maxAge}`,
          "domain" in c && c.domain && `Domain=${c.domain}`,
          "secure" in c && c.secure && "Secure",
          "httpOnly" in c && c.httpOnly && "HttpOnly",
          "sameSite" in c && c.sameSite && `SameSite=${c.sameSite}`,
          "partitioned" in c && c.partitioned && "Partitioned",
          "priority" in c && c.priority && `Priority=${c.priority}`
        ].filter(Boolean);
        const stringified = `${c.name}=${encodeURIComponent((_a = c.value) != null ? _a : "")}`;
        return attrs.length === 0 ? stringified : `${stringified}; ${attrs.join("; ")}`;
      }
      function parseCookie(cookie) {
        const map = /* @__PURE__ */ new Map();
        for (const pair of cookie.split(/; */)) {
          if (!pair)
            continue;
          const splitAt = pair.indexOf("=");
          if (splitAt === -1) {
            map.set(pair, "true");
            continue;
          }
          const [key, value] = [pair.slice(0, splitAt), pair.slice(splitAt + 1)];
          try {
            map.set(key, decodeURIComponent(value != null ? value : "true"));
          } catch {
          }
        }
        return map;
      }
      function parseSetCookie(setCookie) {
        if (!setCookie) {
          return void 0;
        }
        const [[name, value], ...attributes] = parseCookie(setCookie);
        const {
          domain,
          expires,
          httponly,
          maxage,
          path,
          samesite,
          secure,
          partitioned,
          priority
        } = Object.fromEntries(
          attributes.map(([key, value2]) => [
            key.toLowerCase().replace(/-/g, ""),
            value2
          ])
        );
        const cookie = {
          name,
          value: decodeURIComponent(value),
          domain,
          ...expires && { expires: new Date(expires) },
          ...httponly && { httpOnly: true },
          ...typeof maxage === "string" && { maxAge: Number(maxage) },
          path,
          ...samesite && { sameSite: parseSameSite(samesite) },
          ...secure && { secure: true },
          ...priority && { priority: parsePriority(priority) },
          ...partitioned && { partitioned: true }
        };
        return compact(cookie);
      }
      function compact(t) {
        const newT = {};
        for (const key in t) {
          if (t[key]) {
            newT[key] = t[key];
          }
        }
        return newT;
      }
      var SAME_SITE = ["strict", "lax", "none"];
      function parseSameSite(string) {
        string = string.toLowerCase();
        return SAME_SITE.includes(string) ? string : void 0;
      }
      var PRIORITY = ["low", "medium", "high"];
      function parsePriority(string) {
        string = string.toLowerCase();
        return PRIORITY.includes(string) ? string : void 0;
      }
      function splitCookiesString(cookiesString) {
        if (!cookiesString)
          return [];
        var cookiesStrings = [];
        var pos = 0;
        var start;
        var ch;
        var lastComma;
        var nextStart;
        var cookiesSeparatorFound;
        function skipWhitespace() {
          while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
            pos += 1;
          }
          return pos < cookiesString.length;
        }
        function notSpecialChar() {
          ch = cookiesString.charAt(pos);
          return ch !== "=" && ch !== ";" && ch !== ",";
        }
        while (pos < cookiesString.length) {
          start = pos;
          cookiesSeparatorFound = false;
          while (skipWhitespace()) {
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
              lastComma = pos;
              pos += 1;
              skipWhitespace();
              nextStart = pos;
              while (pos < cookiesString.length && notSpecialChar()) {
                pos += 1;
              }
              if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                cookiesSeparatorFound = true;
                pos = nextStart;
                cookiesStrings.push(cookiesString.substring(start, lastComma));
                start = pos;
              } else {
                pos = lastComma + 1;
              }
            } else {
              pos += 1;
            }
          }
          if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
          }
        }
        return cookiesStrings;
      }
      var RequestCookies = class {
        constructor(requestHeaders) {
          this._parsed = /* @__PURE__ */ new Map();
          this._headers = requestHeaders;
          const header = requestHeaders.get("cookie");
          if (header) {
            const parsed = parseCookie(header);
            for (const [name, value] of parsed) {
              this._parsed.set(name, { name, value });
            }
          }
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        /**
         * The amount of cookies received from the client
         */
        get size() {
          return this._parsed.size;
        }
        get(...args) {
          const name = typeof args[0] === "string" ? args[0] : args[0].name;
          return this._parsed.get(name);
        }
        getAll(...args) {
          var _a;
          const all = Array.from(this._parsed);
          if (!args.length) {
            return all.map(([_, value]) => value);
          }
          const name = typeof args[0] === "string" ? args[0] : (_a = args[0]) == null ? void 0 : _a.name;
          return all.filter(([n]) => n === name).map(([_, value]) => value);
        }
        has(name) {
          return this._parsed.has(name);
        }
        set(...args) {
          const [name, value] = args.length === 1 ? [args[0].name, args[0].value] : args;
          const map = this._parsed;
          map.set(name, { name, value });
          this._headers.set(
            "cookie",
            Array.from(map).map(([_, value2]) => stringifyCookie(value2)).join("; ")
          );
          return this;
        }
        /**
         * Delete the cookies matching the passed name or names in the request.
         */
        delete(names) {
          const map = this._parsed;
          const result = !Array.isArray(names) ? map.delete(names) : names.map((name) => map.delete(name));
          this._headers.set(
            "cookie",
            Array.from(map).map(([_, value]) => stringifyCookie(value)).join("; ")
          );
          return result;
        }
        /**
         * Delete all the cookies in the cookies in the request.
         */
        clear() {
          this.delete(Array.from(this._parsed.keys()));
          return this;
        }
        /**
         * Format the cookies in the request as a string for logging
         */
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((v) => `${v.name}=${encodeURIComponent(v.value)}`).join("; ");
        }
      };
      var ResponseCookies = class {
        constructor(responseHeaders) {
          this._parsed = /* @__PURE__ */ new Map();
          var _a, _b, _c;
          this._headers = responseHeaders;
          const setCookie = (_c = (_b = (_a = responseHeaders.getSetCookie) == null ? void 0 : _a.call(responseHeaders)) != null ? _b : responseHeaders.get("set-cookie")) != null ? _c : [];
          const cookieStrings = Array.isArray(setCookie) ? setCookie : splitCookiesString(setCookie);
          for (const cookieString of cookieStrings) {
            const parsed = parseSetCookie(cookieString);
            if (parsed)
              this._parsed.set(parsed.name, parsed);
          }
        }
        /**
         * {@link https://wicg.github.io/cookie-store/#CookieStore-get CookieStore#get} without the Promise.
         */
        get(...args) {
          const key = typeof args[0] === "string" ? args[0] : args[0].name;
          return this._parsed.get(key);
        }
        /**
         * {@link https://wicg.github.io/cookie-store/#CookieStore-getAll CookieStore#getAll} without the Promise.
         */
        getAll(...args) {
          var _a;
          const all = Array.from(this._parsed.values());
          if (!args.length) {
            return all;
          }
          const key = typeof args[0] === "string" ? args[0] : (_a = args[0]) == null ? void 0 : _a.name;
          return all.filter((c) => c.name === key);
        }
        has(name) {
          return this._parsed.has(name);
        }
        /**
         * {@link https://wicg.github.io/cookie-store/#CookieStore-set CookieStore#set} without the Promise.
         */
        set(...args) {
          const [name, value, cookie] = args.length === 1 ? [args[0].name, args[0].value, args[0]] : args;
          const map = this._parsed;
          map.set(name, normalizeCookie({ name, value, ...cookie }));
          replace(map, this._headers);
          return this;
        }
        /**
         * {@link https://wicg.github.io/cookie-store/#CookieStore-delete CookieStore#delete} without the Promise.
         */
        delete(...args) {
          const [name, options] = typeof args[0] === "string" ? [args[0]] : [args[0].name, args[0]];
          return this.set({ ...options, name, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(stringifyCookie).join("; ");
        }
      };
      function replace(bag, headers) {
        headers.delete("set-cookie");
        for (const [, value] of bag) {
          const serialized = stringifyCookie(value);
          headers.append("set-cookie", serialized);
        }
      }
      function normalizeCookie(cookie = { name: "", value: "" }) {
        if (typeof cookie.expires === "number") {
          cookie.expires = new Date(cookie.expires);
        }
        if (cookie.maxAge) {
          cookie.expires = new Date(Date.now() + cookie.maxAge * 1e3);
        }
        if (cookie.path === null || cookie.path === void 0) {
          cookie.path = "/";
        }
        return cookie;
      }
    }
  });

  // node_modules/next/dist/server/web/spec-extension/cookies.js
  var require_cookies2 = __commonJS({
    "node_modules/next/dist/server/web/spec-extension/cookies.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        RequestCookies: function() {
          return _cookies.RequestCookies;
        },
        ResponseCookies: function() {
          return _cookies.ResponseCookies;
        },
        stringifyCookie: function() {
          return _cookies.stringifyCookie;
        }
      });
      var _cookies = require_cookies();
    }
  });

  // node_modules/next/dist/server/web/spec-extension/request.js
  var require_request = __commonJS({
    "node_modules/next/dist/server/web/spec-extension/request.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        INTERNALS: function() {
          return INTERNALS;
        },
        NextRequest: function() {
          return NextRequest;
        }
      });
      var _nexturl = require_next_url();
      var _utils = require_utils();
      var _error = require_error();
      var _cookies = require_cookies2();
      var INTERNALS = Symbol("internal request");
      var NextRequest = class extends Request {
        constructor(input, init = {}) {
          const url = typeof input !== "string" && "url" in input ? input.url : String(input);
          (0, _utils.validateURL)(url);
          if (process.env.NEXT_RUNTIME !== "edge") {
            if (init.body && init.duplex !== "half") {
              init.duplex = "half";
            }
          }
          if (input instanceof Request)
            super(input, init);
          else
            super(url, init);
          const nextUrl = new _nexturl.NextURL(url, {
            headers: (0, _utils.toNodeOutgoingHttpHeaders)(this.headers),
            nextConfig: init.nextConfig
          });
          this[INTERNALS] = {
            cookies: new _cookies.RequestCookies(this.headers),
            nextUrl,
            url: process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE ? url : nextUrl.toString()
          };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return {
            cookies: this.cookies,
            nextUrl: this.nextUrl,
            url: this.url,
            // rest of props come from Request
            bodyUsed: this.bodyUsed,
            cache: this.cache,
            credentials: this.credentials,
            destination: this.destination,
            headers: Object.fromEntries(this.headers),
            integrity: this.integrity,
            keepalive: this.keepalive,
            method: this.method,
            mode: this.mode,
            redirect: this.redirect,
            referrer: this.referrer,
            referrerPolicy: this.referrerPolicy,
            signal: this.signal
          };
        }
        get cookies() {
          return this[INTERNALS].cookies;
        }
        get nextUrl() {
          return this[INTERNALS].nextUrl;
        }
        /**
        * @deprecated
        * `page` has been deprecated in favour of `URLPattern`.
        * Read more: https://nextjs.org/docs/messages/middleware-request-page
        */
        get page() {
          throw new _error.RemovedPageError();
        }
        /**
        * @deprecated
        * `ua` has been removed in favour of \`userAgent\` function.
        * Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
        */
        get ua() {
          throw new _error.RemovedUAError();
        }
        get url() {
          return this[INTERNALS].url;
        }
      };
    }
  });

  // node_modules/next/dist/server/web/spec-extension/adapters/reflect.js
  var require_reflect = __commonJS({
    "node_modules/next/dist/server/web/spec-extension/adapters/reflect.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "ReflectAdapter", {
        enumerable: true,
        get: function() {
          return ReflectAdapter;
        }
      });
      var ReflectAdapter = class {
        static get(target, prop, receiver) {
          const value = Reflect.get(target, prop, receiver);
          if (typeof value === "function") {
            return value.bind(target);
          }
          return value;
        }
        static set(target, prop, value, receiver) {
          return Reflect.set(target, prop, value, receiver);
        }
        static has(target, prop) {
          return Reflect.has(target, prop);
        }
        static deleteProperty(target, prop) {
          return Reflect.deleteProperty(target, prop);
        }
      };
    }
  });

  // node_modules/next/dist/server/web/spec-extension/response.js
  var require_response = __commonJS({
    "node_modules/next/dist/server/web/spec-extension/response.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "NextResponse", {
        enumerable: true,
        get: function() {
          return NextResponse2;
        }
      });
      var _cookies = require_cookies2();
      var _nexturl = require_next_url();
      var _utils = require_utils();
      var _reflect = require_reflect();
      var _cookies1 = require_cookies2();
      var INTERNALS = Symbol("internal response");
      var REDIRECTS = /* @__PURE__ */ new Set([
        301,
        302,
        303,
        307,
        308
      ]);
      function handleMiddlewareField(init, headers) {
        var _init_request;
        if (init == null ? void 0 : (_init_request = init.request) == null ? void 0 : _init_request.headers) {
          if (!(init.request.headers instanceof Headers)) {
            throw Object.defineProperty(new Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", {
              value: "E119",
              enumerable: false,
              configurable: true
            });
          }
          const keys = [];
          for (const [key, value] of init.request.headers) {
            headers.set("x-middleware-request-" + key, value);
            keys.push(key);
          }
          headers.set("x-middleware-override-headers", keys.join(","));
        }
      }
      var NextResponse2 = class _NextResponse extends Response {
        constructor(body, init = {}) {
          super(body, init);
          const headers = this.headers;
          const cookies = new _cookies1.ResponseCookies(headers);
          const cookiesProxy = new Proxy(cookies, {
            get(target, prop, receiver) {
              switch (prop) {
                case "delete":
                case "set": {
                  return (...args) => {
                    const result = Reflect.apply(target[prop], target, args);
                    const newHeaders = new Headers(headers);
                    if (result instanceof _cookies1.ResponseCookies) {
                      headers.set("x-middleware-set-cookie", result.getAll().map((cookie) => (0, _cookies.stringifyCookie)(cookie)).join(","));
                    }
                    handleMiddlewareField(init, newHeaders);
                    return result;
                  };
                }
                default:
                  return _reflect.ReflectAdapter.get(target, prop, receiver);
              }
            }
          });
          this[INTERNALS] = {
            cookies: cookiesProxy,
            url: init.url ? new _nexturl.NextURL(init.url, {
              headers: (0, _utils.toNodeOutgoingHttpHeaders)(headers),
              nextConfig: init.nextConfig
            }) : void 0
          };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return {
            cookies: this.cookies,
            url: this.url,
            // rest of props come from Response
            body: this.body,
            bodyUsed: this.bodyUsed,
            headers: Object.fromEntries(this.headers),
            ok: this.ok,
            redirected: this.redirected,
            status: this.status,
            statusText: this.statusText,
            type: this.type
          };
        }
        get cookies() {
          return this[INTERNALS].cookies;
        }
        static json(body, init) {
          const response = Response.json(body, init);
          return new _NextResponse(response.body, response);
        }
        static redirect(url, init) {
          const status = typeof init === "number" ? init : (init == null ? void 0 : init.status) ?? 307;
          if (!REDIRECTS.has(status)) {
            throw Object.defineProperty(new RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", {
              value: "E529",
              enumerable: false,
              configurable: true
            });
          }
          const initObj = typeof init === "object" ? init : {};
          const headers = new Headers(initObj == null ? void 0 : initObj.headers);
          headers.set("Location", (0, _utils.validateURL)(url));
          return new _NextResponse(null, {
            ...initObj,
            headers,
            status
          });
        }
        static rewrite(destination, init) {
          const headers = new Headers(init == null ? void 0 : init.headers);
          headers.set("x-middleware-rewrite", (0, _utils.validateURL)(destination));
          handleMiddlewareField(init, headers);
          return new _NextResponse(null, {
            ...init,
            headers
          });
        }
        static next(init) {
          const headers = new Headers(init == null ? void 0 : init.headers);
          headers.set("x-middleware-next", "1");
          handleMiddlewareField(init, headers);
          return new _NextResponse(null, {
            ...init,
            headers
          });
        }
      };
    }
  });

  // node_modules/next/dist/server/web/spec-extension/image-response.js
  var require_image_response = __commonJS({
    "node_modules/next/dist/server/web/spec-extension/image-response.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "ImageResponse", {
        enumerable: true,
        get: function() {
          return ImageResponse;
        }
      });
      function ImageResponse() {
        throw Object.defineProperty(new Error('ImageResponse moved from "next/server" to "next/og" since Next.js 14, please import from "next/og" instead'), "__NEXT_ERROR_CODE", {
          value: "E183",
          enumerable: false,
          configurable: true
        });
      }
    }
  });

  // node_modules/next/dist/compiled/ua-parser-js/ua-parser.js
  var require_ua_parser = __commonJS({
    "node_modules/next/dist/compiled/ua-parser-js/ua-parser.js"(exports, module) {
      (() => {
        var i = { 226: function(i2, e2) {
          (function(o2, a) {
            "use strict";
            var r = "1.0.35", t = "", n = "?", s = "function", b = "undefined", w = "object", l = "string", d = "major", c = "model", u = "name", p = "type", m = "vendor", f = "version", h = "architecture", v = "console", g = "mobile", k = "tablet", x = "smarttv", _ = "wearable", y = "embedded", q = 350;
            var T = "Amazon", S = "Apple", z = "ASUS", N = "BlackBerry", A = "Browser", C = "Chrome", E = "Edge", O = "Firefox", U = "Google", j = "Huawei", P = "LG", R = "Microsoft", M = "Motorola", B = "Opera", V = "Samsung", D = "Sharp", I = "Sony", W = "Viera", F = "Xiaomi", G = "Zebra", H = "Facebook", L = "Chromium OS", Z = "Mac OS";
            var extend = function(i3, e3) {
              var o3 = {};
              for (var a2 in i3) {
                if (e3[a2] && e3[a2].length % 2 === 0) {
                  o3[a2] = e3[a2].concat(i3[a2]);
                } else {
                  o3[a2] = i3[a2];
                }
              }
              return o3;
            }, enumerize = function(i3) {
              var e3 = {};
              for (var o3 = 0; o3 < i3.length; o3++) {
                e3[i3[o3].toUpperCase()] = i3[o3];
              }
              return e3;
            }, has = function(i3, e3) {
              return typeof i3 === l ? lowerize(e3).indexOf(lowerize(i3)) !== -1 : false;
            }, lowerize = function(i3) {
              return i3.toLowerCase();
            }, majorize = function(i3) {
              return typeof i3 === l ? i3.replace(/[^\d\.]/g, t).split(".")[0] : a;
            }, trim = function(i3, e3) {
              if (typeof i3 === l) {
                i3 = i3.replace(/^\s\s*/, t);
                return typeof e3 === b ? i3 : i3.substring(0, q);
              }
            };
            var rgxMapper = function(i3, e3) {
              var o3 = 0, r2, t2, n2, b2, l2, d2;
              while (o3 < e3.length && !l2) {
                var c2 = e3[o3], u2 = e3[o3 + 1];
                r2 = t2 = 0;
                while (r2 < c2.length && !l2) {
                  if (!c2[r2]) {
                    break;
                  }
                  l2 = c2[r2++].exec(i3);
                  if (!!l2) {
                    for (n2 = 0; n2 < u2.length; n2++) {
                      d2 = l2[++t2];
                      b2 = u2[n2];
                      if (typeof b2 === w && b2.length > 0) {
                        if (b2.length === 2) {
                          if (typeof b2[1] == s) {
                            this[b2[0]] = b2[1].call(this, d2);
                          } else {
                            this[b2[0]] = b2[1];
                          }
                        } else if (b2.length === 3) {
                          if (typeof b2[1] === s && !(b2[1].exec && b2[1].test)) {
                            this[b2[0]] = d2 ? b2[1].call(this, d2, b2[2]) : a;
                          } else {
                            this[b2[0]] = d2 ? d2.replace(b2[1], b2[2]) : a;
                          }
                        } else if (b2.length === 4) {
                          this[b2[0]] = d2 ? b2[3].call(this, d2.replace(b2[1], b2[2])) : a;
                        }
                      } else {
                        this[b2] = d2 ? d2 : a;
                      }
                    }
                  }
                }
                o3 += 2;
              }
            }, strMapper = function(i3, e3) {
              for (var o3 in e3) {
                if (typeof e3[o3] === w && e3[o3].length > 0) {
                  for (var r2 = 0; r2 < e3[o3].length; r2++) {
                    if (has(e3[o3][r2], i3)) {
                      return o3 === n ? a : o3;
                    }
                  }
                } else if (has(e3[o3], i3)) {
                  return o3 === n ? a : o3;
                }
              }
              return i3;
            };
            var $ = { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }, X = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" };
            var K = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [f, [u, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [f, [u, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [u, f], [/opios[\/ ]+([\w\.]+)/i], [f, [u, B + " Mini"]], [/\bopr\/([\w\.]+)/i], [f, [u, B]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [u, f], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [f, [u, "UC" + A]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [f, [u, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [f, [u, "WeChat"]], [/konqueror\/([\w\.]+)/i], [f, [u, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [f, [u, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [f, [u, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[u, /(.+)/, "$1 Secure " + A], f], [/\bfocus\/([\w\.]+)/i], [f, [u, O + " Focus"]], [/\bopt\/([\w\.]+)/i], [f, [u, B + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [f, [u, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [f, [u, "Dolphin"]], [/coast\/([\w\.]+)/i], [f, [u, B + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [f, [u, "MIUI " + A]], [/fxios\/([-\w\.]+)/i], [f, [u, O]], [/\bqihu|(qi?ho?o?|360)browser/i], [[u, "360 " + A]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[u, /(.+)/, "$1 " + A], f], [/(comodo_dragon)\/([\w\.]+)/i], [[u, /_/g, " "], f], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [u, f], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [u], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[u, H], f], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [u, f], [/\bgsa\/([\w\.]+) .*safari\//i], [f, [u, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [f, [u, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [f, [u, C + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[u, C + " WebView"], f], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [f, [u, "Android " + A]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [u, f], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [f, [u, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [f, u], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [u, [f, strMapper, $]], [/(webkit|khtml)\/([\w\.]+)/i], [u, f], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[u, "Netscape"], f], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [f, [u, O + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [u, f], [/(cobalt)\/([\w\.]+)/i], [u, [f, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[h, "amd64"]], [/(ia32(?=;))/i], [[h, lowerize]], [/((?:i[346]|x)86)[;\)]/i], [[h, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[h, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[h, "armhf"]], [/windows (ce|mobile); ppc;/i], [[h, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[h, /ower/, t, lowerize]], [/(sun4\w)[;\)]/i], [[h, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[h, lowerize]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [c, [m, V], [p, k]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [c, [m, V], [p, g]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [c, [m, S], [p, g]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [c, [m, S], [p, k]], [/(macintosh);/i], [c, [m, S]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [c, [m, D], [p, g]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [c, [m, j], [p, k]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [c, [m, j], [p, g]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[c, /_/g, " "], [m, F], [p, g]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[c, /_/g, " "], [m, F], [p, k]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [c, [m, "OPPO"], [p, g]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [c, [m, "Vivo"], [p, g]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [c, [m, "Realme"], [p, g]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [c, [m, M], [p, g]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [c, [m, M], [p, k]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [c, [m, P], [p, k]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [c, [m, P], [p, g]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [c, [m, "Lenovo"], [p, k]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[c, /_/g, " "], [m, "Nokia"], [p, g]], [/(pixel c)\b/i], [c, [m, U], [p, k]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [c, [m, U], [p, g]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [c, [m, I], [p, g]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[c, "Xperia Tablet"], [m, I], [p, k]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [c, [m, "OnePlus"], [p, g]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [c, [m, T], [p, k]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[c, /(.+)/g, "Fire Phone $1"], [m, T], [p, g]], [/(playbook);[-\w\),; ]+(rim)/i], [c, m, [p, k]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [c, [m, N], [p, g]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [c, [m, z], [p, k]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [c, [m, z], [p, g]], [/(nexus 9)/i], [c, [m, "HTC"], [p, k]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [m, [c, /_/g, " "], [p, g]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [c, [m, "Acer"], [p, k]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [c, [m, "Meizu"], [p, g]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [m, c, [p, g]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [m, c, [p, k]], [/(surface duo)/i], [c, [m, R], [p, k]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [c, [m, "Fairphone"], [p, g]], [/(u304aa)/i], [c, [m, "AT&T"], [p, g]], [/\bsie-(\w*)/i], [c, [m, "Siemens"], [p, g]], [/\b(rct\w+) b/i], [c, [m, "RCA"], [p, k]], [/\b(venue[\d ]{2,7}) b/i], [c, [m, "Dell"], [p, k]], [/\b(q(?:mv|ta)\w+) b/i], [c, [m, "Verizon"], [p, k]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [c, [m, "Barnes & Noble"], [p, k]], [/\b(tm\d{3}\w+) b/i], [c, [m, "NuVision"], [p, k]], [/\b(k88) b/i], [c, [m, "ZTE"], [p, k]], [/\b(nx\d{3}j) b/i], [c, [m, "ZTE"], [p, g]], [/\b(gen\d{3}) b.+49h/i], [c, [m, "Swiss"], [p, g]], [/\b(zur\d{3}) b/i], [c, [m, "Swiss"], [p, k]], [/\b((zeki)?tb.*\b) b/i], [c, [m, "Zeki"], [p, k]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[m, "Dragon Touch"], c, [p, k]], [/\b(ns-?\w{0,9}) b/i], [c, [m, "Insignia"], [p, k]], [/\b((nxa|next)-?\w{0,9}) b/i], [c, [m, "NextBook"], [p, k]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[m, "Voice"], c, [p, g]], [/\b(lvtel\-)?(v1[12]) b/i], [[m, "LvTel"], c, [p, g]], [/\b(ph-1) /i], [c, [m, "Essential"], [p, g]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [c, [m, "Envizen"], [p, k]], [/\b(trio[-\w\. ]+) b/i], [c, [m, "MachSpeed"], [p, k]], [/\btu_(1491) b/i], [c, [m, "Rotor"], [p, k]], [/(shield[\w ]+) b/i], [c, [m, "Nvidia"], [p, k]], [/(sprint) (\w+)/i], [m, c, [p, g]], [/(kin\.[onetw]{3})/i], [[c, /\./g, " "], [m, R], [p, g]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [c, [m, G], [p, k]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [c, [m, G], [p, g]], [/smart-tv.+(samsung)/i], [m, [p, x]], [/hbbtv.+maple;(\d+)/i], [[c, /^/, "SmartTV"], [m, V], [p, x]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[m, P], [p, x]], [/(apple) ?tv/i], [m, [c, S + " TV"], [p, x]], [/crkey/i], [[c, C + "cast"], [m, U], [p, x]], [/droid.+aft(\w)( bui|\))/i], [c, [m, T], [p, x]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [c, [m, D], [p, x]], [/(bravia[\w ]+)( bui|\))/i], [c, [m, I], [p, x]], [/(mitv-\w{5}) bui/i], [c, [m, F], [p, x]], [/Hbbtv.*(technisat) (.*);/i], [m, c, [p, x]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[m, trim], [c, trim], [p, x]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[p, x]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [m, c, [p, v]], [/droid.+; (shield) bui/i], [c, [m, "Nvidia"], [p, v]], [/(playstation [345portablevi]+)/i], [c, [m, I], [p, v]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [c, [m, R], [p, v]], [/((pebble))app/i], [m, c, [p, _]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [c, [m, S], [p, _]], [/droid.+; (glass) \d/i], [c, [m, U], [p, _]], [/droid.+; (wt63?0{2,3})\)/i], [c, [m, G], [p, _]], [/(quest( 2| pro)?)/i], [c, [m, H], [p, _]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [m, [p, y]], [/(aeobc)\b/i], [c, [m, T], [p, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [c, [p, g]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [c, [p, k]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[p, k]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[p, g]], [/(android[-\w\. ]{0,9});.+buil/i], [c, [m, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [f, [u, E + "HTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [f, [u, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [u, f], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [f, u]], os: [[/microsoft (windows) (vista|xp)/i], [u, f], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [u, [f, strMapper, X]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[u, "Windows"], [f, strMapper, X]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[f, /_/g, "."], [u, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[u, Z], [f, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [f, u], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [u, f], [/\(bb(10);/i], [f, [u, N]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [f, [u, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [f, [u, O + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [f, [u, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [f, [u, "watchOS"]], [/crkey\/([\d\.]+)/i], [f, [u, C + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[u, L], f], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [u, f], [/(sunos) ?([\w\.\d]*)/i], [[u, "Solaris"], f], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [u, f]] };
            var UAParser = function(i3, e3) {
              if (typeof i3 === w) {
                e3 = i3;
                i3 = a;
              }
              if (!(this instanceof UAParser)) {
                return new UAParser(i3, e3).getResult();
              }
              var r2 = typeof o2 !== b && o2.navigator ? o2.navigator : a;
              var n2 = i3 || (r2 && r2.userAgent ? r2.userAgent : t);
              var v2 = r2 && r2.userAgentData ? r2.userAgentData : a;
              var x2 = e3 ? extend(K, e3) : K;
              var _2 = r2 && r2.userAgent == n2;
              this.getBrowser = function() {
                var i4 = {};
                i4[u] = a;
                i4[f] = a;
                rgxMapper.call(i4, n2, x2.browser);
                i4[d] = majorize(i4[f]);
                if (_2 && r2 && r2.brave && typeof r2.brave.isBrave == s) {
                  i4[u] = "Brave";
                }
                return i4;
              };
              this.getCPU = function() {
                var i4 = {};
                i4[h] = a;
                rgxMapper.call(i4, n2, x2.cpu);
                return i4;
              };
              this.getDevice = function() {
                var i4 = {};
                i4[m] = a;
                i4[c] = a;
                i4[p] = a;
                rgxMapper.call(i4, n2, x2.device);
                if (_2 && !i4[p] && v2 && v2.mobile) {
                  i4[p] = g;
                }
                if (_2 && i4[c] == "Macintosh" && r2 && typeof r2.standalone !== b && r2.maxTouchPoints && r2.maxTouchPoints > 2) {
                  i4[c] = "iPad";
                  i4[p] = k;
                }
                return i4;
              };
              this.getEngine = function() {
                var i4 = {};
                i4[u] = a;
                i4[f] = a;
                rgxMapper.call(i4, n2, x2.engine);
                return i4;
              };
              this.getOS = function() {
                var i4 = {};
                i4[u] = a;
                i4[f] = a;
                rgxMapper.call(i4, n2, x2.os);
                if (_2 && !i4[u] && v2 && v2.platform != "Unknown") {
                  i4[u] = v2.platform.replace(/chrome os/i, L).replace(/macos/i, Z);
                }
                return i4;
              };
              this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              };
              this.getUA = function() {
                return n2;
              };
              this.setUA = function(i4) {
                n2 = typeof i4 === l && i4.length > q ? trim(i4, q) : i4;
                return this;
              };
              this.setUA(n2);
              return this;
            };
            UAParser.VERSION = r;
            UAParser.BROWSER = enumerize([u, f, d]);
            UAParser.CPU = enumerize([h]);
            UAParser.DEVICE = enumerize([c, m, p, v, g, x, k, _, y]);
            UAParser.ENGINE = UAParser.OS = enumerize([u, f]);
            if (typeof e2 !== b) {
              if ("object" !== b && i2.exports) {
                e2 = i2.exports = UAParser;
              }
              e2.UAParser = UAParser;
            } else {
              if (typeof define === s && define.amd) {
                define(function() {
                  return UAParser;
                });
              } else if (typeof o2 !== b) {
                o2.UAParser = UAParser;
              }
            }
            var Q = typeof o2 !== b && (o2.jQuery || o2.Zepto);
            if (Q && !Q.ua) {
              var Y = new UAParser();
              Q.ua = Y.getResult();
              Q.ua.get = function() {
                return Y.getUA();
              };
              Q.ua.set = function(i3) {
                Y.setUA(i3);
                var e3 = Y.getResult();
                for (var o3 in e3) {
                  Q.ua[o3] = e3[o3];
                }
              };
            }
          })(typeof window === "object" ? window : this);
        } };
        var e = {};
        function __nccwpck_require__(o2) {
          var a = e[o2];
          if (a !== void 0) {
            return a.exports;
          }
          var r = e[o2] = { exports: {} };
          var t = true;
          try {
            i[o2].call(r.exports, r, r.exports, __nccwpck_require__);
            t = false;
          } finally {
            if (t)
              delete e[o2];
          }
          return r.exports;
        }
        if (typeof __nccwpck_require__ !== "undefined")
          __nccwpck_require__.ab = __dirname + "/";
        var o = __nccwpck_require__(226);
        module.exports = o;
      })();
    }
  });

  // node_modules/next/dist/server/web/spec-extension/user-agent.js
  var require_user_agent = __commonJS({
    "node_modules/next/dist/server/web/spec-extension/user-agent.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        isBot: function() {
          return isBot;
        },
        userAgent: function() {
          return userAgent;
        },
        userAgentFromString: function() {
          return userAgentFromString;
        }
      });
      var _uaparserjs = /* @__PURE__ */ _interop_require_default(require_ua_parser());
      function _interop_require_default(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      function isBot(input) {
        return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Google-InspectionTool|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(input);
      }
      function userAgentFromString(input) {
        return {
          ...(0, _uaparserjs.default)(input),
          isBot: input === void 0 ? false : isBot(input)
        };
      }
      function userAgent({ headers }) {
        return userAgentFromString(headers.get("user-agent") || void 0);
      }
    }
  });

  // node_modules/next/dist/server/web/spec-extension/url-pattern.js
  var require_url_pattern = __commonJS({
    "node_modules/next/dist/server/web/spec-extension/url-pattern.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "URLPattern", {
        enumerable: true,
        get: function() {
          return GlobalURLPattern;
        }
      });
      var GlobalURLPattern = (
        // @ts-expect-error: URLPattern is not available in Node.js
        typeof URLPattern === "undefined" ? void 0 : URLPattern
      );
    }
  });

  // node_modules/next/dist/server/app-render/async-local-storage.js
  var require_async_local_storage = __commonJS({
    "node_modules/next/dist/server/app-render/async-local-storage.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        bindSnapshot: function() {
          return bindSnapshot;
        },
        createAsyncLocalStorage: function() {
          return createAsyncLocalStorage;
        },
        createSnapshot: function() {
          return createSnapshot;
        }
      });
      var sharedAsyncLocalStorageNotAvailableError = Object.defineProperty(new Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", {
        value: "E504",
        enumerable: false,
        configurable: true
      });
      var FakeAsyncLocalStorage = class {
        disable() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        getStore() {
          return void 0;
        }
        run() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        exit() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        enterWith() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        static bind(fn) {
          return fn;
        }
      };
      var maybeGlobalAsyncLocalStorage = typeof globalThis !== "undefined" && globalThis.AsyncLocalStorage;
      function createAsyncLocalStorage() {
        if (maybeGlobalAsyncLocalStorage) {
          return new maybeGlobalAsyncLocalStorage();
        }
        return new FakeAsyncLocalStorage();
      }
      function bindSnapshot(fn) {
        if (maybeGlobalAsyncLocalStorage) {
          return maybeGlobalAsyncLocalStorage.bind(fn);
        }
        return FakeAsyncLocalStorage.bind(fn);
      }
      function createSnapshot() {
        if (maybeGlobalAsyncLocalStorage) {
          return maybeGlobalAsyncLocalStorage.snapshot();
        }
        return function(fn, ...args) {
          return fn(...args);
        };
      }
    }
  });

  // node_modules/next/dist/server/app-render/work-async-storage-instance.js
  var require_work_async_storage_instance = __commonJS({
    "node_modules/next/dist/server/app-render/work-async-storage-instance.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "workAsyncStorageInstance", {
        enumerable: true,
        get: function() {
          return workAsyncStorageInstance;
        }
      });
      var _asynclocalstorage = require_async_local_storage();
      var workAsyncStorageInstance = (0, _asynclocalstorage.createAsyncLocalStorage)();
    }
  });

  // node_modules/next/dist/server/app-render/work-async-storage.external.js
  var require_work_async_storage_external = __commonJS({
    "node_modules/next/dist/server/app-render/work-async-storage.external.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "workAsyncStorage", {
        enumerable: true,
        get: function() {
          return _workasyncstorageinstance.workAsyncStorageInstance;
        }
      });
      var _workasyncstorageinstance = require_work_async_storage_instance();
    }
  });

  // node_modules/next/dist/server/after/after.js
  var require_after = __commonJS({
    "node_modules/next/dist/server/after/after.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "after", {
        enumerable: true,
        get: function() {
          return after;
        }
      });
      var _workasyncstorageexternal = require_work_async_storage_external();
      function after(task) {
        const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
        if (!workStore) {
          throw Object.defineProperty(new Error("`after` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context"), "__NEXT_ERROR_CODE", {
            value: "E468",
            enumerable: false,
            configurable: true
          });
        }
        const { afterContext } = workStore;
        return afterContext.after(task);
      }
    }
  });

  // node_modules/next/dist/server/after/index.js
  var require_after2 = __commonJS({
    "node_modules/next/dist/server/after/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      _export_star(require_after(), exports);
      function _export_star(from, to) {
        Object.keys(from).forEach(function(k) {
          if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
              enumerable: true,
              get: function() {
                return from[k];
              }
            });
          }
        });
        return from;
      }
    }
  });

  // node_modules/next/dist/server/app-render/work-unit-async-storage-instance.js
  var require_work_unit_async_storage_instance = __commonJS({
    "node_modules/next/dist/server/app-render/work-unit-async-storage-instance.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "workUnitAsyncStorageInstance", {
        enumerable: true,
        get: function() {
          return workUnitAsyncStorageInstance;
        }
      });
      var _asynclocalstorage = require_async_local_storage();
      var workUnitAsyncStorageInstance = (0, _asynclocalstorage.createAsyncLocalStorage)();
    }
  });

  // node_modules/next/dist/client/components/app-router-headers.js
  var require_app_router_headers = __commonJS({
    "node_modules/next/dist/client/components/app-router-headers.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        ACTION_HEADER: function() {
          return ACTION_HEADER;
        },
        FLIGHT_HEADERS: function() {
          return FLIGHT_HEADERS;
        },
        NEXT_ACTION_NOT_FOUND_HEADER: function() {
          return NEXT_ACTION_NOT_FOUND_HEADER;
        },
        NEXT_DID_POSTPONE_HEADER: function() {
          return NEXT_DID_POSTPONE_HEADER;
        },
        NEXT_HMR_REFRESH_HASH_COOKIE: function() {
          return NEXT_HMR_REFRESH_HASH_COOKIE;
        },
        NEXT_HMR_REFRESH_HEADER: function() {
          return NEXT_HMR_REFRESH_HEADER;
        },
        NEXT_IS_PRERENDER_HEADER: function() {
          return NEXT_IS_PRERENDER_HEADER;
        },
        NEXT_REWRITTEN_PATH_HEADER: function() {
          return NEXT_REWRITTEN_PATH_HEADER;
        },
        NEXT_REWRITTEN_QUERY_HEADER: function() {
          return NEXT_REWRITTEN_QUERY_HEADER;
        },
        NEXT_ROUTER_PREFETCH_HEADER: function() {
          return NEXT_ROUTER_PREFETCH_HEADER;
        },
        NEXT_ROUTER_SEGMENT_PREFETCH_HEADER: function() {
          return NEXT_ROUTER_SEGMENT_PREFETCH_HEADER;
        },
        NEXT_ROUTER_STALE_TIME_HEADER: function() {
          return NEXT_ROUTER_STALE_TIME_HEADER;
        },
        NEXT_ROUTER_STATE_TREE_HEADER: function() {
          return NEXT_ROUTER_STATE_TREE_HEADER;
        },
        NEXT_RSC_UNION_QUERY: function() {
          return NEXT_RSC_UNION_QUERY;
        },
        NEXT_URL: function() {
          return NEXT_URL;
        },
        RSC_CONTENT_TYPE_HEADER: function() {
          return RSC_CONTENT_TYPE_HEADER;
        },
        RSC_HEADER: function() {
          return RSC_HEADER;
        }
      });
      var RSC_HEADER = "RSC";
      var ACTION_HEADER = "Next-Action";
      var NEXT_ROUTER_STATE_TREE_HEADER = "Next-Router-State-Tree";
      var NEXT_ROUTER_PREFETCH_HEADER = "Next-Router-Prefetch";
      var NEXT_ROUTER_SEGMENT_PREFETCH_HEADER = "Next-Router-Segment-Prefetch";
      var NEXT_HMR_REFRESH_HEADER = "Next-HMR-Refresh";
      var NEXT_HMR_REFRESH_HASH_COOKIE = "__next_hmr_refresh_hash__";
      var NEXT_URL = "Next-Url";
      var RSC_CONTENT_TYPE_HEADER = "text/x-component";
      var FLIGHT_HEADERS = [
        RSC_HEADER,
        NEXT_ROUTER_STATE_TREE_HEADER,
        NEXT_ROUTER_PREFETCH_HEADER,
        NEXT_HMR_REFRESH_HEADER,
        NEXT_ROUTER_SEGMENT_PREFETCH_HEADER
      ];
      var NEXT_RSC_UNION_QUERY = "_rsc";
      var NEXT_ROUTER_STALE_TIME_HEADER = "x-nextjs-stale-time";
      var NEXT_DID_POSTPONE_HEADER = "x-nextjs-postponed";
      var NEXT_REWRITTEN_PATH_HEADER = "x-nextjs-rewritten-path";
      var NEXT_REWRITTEN_QUERY_HEADER = "x-nextjs-rewritten-query";
      var NEXT_IS_PRERENDER_HEADER = "x-nextjs-prerender";
      var NEXT_ACTION_NOT_FOUND_HEADER = "x-nextjs-action-not-found";
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/server/app-render/work-unit-async-storage.external.js
  var require_work_unit_async_storage_external = __commonJS({
    "node_modules/next/dist/server/app-render/work-unit-async-storage.external.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        getDraftModeProviderForCacheScope: function() {
          return getDraftModeProviderForCacheScope;
        },
        getExpectedRequestStore: function() {
          return getExpectedRequestStore;
        },
        getHmrRefreshHash: function() {
          return getHmrRefreshHash;
        },
        getPrerenderResumeDataCache: function() {
          return getPrerenderResumeDataCache;
        },
        getRenderResumeDataCache: function() {
          return getRenderResumeDataCache;
        },
        throwForMissingRequestStore: function() {
          return throwForMissingRequestStore;
        },
        workUnitAsyncStorage: function() {
          return _workunitasyncstorageinstance.workUnitAsyncStorageInstance;
        }
      });
      var _workunitasyncstorageinstance = require_work_unit_async_storage_instance();
      var _approuterheaders = require_app_router_headers();
      function getExpectedRequestStore(callingExpression) {
        const workUnitStore = _workunitasyncstorageinstance.workUnitAsyncStorageInstance.getStore();
        if (!workUnitStore) {
          throwForMissingRequestStore(callingExpression);
        }
        switch (workUnitStore.type) {
          case "request":
            return workUnitStore;
          case "prerender":
          case "prerender-client":
          case "prerender-ppr":
          case "prerender-legacy":
            throw Object.defineProperty(new Error(`\`${callingExpression}\` cannot be called inside a prerender. This is a bug in Next.js.`), "__NEXT_ERROR_CODE", {
              value: "E401",
              enumerable: false,
              configurable: true
            });
          case "cache":
            throw Object.defineProperty(new Error(`\`${callingExpression}\` cannot be called inside "use cache". Call it outside and pass an argument instead. Read more: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
              value: "E37",
              enumerable: false,
              configurable: true
            });
          case "unstable-cache":
            throw Object.defineProperty(new Error(`\`${callingExpression}\` cannot be called inside unstable_cache. Call it outside and pass an argument instead. Read more: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", {
              value: "E69",
              enumerable: false,
              configurable: true
            });
          default:
            const _exhaustiveCheck = workUnitStore;
            return _exhaustiveCheck;
        }
      }
      function throwForMissingRequestStore(callingExpression) {
        throw Object.defineProperty(new Error(`\`${callingExpression}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", {
          value: "E251",
          enumerable: false,
          configurable: true
        });
      }
      function getPrerenderResumeDataCache(workUnitStore) {
        if (workUnitStore.type === "prerender" || // TODO eliminate fetch caching in client scope and stop exposing this data cache during SSR
        workUnitStore.type === "prerender-client" || workUnitStore.type === "prerender-ppr") {
          return workUnitStore.prerenderResumeDataCache;
        }
        return null;
      }
      function getRenderResumeDataCache(workUnitStore) {
        switch (workUnitStore.type) {
          case "request":
            return workUnitStore.renderResumeDataCache;
          case "prerender":
          case "prerender-client":
            if (workUnitStore.renderResumeDataCache) {
              return workUnitStore.renderResumeDataCache;
            }
          case "prerender-ppr":
            return workUnitStore.prerenderResumeDataCache;
          default:
            return null;
        }
      }
      function getHmrRefreshHash(workStore, workUnitStore) {
        var _workUnitStore_cookies_get;
        if (!workStore.dev) {
          return void 0;
        }
        return workUnitStore.type === "cache" || workUnitStore.type === "prerender" ? workUnitStore.hmrRefreshHash : workUnitStore.type === "request" ? (_workUnitStore_cookies_get = workUnitStore.cookies.get(_approuterheaders.NEXT_HMR_REFRESH_HASH_COOKIE)) == null ? void 0 : _workUnitStore_cookies_get.value : void 0;
      }
      function getDraftModeProviderForCacheScope(workStore, workUnitStore) {
        if (workStore.isDraftMode) {
          switch (workUnitStore.type) {
            case "cache":
            case "unstable-cache":
            case "request":
              return workUnitStore.draftMode;
            default:
              return void 0;
          }
        }
        return void 0;
      }
    }
  });

  // node_modules/react/cjs/react.development.js
  var require_react_development = __commonJS({
    "node_modules/react/cjs/react.development.js"(exports, module) {
      "use strict";
      (function() {
        function defineDeprecationWarning(methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function() {
              console.warn(
                "%s(...) is deprecated in plain JavaScript React classes. %s",
                info[0],
                info[1]
              );
            }
          });
        }
        function getIteratorFn(maybeIterable) {
          if (null === maybeIterable || "object" !== typeof maybeIterable)
            return null;
          maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
          return "function" === typeof maybeIterable ? maybeIterable : null;
        }
        function warnNoop(publicInstance, callerName) {
          publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
          var warningKey = publicInstance + "." + callerName;
          didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
            "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
            callerName,
            publicInstance
          ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function ComponentDummy() {
        }
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          try {
            testStringCoercion(value);
            var JSCompiler_inline_result = false;
          } catch (e) {
            JSCompiler_inline_result = true;
          }
          if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(
              JSCompiler_inline_result,
              "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
              JSCompiler_inline_result$jscomp$0
            );
            return testStringCoercion(value);
          }
        }
        function getComponentNameFromType(type) {
          if (null == type)
            return null;
          if ("function" === typeof type)
            return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
          if ("string" === typeof type)
            return type;
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
              return "Activity";
          }
          if ("object" === typeof type)
            switch ("number" === typeof type.tag && console.error(
              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
            ), type.$$typeof) {
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_CONTEXT_TYPE:
                return (type.displayName || "Context") + ".Provider";
              case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
              case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
              case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                  return getComponentNameFromType(type(innerType));
                } catch (x) {
                }
            }
          return null;
        }
        function getTaskName(type) {
          if (type === REACT_FRAGMENT_TYPE)
            return "<>";
          if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
            return "<...>";
          try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
          } catch (x) {
            return "<...>";
          }
        }
        function getOwner() {
          var dispatcher = ReactSharedInternals.A;
          return null === dispatcher ? null : dispatcher.getOwner();
        }
        function UnknownOwner() {
          return Error("react-stack-top-frame");
        }
        function hasValidKey(config2) {
          if (hasOwnProperty.call(config2, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config2, "key").get;
            if (getter && getter.isReactWarning)
              return false;
          }
          return void 0 !== config2.key;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
              "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
              displayName
            ));
          }
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function elementRefGetterWithDeprecationWarning() {
          var componentName = getComponentNameFromType(this.type);
          didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
            "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
          ));
          componentName = this.props.ref;
          return void 0 !== componentName ? componentName : null;
        }
        function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
          self = props.ref;
          type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            props,
            _owner: owner
          };
          null !== (void 0 !== self ? self : null) ? Object.defineProperty(type, "ref", {
            enumerable: false,
            get: elementRefGetterWithDeprecationWarning
          }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
          type._store = {};
          Object.defineProperty(type._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: 0
          });
          Object.defineProperty(type, "_debugInfo", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: null
          });
          Object.defineProperty(type, "_debugStack", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugStack
          });
          Object.defineProperty(type, "_debugTask", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugTask
          });
          Object.freeze && (Object.freeze(type.props), Object.freeze(type));
          return type;
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          newKey = ReactElement(
            oldElement.type,
            newKey,
            void 0,
            void 0,
            oldElement._owner,
            oldElement.props,
            oldElement._debugStack,
            oldElement._debugTask
          );
          oldElement._store && (newKey._store.validated = oldElement._store.validated);
          return newKey;
        }
        function isValidElement(object) {
          return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function escape(key) {
          var escaperLookup = { "=": "=0", ":": "=2" };
          return "$" + key.replace(/[=:]/g, function(match) {
            return escaperLookup[match];
          });
        }
        function getElementKey(element, index) {
          return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
        }
        function noop$1() {
        }
        function resolveThenable(thenable) {
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
            default:
              switch ("string" === typeof thenable.status ? thenable.then(noop$1, noop$1) : (thenable.status = "pending", thenable.then(
                function(fulfilledValue) {
                  "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
                },
                function(error) {
                  "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              )), thenable.status) {
                case "fulfilled":
                  return thenable.value;
                case "rejected":
                  throw thenable.reason;
              }
          }
          throw thenable;
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if ("undefined" === type || "boolean" === type)
            children = null;
          var invokeCallback = false;
          if (null === children)
            invokeCallback = true;
          else
            switch (type) {
              case "bigint":
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                    break;
                  case REACT_LAZY_TYPE:
                    return invokeCallback = children._init, mapIntoArray(
                      invokeCallback(children._payload),
                      array,
                      escapedPrefix,
                      nameSoFar,
                      callback
                    );
                }
            }
          if (invokeCallback) {
            invokeCallback = children;
            callback = callback(invokeCallback);
            var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
            isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
              return c;
            })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
              callback,
              escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
                userProvidedKeyEscapeRegex,
                "$&/"
              ) + "/") + childKey
            ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
            return 1;
          }
          invokeCallback = 0;
          childKey = "" === nameSoFar ? "." : nameSoFar + ":";
          if (isArrayImpl(children))
            for (var i = 0; i < children.length; i++)
              nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if (i = getIteratorFn(children), "function" === typeof i)
            for (i === children.entries && (didWarnAboutMaps || console.warn(
              "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
            ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
              nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if ("object" === type) {
            if ("function" === typeof children.then)
              return mapIntoArray(
                resolveThenable(children),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
            array = String(children);
            throw Error(
              "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
            );
          }
          return invokeCallback;
        }
        function mapChildren(children, func, context) {
          if (null == children)
            return children;
          var result = [], count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function lazyInitializer(payload) {
          if (-1 === payload._status) {
            var ctor = payload._result;
            ctor = ctor();
            ctor.then(
              function(moduleObject) {
                if (0 === payload._status || -1 === payload._status)
                  payload._status = 1, payload._result = moduleObject;
              },
              function(error) {
                if (0 === payload._status || -1 === payload._status)
                  payload._status = 2, payload._result = error;
              }
            );
            -1 === payload._status && (payload._status = 0, payload._result = ctor);
          }
          if (1 === payload._status)
            return ctor = payload._result, void 0 === ctor && console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
              ctor
            ), "default" in ctor || console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
              ctor
            ), ctor.default;
          throw payload._result;
        }
        function resolveDispatcher() {
          var dispatcher = ReactSharedInternals.H;
          null === dispatcher && console.error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
          );
          return dispatcher;
        }
        function noop() {
        }
        function enqueueTask(task) {
          if (null === enqueueTaskImpl)
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              enqueueTaskImpl = (module && module[requireString]).call(
                module,
                "timers"
              ).setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                  "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
                ));
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          return enqueueTaskImpl(task);
        }
        function aggregateErrors(errors) {
          return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
        }
        function popActScope(prevActQueue, prevActScopeDepth) {
          prevActScopeDepth !== actScopeDepth - 1 && console.error(
            "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
          );
          actScopeDepth = prevActScopeDepth;
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          var queue = ReactSharedInternals.actQueue;
          if (null !== queue)
            if (0 !== queue.length)
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                });
                return;
              } catch (error) {
                ReactSharedInternals.thrownErrors.push(error);
              }
            else
              ReactSharedInternals.actQueue = null;
          0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
        }
        function flushActQueue(queue) {
          if (!isFlushing) {
            isFlushing = true;
            var i = 0;
            try {
              for (; i < queue.length; i++) {
                var callback = queue[i];
                do {
                  ReactSharedInternals.didUsePromise = false;
                  var continuation = callback(false);
                  if (null !== continuation) {
                    if (ReactSharedInternals.didUsePromise) {
                      queue[i] = callback;
                      queue.splice(0, i);
                      return;
                    }
                    callback = continuation;
                  } else
                    break;
                } while (1);
              }
              queue.length = 0;
            } catch (error) {
              queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
            } finally {
              isFlushing = false;
            }
          }
        }
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
        var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        Symbol.for("react.provider");
        var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
          isMounted: function() {
            return false;
          },
          enqueueForceUpdate: function(publicInstance) {
            warnNoop(publicInstance, "forceUpdate");
          },
          enqueueReplaceState: function(publicInstance) {
            warnNoop(publicInstance, "replaceState");
          },
          enqueueSetState: function(publicInstance) {
            warnNoop(publicInstance, "setState");
          }
        }, assign = Object.assign, emptyObject = {};
        Object.freeze(emptyObject);
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
            throw Error(
              "takes an object of state variables to update or a function which returns an object of state variables."
            );
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        var deprecatedAPIs = {
          isMounted: [
            "isMounted",
            "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
          ],
          replaceState: [
            "replaceState",
            "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
          ]
        }, fnName;
        for (fnName in deprecatedAPIs)
          deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        ComponentDummy.prototype = Component.prototype;
        deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
        deprecatedAPIs.constructor = PureComponent;
        assign(deprecatedAPIs, Component.prototype);
        deprecatedAPIs.isPureReactComponent = true;
        var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = {
          H: null,
          A: null,
          T: null,
          S: null,
          V: null,
          actQueue: null,
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false,
          didUsePromise: false,
          thrownErrors: [],
          getCurrentStack: null,
          recentlyCreatedOwnerStacks: 0
        }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
          return null;
        };
        deprecatedAPIs = {
          "react-stack-bottom-frame": function(callStackForError) {
            return callStackForError();
          }
        };
        var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
        var didWarnAboutElementRef = {};
        var unknownOwnerDebugStack = deprecatedAPIs["react-stack-bottom-frame"].bind(deprecatedAPIs, UnknownOwner)();
        var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
        var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
          if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
            var event = new window.ErrorEvent("error", {
              bubbles: true,
              cancelable: true,
              message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
              error
            });
            if (!window.dispatchEvent(event))
              return;
          } else if ("object" === typeof process && "function" === typeof process.emit) {
            process.emit("uncaughtException", error);
            return;
          }
          console.error(error);
        }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
          queueMicrotask(function() {
            return queueMicrotask(callback);
          });
        } : enqueueTask;
        deprecatedAPIs = Object.freeze({
          __proto__: null,
          c: function(size) {
            return resolveDispatcher().useMemoCache(size);
          }
        });
        exports.Children = {
          map: mapChildren,
          forEach: function(children, forEachFunc, forEachContext) {
            mapChildren(
              children,
              function() {
                forEachFunc.apply(this, arguments);
              },
              forEachContext
            );
          },
          count: function(children) {
            var n = 0;
            mapChildren(children, function() {
              n++;
            });
            return n;
          },
          toArray: function(children) {
            return mapChildren(children, function(child) {
              return child;
            }) || [];
          },
          only: function(children) {
            if (!isValidElement(children))
              throw Error(
                "React.Children.only expected to receive a single React element child."
              );
            return children;
          }
        };
        exports.Component = Component;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.Profiler = REACT_PROFILER_TYPE;
        exports.PureComponent = PureComponent;
        exports.StrictMode = REACT_STRICT_MODE_TYPE;
        exports.Suspense = REACT_SUSPENSE_TYPE;
        exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
        exports.__COMPILER_RUNTIME = deprecatedAPIs;
        exports.act = function(callback) {
          var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
          actScopeDepth++;
          var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
          try {
            var result = callback();
          } catch (error) {
            ReactSharedInternals.thrownErrors.push(error);
          }
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          if (null !== result && "object" === typeof result && "function" === typeof result.then) {
            var thenable = result;
            queueSeveralMicrotasks(function() {
              didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
                "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
              ));
            });
            return {
              then: function(resolve, reject) {
                didAwaitActCall = true;
                thenable.then(
                  function(returnValue) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    if (0 === prevActScopeDepth) {
                      try {
                        flushActQueue(queue), enqueueTask(function() {
                          return recursivelyFlushAsyncActWork(
                            returnValue,
                            resolve,
                            reject
                          );
                        });
                      } catch (error$0) {
                        ReactSharedInternals.thrownErrors.push(error$0);
                      }
                      if (0 < ReactSharedInternals.thrownErrors.length) {
                        var _thrownError = aggregateErrors(
                          ReactSharedInternals.thrownErrors
                        );
                        ReactSharedInternals.thrownErrors.length = 0;
                        reject(_thrownError);
                      }
                    } else
                      resolve(returnValue);
                  },
                  function(error) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                      ReactSharedInternals.thrownErrors
                    ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                  }
                );
              }
            };
          }
          var returnValue$jscomp$0 = result;
          popActScope(prevActQueue, prevActScopeDepth);
          0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
            ));
          }), ReactSharedInternals.actQueue = null);
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
                return recursivelyFlushAsyncActWork(
                  returnValue$jscomp$0,
                  resolve,
                  reject
                );
              })) : resolve(returnValue$jscomp$0);
            }
          };
        };
        exports.cache = function(fn) {
          return function() {
            return fn.apply(null, arguments);
          };
        };
        exports.captureOwnerStack = function() {
          var getCurrentStack = ReactSharedInternals.getCurrentStack;
          return null === getCurrentStack ? null : getCurrentStack();
        };
        exports.cloneElement = function(element, config2, children) {
          if (null === element || void 0 === element)
            throw Error(
              "The argument must be a React element, but you passed " + element + "."
            );
          var props = assign({}, element.props), key = element.key, owner = element._owner;
          if (null != config2) {
            var JSCompiler_inline_result;
            a: {
              if (hasOwnProperty.call(config2, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
                config2,
                "ref"
              ).get) && JSCompiler_inline_result.isReactWarning) {
                JSCompiler_inline_result = false;
                break a;
              }
              JSCompiler_inline_result = void 0 !== config2.ref;
            }
            JSCompiler_inline_result && (owner = getOwner());
            hasValidKey(config2) && (checkKeyStringCoercion(config2.key), key = "" + config2.key);
            for (propName in config2)
              !hasOwnProperty.call(config2, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config2.ref || (props[propName] = config2[propName]);
          }
          var propName = arguments.length - 2;
          if (1 === propName)
            props.children = children;
          else if (1 < propName) {
            JSCompiler_inline_result = Array(propName);
            for (var i = 0; i < propName; i++)
              JSCompiler_inline_result[i] = arguments[i + 2];
            props.children = JSCompiler_inline_result;
          }
          props = ReactElement(
            element.type,
            key,
            void 0,
            void 0,
            owner,
            props,
            element._debugStack,
            element._debugTask
          );
          for (key = 2; key < arguments.length; key++)
            owner = arguments[key], isValidElement(owner) && owner._store && (owner._store.validated = 1);
          return props;
        };
        exports.createContext = function(defaultValue) {
          defaultValue = {
            $$typeof: REACT_CONTEXT_TYPE,
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            _threadCount: 0,
            Provider: null,
            Consumer: null
          };
          defaultValue.Provider = defaultValue;
          defaultValue.Consumer = {
            $$typeof: REACT_CONSUMER_TYPE,
            _context: defaultValue
          };
          defaultValue._currentRenderer = null;
          defaultValue._currentRenderer2 = null;
          return defaultValue;
        };
        exports.createElement = function(type, config2, children) {
          for (var i = 2; i < arguments.length; i++) {
            var node = arguments[i];
            isValidElement(node) && node._store && (node._store.validated = 1);
          }
          i = {};
          node = null;
          if (null != config2)
            for (propName in didWarnAboutOldJSXRuntime || !("__self" in config2) || "key" in config2 || (didWarnAboutOldJSXRuntime = true, console.warn(
              "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
            )), hasValidKey(config2) && (checkKeyStringCoercion(config2.key), node = "" + config2.key), config2)
              hasOwnProperty.call(config2, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config2[propName]);
          var childrenLength = arguments.length - 2;
          if (1 === childrenLength)
            i.children = children;
          else if (1 < childrenLength) {
            for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
              childArray[_i] = arguments[_i + 2];
            Object.freeze && Object.freeze(childArray);
            i.children = childArray;
          }
          if (type && type.defaultProps)
            for (propName in childrenLength = type.defaultProps, childrenLength)
              void 0 === i[propName] && (i[propName] = childrenLength[propName]);
          node && defineKeyPropWarningGetter(
            i,
            "function" === typeof type ? type.displayName || type.name || "Unknown" : type
          );
          var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return ReactElement(
            type,
            node,
            void 0,
            void 0,
            getOwner(),
            i,
            propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
        exports.createRef = function() {
          var refObject = { current: null };
          Object.seal(refObject);
          return refObject;
        };
        exports.forwardRef = function(render) {
          null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
            "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
          ) : "function" !== typeof render ? console.error(
            "forwardRef requires a render function but was given %s.",
            null === render ? "null" : typeof render
          ) : 0 !== render.length && 2 !== render.length && console.error(
            "forwardRef render functions accept exactly two parameters: props and ref. %s",
            1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
          );
          null != render && null != render.defaultProps && console.error(
            "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
          );
          var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
          Object.defineProperty(elementType, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
            }
          });
          return elementType;
        };
        exports.isValidElement = isValidElement;
        exports.lazy = function(ctor) {
          return {
            $$typeof: REACT_LAZY_TYPE,
            _payload: { _status: -1, _result: ctor },
            _init: lazyInitializer
          };
        };
        exports.memo = function(type, compare) {
          null == type && console.error(
            "memo: The first argument must be a component. Instead received: %s",
            null === type ? "null" : typeof type
          );
          compare = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: void 0 === compare ? null : compare
          };
          var ownName;
          Object.defineProperty(compare, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
            }
          });
          return compare;
        };
        exports.startTransition = function(scope) {
          var prevTransition = ReactSharedInternals.T, currentTransition = {};
          ReactSharedInternals.T = currentTransition;
          currentTransition._updatedFibers = /* @__PURE__ */ new Set();
          try {
            var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
            null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
            "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
          } catch (error) {
            reportGlobalError(error);
          } finally {
            null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
              "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
            )), ReactSharedInternals.T = prevTransition;
          }
        };
        exports.unstable_useCacheRefresh = function() {
          return resolveDispatcher().useCacheRefresh();
        };
        exports.use = function(usable) {
          return resolveDispatcher().use(usable);
        };
        exports.useActionState = function(action, initialState, permalink) {
          return resolveDispatcher().useActionState(
            action,
            initialState,
            permalink
          );
        };
        exports.useCallback = function(callback, deps) {
          return resolveDispatcher().useCallback(callback, deps);
        };
        exports.useContext = function(Context) {
          var dispatcher = resolveDispatcher();
          Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
            "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
          );
          return dispatcher.useContext(Context);
        };
        exports.useDebugValue = function(value, formatterFn) {
          return resolveDispatcher().useDebugValue(value, formatterFn);
        };
        exports.useDeferredValue = function(value, initialValue) {
          return resolveDispatcher().useDeferredValue(value, initialValue);
        };
        exports.useEffect = function(create, createDeps, update) {
          null == create && console.warn(
            "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          var dispatcher = resolveDispatcher();
          if ("function" === typeof update)
            throw Error(
              "useEffect CRUD overload is not enabled in this build of React."
            );
          return dispatcher.useEffect(create, createDeps);
        };
        exports.useId = function() {
          return resolveDispatcher().useId();
        };
        exports.useImperativeHandle = function(ref, create, deps) {
          return resolveDispatcher().useImperativeHandle(ref, create, deps);
        };
        exports.useInsertionEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useInsertionEffect(create, deps);
        };
        exports.useLayoutEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useLayoutEffect(create, deps);
        };
        exports.useMemo = function(create, deps) {
          return resolveDispatcher().useMemo(create, deps);
        };
        exports.useOptimistic = function(passthrough, reducer) {
          return resolveDispatcher().useOptimistic(passthrough, reducer);
        };
        exports.useReducer = function(reducer, initialArg, init) {
          return resolveDispatcher().useReducer(reducer, initialArg, init);
        };
        exports.useRef = function(initialValue) {
          return resolveDispatcher().useRef(initialValue);
        };
        exports.useState = function(initialState) {
          return resolveDispatcher().useState(initialState);
        };
        exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
          return resolveDispatcher().useSyncExternalStore(
            subscribe,
            getSnapshot,
            getServerSnapshot
          );
        };
        exports.useTransition = function() {
          return resolveDispatcher().useTransition();
        };
        exports.version = "19.1.0";
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
      })();
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_development();
      }
    }
  });

  // node_modules/next/dist/client/components/hooks-server-context.js
  var require_hooks_server_context = __commonJS({
    "node_modules/next/dist/client/components/hooks-server-context.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        DynamicServerError: function() {
          return DynamicServerError;
        },
        isDynamicServerError: function() {
          return isDynamicServerError;
        }
      });
      var DYNAMIC_ERROR_CODE = "DYNAMIC_SERVER_USAGE";
      var DynamicServerError = class extends Error {
        constructor(description) {
          super("Dynamic server usage: " + description), this.description = description, this.digest = DYNAMIC_ERROR_CODE;
        }
      };
      function isDynamicServerError(err) {
        if (typeof err !== "object" || err === null || !("digest" in err) || typeof err.digest !== "string") {
          return false;
        }
        return err.digest === DYNAMIC_ERROR_CODE;
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/client/components/static-generation-bailout.js
  var require_static_generation_bailout = __commonJS({
    "node_modules/next/dist/client/components/static-generation-bailout.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        StaticGenBailoutError: function() {
          return StaticGenBailoutError;
        },
        isStaticGenBailoutError: function() {
          return isStaticGenBailoutError;
        }
      });
      var NEXT_STATIC_GEN_BAILOUT = "NEXT_STATIC_GEN_BAILOUT";
      var StaticGenBailoutError = class extends Error {
        constructor(...args) {
          super(...args), this.code = NEXT_STATIC_GEN_BAILOUT;
        }
      };
      function isStaticGenBailoutError(error) {
        if (typeof error !== "object" || error === null || !("code" in error)) {
          return false;
        }
        return error.code === NEXT_STATIC_GEN_BAILOUT;
      }
      if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
        Object.defineProperty(exports.default, "__esModule", { value: true });
        Object.assign(exports.default, exports);
        module.exports = exports.default;
      }
    }
  });

  // node_modules/next/dist/server/dynamic-rendering-utils.js
  var require_dynamic_rendering_utils = __commonJS({
    "node_modules/next/dist/server/dynamic-rendering-utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        isHangingPromiseRejectionError: function() {
          return isHangingPromiseRejectionError;
        },
        makeHangingPromise: function() {
          return makeHangingPromise;
        }
      });
      function isHangingPromiseRejectionError(err) {
        if (typeof err !== "object" || err === null || !("digest" in err)) {
          return false;
        }
        return err.digest === HANGING_PROMISE_REJECTION;
      }
      var HANGING_PROMISE_REJECTION = "HANGING_PROMISE_REJECTION";
      var HangingPromiseRejectionError = class extends Error {
        constructor(expression) {
          super(`During prerendering, ${expression} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${expression} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context.`), this.expression = expression, this.digest = HANGING_PROMISE_REJECTION;
        }
      };
      var abortListenersBySignal = /* @__PURE__ */ new WeakMap();
      function makeHangingPromise(signal, expression) {
        if (signal.aborted) {
          return Promise.reject(new HangingPromiseRejectionError(expression));
        } else {
          const hangingPromise = new Promise((_, reject) => {
            const boundRejection = reject.bind(null, new HangingPromiseRejectionError(expression));
            let currentListeners = abortListenersBySignal.get(signal);
            if (currentListeners) {
              currentListeners.push(boundRejection);
            } else {
              const listeners = [
                boundRejection
              ];
              abortListenersBySignal.set(signal, listeners);
              signal.addEventListener("abort", () => {
                for (let i = 0; i < listeners.length; i++) {
                  listeners[i]();
                }
              }, {
                once: true
              });
            }
          });
          hangingPromise.catch(ignoreReject);
          return hangingPromise;
        }
      }
      function ignoreReject() {
      }
    }
  });

  // node_modules/next/dist/lib/metadata/metadata-constants.js
  var require_metadata_constants = __commonJS({
    "node_modules/next/dist/lib/metadata/metadata-constants.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        METADATA_BOUNDARY_NAME: function() {
          return METADATA_BOUNDARY_NAME;
        },
        OUTLET_BOUNDARY_NAME: function() {
          return OUTLET_BOUNDARY_NAME;
        },
        VIEWPORT_BOUNDARY_NAME: function() {
          return VIEWPORT_BOUNDARY_NAME;
        }
      });
      var METADATA_BOUNDARY_NAME = "__next_metadata_boundary__";
      var VIEWPORT_BOUNDARY_NAME = "__next_viewport_boundary__";
      var OUTLET_BOUNDARY_NAME = "__next_outlet_boundary__";
    }
  });

  // node_modules/next/dist/lib/scheduler.js
  var require_scheduler = __commonJS({
    "node_modules/next/dist/lib/scheduler.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        atLeastOneTask: function() {
          return atLeastOneTask;
        },
        scheduleImmediate: function() {
          return scheduleImmediate;
        },
        scheduleOnNextTick: function() {
          return scheduleOnNextTick;
        },
        waitAtLeastOneReactRenderTask: function() {
          return waitAtLeastOneReactRenderTask;
        }
      });
      var scheduleOnNextTick = (cb) => {
        Promise.resolve().then(() => {
          if (process.env.NEXT_RUNTIME === "edge") {
            setTimeout(cb, 0);
          } else {
            process.nextTick(cb);
          }
        });
      };
      var scheduleImmediate = (cb) => {
        if (process.env.NEXT_RUNTIME === "edge") {
          setTimeout(cb, 0);
        } else {
          setImmediate(cb);
        }
      };
      function atLeastOneTask() {
        return new Promise((resolve) => scheduleImmediate(resolve));
      }
      function waitAtLeastOneReactRenderTask() {
        if (process.env.NEXT_RUNTIME === "edge") {
          return new Promise((r) => setTimeout(r, 0));
        } else {
          return new Promise((r) => setImmediate(r));
        }
      }
    }
  });

  // node_modules/next/dist/server/app-render/dynamic-rendering.js
  var require_dynamic_rendering = __commonJS({
    "node_modules/next/dist/server/app-render/dynamic-rendering.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        Postpone: function() {
          return Postpone;
        },
        PreludeState: function() {
          return PreludeState;
        },
        abortAndThrowOnSynchronousRequestDataAccess: function() {
          return abortAndThrowOnSynchronousRequestDataAccess;
        },
        abortOnSynchronousPlatformIOAccess: function() {
          return abortOnSynchronousPlatformIOAccess;
        },
        accessedDynamicData: function() {
          return accessedDynamicData;
        },
        annotateDynamicAccess: function() {
          return annotateDynamicAccess;
        },
        consumeDynamicAccess: function() {
          return consumeDynamicAccess;
        },
        createDynamicTrackingState: function() {
          return createDynamicTrackingState;
        },
        createDynamicValidationState: function() {
          return createDynamicValidationState;
        },
        createHangingInputAbortSignal: function() {
          return createHangingInputAbortSignal;
        },
        createPostponedAbortSignal: function() {
          return createPostponedAbortSignal;
        },
        formatDynamicAPIAccesses: function() {
          return formatDynamicAPIAccesses;
        },
        getFirstDynamicReason: function() {
          return getFirstDynamicReason;
        },
        isDynamicPostpone: function() {
          return isDynamicPostpone;
        },
        isPrerenderInterruptedError: function() {
          return isPrerenderInterruptedError;
        },
        markCurrentScopeAsDynamic: function() {
          return markCurrentScopeAsDynamic;
        },
        postponeWithTracking: function() {
          return postponeWithTracking;
        },
        throwIfDisallowedDynamic: function() {
          return throwIfDisallowedDynamic;
        },
        throwToInterruptStaticGeneration: function() {
          return throwToInterruptStaticGeneration;
        },
        trackAllowedDynamicAccess: function() {
          return trackAllowedDynamicAccess;
        },
        trackDynamicDataInDynamicRender: function() {
          return trackDynamicDataInDynamicRender;
        },
        trackFallbackParamAccessed: function() {
          return trackFallbackParamAccessed;
        },
        trackSynchronousPlatformIOAccessInDev: function() {
          return trackSynchronousPlatformIOAccessInDev;
        },
        trackSynchronousRequestDataAccessInDev: function() {
          return trackSynchronousRequestDataAccessInDev;
        },
        useDynamicRouteParams: function() {
          return useDynamicRouteParams;
        }
      });
      var _react = /* @__PURE__ */ _interop_require_default(require_react());
      var _hooksservercontext = require_hooks_server_context();
      var _staticgenerationbailout = require_static_generation_bailout();
      var _workunitasyncstorageexternal = require_work_unit_async_storage_external();
      var _workasyncstorageexternal = require_work_async_storage_external();
      var _dynamicrenderingutils = require_dynamic_rendering_utils();
      var _metadataconstants = require_metadata_constants();
      var _scheduler = require_scheduler();
      function _interop_require_default(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      var hasPostpone = typeof _react.default.unstable_postpone === "function";
      function createDynamicTrackingState(isDebugDynamicAccesses) {
        return {
          isDebugDynamicAccesses,
          dynamicAccesses: [],
          syncDynamicErrorWithStack: null
        };
      }
      function createDynamicValidationState() {
        return {
          hasSuspenseAboveBody: false,
          hasDynamicMetadata: false,
          hasDynamicViewport: false,
          hasAllowedDynamic: false,
          dynamicErrors: []
        };
      }
      function getFirstDynamicReason(trackingState) {
        var _trackingState_dynamicAccesses_;
        return (_trackingState_dynamicAccesses_ = trackingState.dynamicAccesses[0]) == null ? void 0 : _trackingState_dynamicAccesses_.expression;
      }
      function markCurrentScopeAsDynamic(store, workUnitStore, expression) {
        if (workUnitStore) {
          if (workUnitStore.type === "cache" || workUnitStore.type === "unstable-cache") {
            return;
          }
        }
        if (store.forceDynamic || store.forceStatic)
          return;
        if (store.dynamicShouldError) {
          throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${store.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
            value: "E553",
            enumerable: false,
            configurable: true
          });
        }
        if (workUnitStore) {
          if (workUnitStore.type === "prerender-ppr") {
            postponeWithTracking(store.route, expression, workUnitStore.dynamicTracking);
          } else if (workUnitStore.type === "prerender-legacy") {
            workUnitStore.revalidate = 0;
            const err = Object.defineProperty(new _hooksservercontext.DynamicServerError(`Route ${store.route} couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
              value: "E550",
              enumerable: false,
              configurable: true
            });
            store.dynamicUsageDescription = expression;
            store.dynamicUsageStack = err.stack;
            throw err;
          } else if (workUnitStore && workUnitStore.type === "request") {
            workUnitStore.usedDynamic = true;
          }
        }
      }
      function trackFallbackParamAccessed(store, expression) {
        const prerenderStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
        if (!prerenderStore || prerenderStore.type !== "prerender-ppr")
          return;
        postponeWithTracking(store.route, expression, prerenderStore.dynamicTracking);
      }
      function throwToInterruptStaticGeneration(expression, store, prerenderStore) {
        const err = Object.defineProperty(new _hooksservercontext.DynamicServerError(`Route ${store.route} couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
          value: "E558",
          enumerable: false,
          configurable: true
        });
        prerenderStore.revalidate = 0;
        store.dynamicUsageDescription = expression;
        store.dynamicUsageStack = err.stack;
        throw err;
      }
      function trackDynamicDataInDynamicRender(_store, workUnitStore) {
        if (workUnitStore) {
          if (workUnitStore.type === "cache" || workUnitStore.type === "unstable-cache") {
            return;
          }
          if (workUnitStore.type === "prerender" || workUnitStore.type === "prerender-client" || workUnitStore.type === "prerender-legacy") {
            workUnitStore.revalidate = 0;
          }
          if (workUnitStore.type === "request") {
            workUnitStore.usedDynamic = true;
          }
        }
      }
      function abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore) {
        const reason = `Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`;
        const error = createPrerenderInterruptedError(reason);
        prerenderStore.controller.abort(error);
        const dynamicTracking = prerenderStore.dynamicTracking;
        if (dynamicTracking) {
          dynamicTracking.dynamicAccesses.push({
            // When we aren't debugging, we don't need to create another error for the
            // stack trace.
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : void 0,
            expression
          });
        }
      }
      function abortOnSynchronousPlatformIOAccess(route, expression, errorWithStack, prerenderStore) {
        const dynamicTracking = prerenderStore.dynamicTracking;
        abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
        if (dynamicTracking) {
          if (dynamicTracking.syncDynamicErrorWithStack === null) {
            dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
          }
        }
      }
      function trackSynchronousPlatformIOAccessInDev(requestStore) {
        requestStore.prerenderPhase = false;
      }
      function abortAndThrowOnSynchronousRequestDataAccess(route, expression, errorWithStack, prerenderStore) {
        const prerenderSignal = prerenderStore.controller.signal;
        if (prerenderSignal.aborted === false) {
          abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
          const dynamicTracking = prerenderStore.dynamicTracking;
          if (dynamicTracking) {
            if (dynamicTracking.syncDynamicErrorWithStack === null) {
              dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
            }
          }
        }
        throw createPrerenderInterruptedError(`Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`);
      }
      var trackSynchronousRequestDataAccessInDev = trackSynchronousPlatformIOAccessInDev;
      function Postpone({ reason, route }) {
        const prerenderStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
        const dynamicTracking = prerenderStore && prerenderStore.type === "prerender-ppr" ? prerenderStore.dynamicTracking : null;
        postponeWithTracking(route, reason, dynamicTracking);
      }
      function postponeWithTracking(route, expression, dynamicTracking) {
        assertPostpone();
        if (dynamicTracking) {
          dynamicTracking.dynamicAccesses.push({
            // When we aren't debugging, we don't need to create another error for the
            // stack trace.
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : void 0,
            expression
          });
        }
        _react.default.unstable_postpone(createPostponeReason(route, expression));
      }
      function createPostponeReason(route, expression) {
        return `Route ${route} needs to bail out of prerendering at this point because it used ${expression}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
      }
      function isDynamicPostpone(err) {
        if (typeof err === "object" && err !== null && typeof err.message === "string") {
          return isDynamicPostponeReason(err.message);
        }
        return false;
      }
      function isDynamicPostponeReason(reason) {
        return reason.includes("needs to bail out of prerendering at this point because it used") && reason.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error");
      }
      if (isDynamicPostponeReason(createPostponeReason("%%%", "^^^")) === false) {
        throw Object.defineProperty(new Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", {
          value: "E296",
          enumerable: false,
          configurable: true
        });
      }
      var NEXT_PRERENDER_INTERRUPTED = "NEXT_PRERENDER_INTERRUPTED";
      function createPrerenderInterruptedError(message) {
        const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
          value: "E394",
          enumerable: false,
          configurable: true
        });
        error.digest = NEXT_PRERENDER_INTERRUPTED;
        return error;
      }
      function isPrerenderInterruptedError(error) {
        return typeof error === "object" && error !== null && error.digest === NEXT_PRERENDER_INTERRUPTED && "name" in error && "message" in error && error instanceof Error;
      }
      function accessedDynamicData(dynamicAccesses) {
        return dynamicAccesses.length > 0;
      }
      function consumeDynamicAccess(serverDynamic, clientDynamic) {
        serverDynamic.dynamicAccesses.push(...clientDynamic.dynamicAccesses);
        return serverDynamic.dynamicAccesses;
      }
      function formatDynamicAPIAccesses(dynamicAccesses) {
        return dynamicAccesses.filter((access) => typeof access.stack === "string" && access.stack.length > 0).map(({ expression, stack }) => {
          stack = stack.split("\n").slice(4).filter((line) => {
            if (line.includes("node_modules/next/")) {
              return false;
            }
            if (line.includes(" (<anonymous>)")) {
              return false;
            }
            if (line.includes(" (node:")) {
              return false;
            }
            return true;
          }).join("\n");
          return `Dynamic API Usage Debug - ${expression}:
${stack}`;
        });
      }
      function assertPostpone() {
        if (!hasPostpone) {
          throw Object.defineProperty(new Error(`Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js`), "__NEXT_ERROR_CODE", {
            value: "E224",
            enumerable: false,
            configurable: true
          });
        }
      }
      function createPostponedAbortSignal(reason) {
        assertPostpone();
        const controller = new AbortController();
        try {
          _react.default.unstable_postpone(reason);
        } catch (x) {
          controller.abort(x);
        }
        return controller.signal;
      }
      function createHangingInputAbortSignal(workUnitStore) {
        const controller = new AbortController();
        if (workUnitStore.cacheSignal) {
          workUnitStore.cacheSignal.inputReady().then(() => {
            controller.abort();
          });
        } else {
          (0, _scheduler.scheduleOnNextTick)(() => controller.abort());
        }
        return controller.signal;
      }
      function annotateDynamicAccess(expression, prerenderStore) {
        const dynamicTracking = prerenderStore.dynamicTracking;
        if (dynamicTracking) {
          dynamicTracking.dynamicAccesses.push({
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : void 0,
            expression
          });
        }
      }
      function useDynamicRouteParams(expression) {
        const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
        if (workStore && workStore.isStaticGeneration && workStore.fallbackRouteParams && workStore.fallbackRouteParams.size > 0) {
          const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
          if (workUnitStore) {
            if (workUnitStore.type === "prerender-client") {
              _react.default.use((0, _dynamicrenderingutils.makeHangingPromise)(workUnitStore.renderSignal, expression));
            } else if (workUnitStore.type === "prerender-ppr") {
              postponeWithTracking(workStore.route, expression, workUnitStore.dynamicTracking);
            } else if (workUnitStore.type === "prerender-legacy") {
              throwToInterruptStaticGeneration(expression, workStore, workUnitStore);
            }
          }
        }
      }
      var hasSuspenseRegex = /\n\s+at Suspense \(<anonymous>\)/;
      var hasSuspenseAfterBodyOrHtmlRegex = /\n\s+at (?:body|html) \(<anonymous>\)[\s\S]*?\n\s+at Suspense \(<anonymous>\)/;
      var hasMetadataRegex = new RegExp(`\\n\\s+at ${_metadataconstants.METADATA_BOUNDARY_NAME}[\\n\\s]`);
      var hasViewportRegex = new RegExp(`\\n\\s+at ${_metadataconstants.VIEWPORT_BOUNDARY_NAME}[\\n\\s]`);
      var hasOutletRegex = new RegExp(`\\n\\s+at ${_metadataconstants.OUTLET_BOUNDARY_NAME}[\\n\\s]`);
      function trackAllowedDynamicAccess(workStore, componentStack, dynamicValidation, clientDynamic) {
        if (hasOutletRegex.test(componentStack)) {
          return;
        } else if (hasMetadataRegex.test(componentStack)) {
          dynamicValidation.hasDynamicMetadata = true;
          return;
        } else if (hasViewportRegex.test(componentStack)) {
          dynamicValidation.hasDynamicViewport = true;
          return;
        } else if (hasSuspenseAfterBodyOrHtmlRegex.test(componentStack)) {
          dynamicValidation.hasAllowedDynamic = true;
          dynamicValidation.hasSuspenseAboveBody = true;
          return;
        } else if (hasSuspenseRegex.test(componentStack)) {
          dynamicValidation.hasAllowedDynamic = true;
          return;
        } else if (clientDynamic.syncDynamicErrorWithStack) {
          dynamicValidation.dynamicErrors.push(clientDynamic.syncDynamicErrorWithStack);
          return;
        } else {
          const message = `Route "${workStore.route}": A component accessed data, headers, params, searchParams, or a short-lived cache without a Suspense boundary nor a "use cache" above it. See more info: https://nextjs.org/docs/messages/next-prerender-missing-suspense`;
          const error = createErrorWithComponentOrOwnerStack(message, componentStack);
          dynamicValidation.dynamicErrors.push(error);
          return;
        }
      }
      function createErrorWithComponentOrOwnerStack(message, componentStack) {
        const ownerStack = _react.default.captureOwnerStack ? _react.default.captureOwnerStack() : null;
        const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
          value: "E394",
          enumerable: false,
          configurable: true
        });
        error.stack = error.name + ": " + message + (ownerStack ?? componentStack);
        return error;
      }
      var PreludeState = /* @__PURE__ */ function(PreludeState2) {
        PreludeState2[PreludeState2["Full"] = 0] = "Full";
        PreludeState2[PreludeState2["Empty"] = 1] = "Empty";
        PreludeState2[PreludeState2["Errored"] = 2] = "Errored";
        return PreludeState2;
      }({});
      function logDisallowedDynamicError(workStore, error) {
        console.error(error);
        if (!workStore.dev) {
          if (workStore.hasReadableErrorStacks) {
            console.error(`To get a more detailed stack trace and pinpoint the issue, start the app in development mode by running \`next dev\`, then open "${workStore.route}" in your browser to investigate the error.`);
          } else {
            console.error(`To get a more detailed stack trace and pinpoint the issue, try one of the following:
  - Start the app in development mode by running \`next dev\`, then open "${workStore.route}" in your browser to investigate the error.
  - Rerun the production build with \`next build --debug-prerender\` to generate better stack traces.`);
          }
        }
      }
      function throwIfDisallowedDynamic(workStore, prelude, dynamicValidation, serverDynamic) {
        if (workStore.invalidDynamicUsageError) {
          logDisallowedDynamicError(workStore, workStore.invalidDynamicUsageError);
          throw new _staticgenerationbailout.StaticGenBailoutError();
        }
        if (prelude !== 0) {
          if (dynamicValidation.hasSuspenseAboveBody) {
            return;
          }
          if (serverDynamic.syncDynamicErrorWithStack) {
            logDisallowedDynamicError(workStore, serverDynamic.syncDynamicErrorWithStack);
            throw new _staticgenerationbailout.StaticGenBailoutError();
          }
          const dynamicErrors = dynamicValidation.dynamicErrors;
          if (dynamicErrors.length > 0) {
            for (let i = 0; i < dynamicErrors.length; i++) {
              logDisallowedDynamicError(workStore, dynamicErrors[i]);
            }
            throw new _staticgenerationbailout.StaticGenBailoutError();
          }
          if (dynamicValidation.hasDynamicViewport) {
            console.error(`Route "${workStore.route}" has a \`generateViewport\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) without explicitly allowing fully dynamic rendering. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-viewport`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
          }
          if (prelude === 1) {
            console.error(`Route "${workStore.route}" did not produce a static shell and Next.js was unable to determine a reason. This is a bug in Next.js.`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
          }
        } else {
          if (dynamicValidation.hasAllowedDynamic === false && dynamicValidation.hasDynamicMetadata) {
            console.error(`Route "${workStore.route}" has a \`generateMetadata\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) when the rest of the route does not. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-metadata`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
          }
        }
      }
    }
  });

  // node_modules/next/dist/server/app-render/after-task-async-storage-instance.js
  var require_after_task_async_storage_instance = __commonJS({
    "node_modules/next/dist/server/app-render/after-task-async-storage-instance.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "afterTaskAsyncStorageInstance", {
        enumerable: true,
        get: function() {
          return afterTaskAsyncStorageInstance;
        }
      });
      var _asynclocalstorage = require_async_local_storage();
      var afterTaskAsyncStorageInstance = (0, _asynclocalstorage.createAsyncLocalStorage)();
    }
  });

  // node_modules/next/dist/server/app-render/after-task-async-storage.external.js
  var require_after_task_async_storage_external = __commonJS({
    "node_modules/next/dist/server/app-render/after-task-async-storage.external.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "afterTaskAsyncStorage", {
        enumerable: true,
        get: function() {
          return _aftertaskasyncstorageinstance.afterTaskAsyncStorageInstance;
        }
      });
      var _aftertaskasyncstorageinstance = require_after_task_async_storage_instance();
    }
  });

  // node_modules/next/dist/server/request/utils.js
  var require_utils2 = __commonJS({
    "node_modules/next/dist/server/request/utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        isRequestAPICallableInsideAfter: function() {
          return isRequestAPICallableInsideAfter;
        },
        throwForSearchParamsAccessInUseCache: function() {
          return throwForSearchParamsAccessInUseCache;
        },
        throwWithStaticGenerationBailoutError: function() {
          return throwWithStaticGenerationBailoutError;
        },
        throwWithStaticGenerationBailoutErrorWithDynamicError: function() {
          return throwWithStaticGenerationBailoutErrorWithDynamicError;
        }
      });
      var _staticgenerationbailout = require_static_generation_bailout();
      var _aftertaskasyncstorageexternal = require_after_task_async_storage_external();
      function throwWithStaticGenerationBailoutError(route, expression) {
        throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${route} couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
          value: "E576",
          enumerable: false,
          configurable: true
        });
      }
      function throwWithStaticGenerationBailoutErrorWithDynamicError(route, expression) {
        throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${route} with \`dynamic = "error"\` couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
          value: "E543",
          enumerable: false,
          configurable: true
        });
      }
      function throwForSearchParamsAccessInUseCache(workStore, constructorOpt) {
        const error = Object.defineProperty(new Error(`Route ${workStore.route} used "searchParams" inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "searchParams" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
          value: "E634",
          enumerable: false,
          configurable: true
        });
        Error.captureStackTrace(error, constructorOpt);
        workStore.invalidDynamicUsageError ??= error;
        throw error;
      }
      function isRequestAPICallableInsideAfter() {
        const afterTaskStore = _aftertaskasyncstorageexternal.afterTaskAsyncStorage.getStore();
        return (afterTaskStore == null ? void 0 : afterTaskStore.rootTaskSpawnPhase) === "action";
      }
    }
  });

  // node_modules/next/dist/server/request/connection.js
  var require_connection = __commonJS({
    "node_modules/next/dist/server/request/connection.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "connection", {
        enumerable: true,
        get: function() {
          return connection;
        }
      });
      var _workasyncstorageexternal = require_work_async_storage_external();
      var _workunitasyncstorageexternal = require_work_unit_async_storage_external();
      var _dynamicrendering = require_dynamic_rendering();
      var _staticgenerationbailout = require_static_generation_bailout();
      var _dynamicrenderingutils = require_dynamic_rendering_utils();
      var _utils = require_utils2();
      function connection() {
        const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
        const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
        if (workStore) {
          if (workUnitStore && workUnitStore.phase === "after" && !(0, _utils.isRequestAPICallableInsideAfter)()) {
            throw Object.defineProperty(new Error(`Route ${workStore.route} used "connection" inside "after(...)". The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual Request, but "after(...)" executes after the request, so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", {
              value: "E186",
              enumerable: false,
              configurable: true
            });
          }
          if (workStore.forceStatic) {
            return Promise.resolve(void 0);
          }
          if (workUnitStore) {
            if (workUnitStore.type === "cache") {
              throw Object.defineProperty(new Error(`Route ${workStore.route} used "connection" inside "use cache". The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual Request, but caches must be able to be produced before a Request so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
                value: "E111",
                enumerable: false,
                configurable: true
              });
            } else if (workUnitStore.type === "unstable-cache") {
              throw Object.defineProperty(new Error(`Route ${workStore.route} used "connection" inside a function cached with "unstable_cache(...)". The \`connection()\` function is used to indicate the subsequent code must only run when there is an actual Request, but caches must be able to be produced before a Request so this function is not allowed in this scope. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", {
                value: "E1",
                enumerable: false,
                configurable: true
              });
            }
          }
          if (workStore.dynamicShouldError) {
            throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${workStore.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`connection\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
              value: "E562",
              enumerable: false,
              configurable: true
            });
          }
          if (workUnitStore) {
            if (workUnitStore.type === "prerender" || workUnitStore.type === "prerender-client") {
              return (0, _dynamicrenderingutils.makeHangingPromise)(workUnitStore.renderSignal, "`connection()`");
            } else if (workUnitStore.type === "prerender-ppr") {
              (0, _dynamicrendering.postponeWithTracking)(workStore.route, "connection", workUnitStore.dynamicTracking);
            } else if (workUnitStore.type === "prerender-legacy") {
              (0, _dynamicrendering.throwToInterruptStaticGeneration)("connection", workStore, workUnitStore);
            }
          }
          (0, _dynamicrendering.trackDynamicDataInDynamicRender)(workStore, workUnitStore);
        }
        return Promise.resolve(void 0);
      }
    }
  });

  // node_modules/next/dist/shared/lib/invariant-error.js
  var require_invariant_error = __commonJS({
    "node_modules/next/dist/shared/lib/invariant-error.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "InvariantError", {
        enumerable: true,
        get: function() {
          return InvariantError;
        }
      });
      var InvariantError = class extends Error {
        constructor(message, options) {
          super("Invariant: " + (message.endsWith(".") ? message : message + ".") + " This is a bug in Next.js.", options);
          this.name = "InvariantError";
        }
      };
    }
  });

  // node_modules/next/dist/shared/lib/utils/reflect-utils.js
  var require_reflect_utils = __commonJS({
    "node_modules/next/dist/shared/lib/utils/reflect-utils.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      function _export(target, all) {
        for (var name in all)
          Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
          });
      }
      _export(exports, {
        describeHasCheckingStringProperty: function() {
          return describeHasCheckingStringProperty;
        },
        describeStringPropertyAccess: function() {
          return describeStringPropertyAccess;
        },
        wellKnownProperties: function() {
          return wellKnownProperties;
        }
      });
      var isDefinitelyAValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
      function describeStringPropertyAccess(target, prop) {
        if (isDefinitelyAValidIdentifier.test(prop)) {
          return "`" + target + "." + prop + "`";
        }
        return "`" + target + "[" + JSON.stringify(prop) + "]`";
      }
      function describeHasCheckingStringProperty(target, prop) {
        const stringifiedProp = JSON.stringify(prop);
        return "`Reflect.has(" + target + ", " + stringifiedProp + ")`, `" + stringifiedProp + " in " + target + "`, or similar";
      }
      var wellKnownProperties = /* @__PURE__ */ new Set([
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "toString",
        "valueOf",
        "toLocaleString",
        // Promise prototype
        // fallthrough
        "then",
        "catch",
        "finally",
        // React Promise extension
        // fallthrough
        "status",
        // React introspection
        "displayName",
        "_debugInfo",
        // Common tested properties
        // fallthrough
        "toJSON",
        "$$typeof",
        "__esModule"
      ]);
    }
  });

  // node_modules/next/dist/server/request/root-params.js
  var require_root_params = __commonJS({
    "node_modules/next/dist/server/request/root-params.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      Object.defineProperty(exports, "unstable_rootParams", {
        enumerable: true,
        get: function() {
          return unstable_rootParams;
        }
      });
      var _invarianterror = require_invariant_error();
      var _dynamicrendering = require_dynamic_rendering();
      var _workasyncstorageexternal = require_work_async_storage_external();
      var _workunitasyncstorageexternal = require_work_unit_async_storage_external();
      var _dynamicrenderingutils = require_dynamic_rendering_utils();
      var _reflectutils = require_reflect_utils();
      var CachedParams = /* @__PURE__ */ new WeakMap();
      async function unstable_rootParams() {
        const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
        if (!workStore) {
          throw Object.defineProperty(new _invarianterror.InvariantError("Missing workStore in unstable_rootParams"), "__NEXT_ERROR_CODE", {
            value: "E615",
            enumerable: false,
            configurable: true
          });
        }
        const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
        if (!workUnitStore) {
          throw Object.defineProperty(new Error(`Route ${workStore.route} used \`unstable_rootParams()\` in Pages Router. This API is only available within App Router.`), "__NEXT_ERROR_CODE", {
            value: "E641",
            enumerable: false,
            configurable: true
          });
        }
        switch (workUnitStore.type) {
          case "unstable-cache":
          case "cache": {
            throw Object.defineProperty(new Error(`Route ${workStore.route} used \`unstable_rootParams()\` inside \`"use cache"\` or \`unstable_cache\`. Support for this API inside cache scopes is planned for a future version of Next.js.`), "__NEXT_ERROR_CODE", {
              value: "E642",
              enumerable: false,
              configurable: true
            });
          }
          case "prerender":
          case "prerender-client":
          case "prerender-ppr":
          case "prerender-legacy":
            return createPrerenderRootParams(workUnitStore.rootParams, workStore, workUnitStore);
          default:
            return Promise.resolve(workUnitStore.rootParams);
        }
      }
      function createPrerenderRootParams(underlyingParams, workStore, prerenderStore) {
        const fallbackParams = workStore.fallbackRouteParams;
        if (fallbackParams) {
          let hasSomeFallbackParams = false;
          for (const key in underlyingParams) {
            if (fallbackParams.has(key)) {
              hasSomeFallbackParams = true;
              break;
            }
          }
          if (hasSomeFallbackParams) {
            switch (prerenderStore.type) {
              case "prerender":
                const cachedParams = CachedParams.get(underlyingParams);
                if (cachedParams) {
                  return cachedParams;
                }
                const promise = (0, _dynamicrenderingutils.makeHangingPromise)(prerenderStore.renderSignal, "`unstable_rootParams`");
                CachedParams.set(underlyingParams, promise);
                return promise;
              case "prerender-client":
                const exportName = "`unstable_rootParams`";
                throw Object.defineProperty(new _invarianterror.InvariantError(`${exportName} must not be used within a client component. Next.js should be preventing ${exportName} from being included in client components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                  value: "E693",
                  enumerable: false,
                  configurable: true
                });
              default:
                return makeErroringRootParams(underlyingParams, fallbackParams, workStore, prerenderStore);
            }
          }
        }
        return Promise.resolve(underlyingParams);
      }
      function makeErroringRootParams(underlyingParams, fallbackParams, workStore, prerenderStore) {
        const cachedParams = CachedParams.get(underlyingParams);
        if (cachedParams) {
          return cachedParams;
        }
        const augmentedUnderlying = {
          ...underlyingParams
        };
        const promise = Promise.resolve(augmentedUnderlying);
        CachedParams.set(underlyingParams, promise);
        Object.keys(underlyingParams).forEach((prop) => {
          if (_reflectutils.wellKnownProperties.has(prop)) {
          } else {
            if (fallbackParams.has(prop)) {
              Object.defineProperty(augmentedUnderlying, prop, {
                get() {
                  const expression = (0, _reflectutils.describeStringPropertyAccess)("unstable_rootParams", prop);
                  if (prerenderStore.type === "prerender-ppr") {
                    (0, _dynamicrendering.postponeWithTracking)(workStore.route, expression, prerenderStore.dynamicTracking);
                  } else {
                    (0, _dynamicrendering.throwToInterruptStaticGeneration)(expression, workStore, prerenderStore);
                  }
                },
                enumerable: true
              });
            } else {
              ;
              promise[prop] = underlyingParams[prop];
            }
          }
        });
        return promise;
      }
    }
  });

  // node_modules/next/server.js
  var require_server = __commonJS({
    "node_modules/next/server.js"(exports, module) {
      var serverExports = {
        NextRequest: require_request().NextRequest,
        NextResponse: require_response().NextResponse,
        ImageResponse: require_image_response().ImageResponse,
        userAgentFromString: require_user_agent().userAgentFromString,
        userAgent: require_user_agent().userAgent,
        URLPattern: require_url_pattern().URLPattern,
        after: require_after2().after,
        connection: require_connection().connection,
        unstable_rootParams: require_root_params().unstable_rootParams
      };
      module.exports = serverExports;
      exports.NextRequest = serverExports.NextRequest;
      exports.NextResponse = serverExports.NextResponse;
      exports.ImageResponse = serverExports.ImageResponse;
      exports.userAgentFromString = serverExports.userAgentFromString;
      exports.userAgent = serverExports.userAgent;
      exports.URLPattern = serverExports.URLPattern;
      exports.after = serverExports.after;
      exports.connection = serverExports.connection;
      exports.unstable_rootParams = serverExports.unstable_rootParams;
    }
  });

  // edge-functions/edge/index.ts
  var import_server = __toESM(require_server());
  function onRequest(context) {
    console.log("in middleware - pathname:", context);
    const response = import_server.NextResponse.next();
    response.headers.set("x-middleware-executed", "true");
    response.headers.set("x-request-time", (/* @__PURE__ */ new Date()).toISOString());
    return response;
  }
  var config = {
    matcher: [
      "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
  };

        pagesFunctionResponse = onRequest;
      })();
          }
        

        const params = {};
        if (routeParams.id) {
          if (routeParams.mode === 1) {
            const value = urlInfo.pathname.match(routeParams.left);        
            for (let i = 1; i < value.length; i++) {
              params[routeParams.id[i - 1]] = value[i];
            }
          } else {
            const value = urlInfo.pathname.replace(routeParams.left, '');
            const splitedValue = value.split('/');
            if (splitedValue.length === 1) {
              params[routeParams.id] = splitedValue[0];
            } else {
              params[routeParams.id] = splitedValue;
            }
          }
          
        }
        if(!matchedFunc){
          pagesFunctionResponse = function() {
            return new Response(null, {
              status: 404,
              headers: {
                "content-type": "text/html; charset=UTF-8",
                "x-edgefunctions-test": "Welcome to use Pages Functions.",
              },
            });
          }
        }
        return pagesFunctionResponse({request, params, env: {"MallocNanoZone":"0","USER":"vincentlli","COMMAND_MODE":"unix2003","__CFBundleIdentifier":"com.todesktop.230313mzl4w4u92","PATH":"/Users/vincentlli/.local/state/fnm_multishells/58050_1757163705093/bin:/Users/vincentlli/anaconda3/bin:/Users/vincentlli/.nvm/versions/node/v20.16.0/bin:/Users/vincentlli/Documents/demo/h265/emsdk:/Users/vincentlli/Documents/demo/h265/emsdk/upstream/emscripten:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Library/Apple/usr/bin:/Users/vincentlli/.local/state/fnm_multishells/53062_1757163699591/bin:/Users/vincentlli/.deno/bin:/Users/vincentlli/anaconda3/bin:/Users/vincentlli/micromamba/condabin:/Users/vincentlli/.nvm/versions/node/v20.16.0/bin","LOGNAME":"vincentlli","SSH_AUTH_SOCK":"/private/tmp/com.apple.launchd.Sg9QOq3DsU/Listeners","HOME":"/Users/vincentlli","SHELL":"/bin/zsh","TMPDIR":"/var/folders/3z/jtwy8_190w3c74yyzhd5wz580000gp/T/","__CF_USER_TEXT_ENCODING":"0x1F6:0x19:0x34","XPC_SERVICE_NAME":"0","XPC_FLAGS":"0x0","ORIGINAL_XDG_CURRENT_DESKTOP":"undefined","CURSOR_TRACE_ID":"24775c3c9b2b4d64b286b028e1e49c6c","SHLVL":"1","PWD":"/Users/vincentlli/Documents/demo/netlify/my-app-latest","OLDPWD":"/Users/vincentlli/Documents/demo/netlify","HOMEBREW_PREFIX":"/opt/homebrew","HOMEBREW_CELLAR":"/opt/homebrew/Cellar","HOMEBREW_REPOSITORY":"/opt/homebrew","INFOPATH":"/opt/homebrew/share/info:/opt/homebrew/share/info:","EMSDK":"/Users/vincentlli/Documents/demo/h265/emsdk","EMSDK_NODE":"/Users/vincentlli/Documents/demo/h265/emsdk/node/16.20.0_64bit/bin/node","EMSDK_PYTHON":"/Users/vincentlli/Documents/demo/h265/emsdk/python/3.9.2_64bit/bin/python3","SSL_CERT_FILE":"/Users/vincentlli/Documents/demo/h265/emsdk/python/3.9.2_64bit/lib/python3.9/site-packages/certifi/cacert.pem","NVM_DIR":"/Users/vincentlli/.nvm","NVM_CD_FLAGS":"-q","NVM_BIN":"/Users/vincentlli/.nvm/versions/node/v20.16.0/bin","NVM_INC":"/Users/vincentlli/.nvm/versions/node/v20.16.0/include/node","MAMBA_EXE":"/Users/vincentlli/.micromamba/bin/micromamba","MAMBA_ROOT_PREFIX":"/Users/vincentlli/micromamba","CONDA_SHLVL":"0","FNM_MULTISHELL_PATH":"/Users/vincentlli/.local/state/fnm_multishells/58050_1757163705093","FNM_VERSION_FILE_STRATEGY":"local","FNM_DIR":"/Users/vincentlli/.local/share/fnm","FNM_LOGLEVEL":"info","FNM_NODE_DIST_MIRROR":"https://nodejs.org/dist","FNM_COREPACK_ENABLED":"false","FNM_RESOLVE_ENGINES":"true","FNM_ARCH":"arm64","TERM_PROGRAM":"vscode","TERM_PROGRAM_VERSION":"1.2.4","LANG":"zh_CN.UTF-8","COLORTERM":"truecolor","GIT_ASKPASS":"/Applications/Cursor.app/Contents/Resources/app/extensions/git/dist/askpass.sh","VSCODE_GIT_ASKPASS_NODE":"/Applications/Cursor.app/Contents/Frameworks/Cursor Helper (Plugin).app/Contents/MacOS/Cursor Helper (Plugin)","VSCODE_GIT_ASKPASS_EXTRA_ARGS":"","VSCODE_GIT_ASKPASS_MAIN":"/Applications/Cursor.app/Contents/Resources/app/extensions/git/dist/askpass-main.js","VSCODE_GIT_IPC_HANDLE":"/var/folders/3z/jtwy8_190w3c74yyzhd5wz580000gp/T/vscode-git-5299d76b1d.sock","VSCODE_INJECTION":"1","ZDOTDIR":"/Users/vincentlli","USER_ZDOTDIR":"/Users/vincentlli","TERM":"xterm-256color","VSCODE_PROFILE_INITIALIZED":"1","_":"/Users/vincentlli/.nvm/versions/node/v20.16.0/bin/edgeone","NEXT_PRIVATE_STANDALONE":"true"}, waitUntil });
      }
      addEventListener('fetch', event=>{return event.respondWith(handleRequest({request:event.request,params: {}, env: {"MallocNanoZone":"0","USER":"vincentlli","COMMAND_MODE":"unix2003","__CFBundleIdentifier":"com.todesktop.230313mzl4w4u92","PATH":"/Users/vincentlli/.local/state/fnm_multishells/58050_1757163705093/bin:/Users/vincentlli/anaconda3/bin:/Users/vincentlli/.nvm/versions/node/v20.16.0/bin:/Users/vincentlli/Documents/demo/h265/emsdk:/Users/vincentlli/Documents/demo/h265/emsdk/upstream/emscripten:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Library/Apple/usr/bin:/Users/vincentlli/.local/state/fnm_multishells/53062_1757163699591/bin:/Users/vincentlli/.deno/bin:/Users/vincentlli/anaconda3/bin:/Users/vincentlli/micromamba/condabin:/Users/vincentlli/.nvm/versions/node/v20.16.0/bin","LOGNAME":"vincentlli","SSH_AUTH_SOCK":"/private/tmp/com.apple.launchd.Sg9QOq3DsU/Listeners","HOME":"/Users/vincentlli","SHELL":"/bin/zsh","TMPDIR":"/var/folders/3z/jtwy8_190w3c74yyzhd5wz580000gp/T/","__CF_USER_TEXT_ENCODING":"0x1F6:0x19:0x34","XPC_SERVICE_NAME":"0","XPC_FLAGS":"0x0","ORIGINAL_XDG_CURRENT_DESKTOP":"undefined","CURSOR_TRACE_ID":"24775c3c9b2b4d64b286b028e1e49c6c","SHLVL":"1","PWD":"/Users/vincentlli/Documents/demo/netlify/my-app-latest","OLDPWD":"/Users/vincentlli/Documents/demo/netlify","HOMEBREW_PREFIX":"/opt/homebrew","HOMEBREW_CELLAR":"/opt/homebrew/Cellar","HOMEBREW_REPOSITORY":"/opt/homebrew","INFOPATH":"/opt/homebrew/share/info:/opt/homebrew/share/info:","EMSDK":"/Users/vincentlli/Documents/demo/h265/emsdk","EMSDK_NODE":"/Users/vincentlli/Documents/demo/h265/emsdk/node/16.20.0_64bit/bin/node","EMSDK_PYTHON":"/Users/vincentlli/Documents/demo/h265/emsdk/python/3.9.2_64bit/bin/python3","SSL_CERT_FILE":"/Users/vincentlli/Documents/demo/h265/emsdk/python/3.9.2_64bit/lib/python3.9/site-packages/certifi/cacert.pem","NVM_DIR":"/Users/vincentlli/.nvm","NVM_CD_FLAGS":"-q","NVM_BIN":"/Users/vincentlli/.nvm/versions/node/v20.16.0/bin","NVM_INC":"/Users/vincentlli/.nvm/versions/node/v20.16.0/include/node","MAMBA_EXE":"/Users/vincentlli/.micromamba/bin/micromamba","MAMBA_ROOT_PREFIX":"/Users/vincentlli/micromamba","CONDA_SHLVL":"0","FNM_MULTISHELL_PATH":"/Users/vincentlli/.local/state/fnm_multishells/58050_1757163705093","FNM_VERSION_FILE_STRATEGY":"local","FNM_DIR":"/Users/vincentlli/.local/share/fnm","FNM_LOGLEVEL":"info","FNM_NODE_DIST_MIRROR":"https://nodejs.org/dist","FNM_COREPACK_ENABLED":"false","FNM_RESOLVE_ENGINES":"true","FNM_ARCH":"arm64","TERM_PROGRAM":"vscode","TERM_PROGRAM_VERSION":"1.2.4","LANG":"zh_CN.UTF-8","COLORTERM":"truecolor","GIT_ASKPASS":"/Applications/Cursor.app/Contents/Resources/app/extensions/git/dist/askpass.sh","VSCODE_GIT_ASKPASS_NODE":"/Applications/Cursor.app/Contents/Frameworks/Cursor Helper (Plugin).app/Contents/MacOS/Cursor Helper (Plugin)","VSCODE_GIT_ASKPASS_EXTRA_ARGS":"","VSCODE_GIT_ASKPASS_MAIN":"/Applications/Cursor.app/Contents/Resources/app/extensions/git/dist/askpass-main.js","VSCODE_GIT_IPC_HANDLE":"/var/folders/3z/jtwy8_190w3c74yyzhd5wz580000gp/T/vscode-git-5299d76b1d.sock","VSCODE_INJECTION":"1","ZDOTDIR":"/Users/vincentlli","USER_ZDOTDIR":"/Users/vincentlli","TERM":"xterm-256color","VSCODE_PROFILE_INITIALIZED":"1","_":"/Users/vincentlli/.nvm/versions/node/v20.16.0/bin/edgeone","NEXT_PRIVATE_STANDALONE":"true"}, waitUntil: event.waitUntil }))});