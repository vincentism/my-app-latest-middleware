/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { jsonResponse, handleOptions } from "../../lib/utils.js";
import { requireAuth } from "../../lib/middleware.js";

// This list should be dynamically fetched or configured in a real application.
// The structure matches what's expected by the frontend and Chrome extension.
const servers = [
    { id: 'jp-tokyo', location: 'Tokyo, Japan', flag: '🇯🇵', domain: 'jp.proxy.privanet.com' },
    { id: 'us-nyc', location: 'New York, USA', flag: '🇺🇸', domain: 'us.proxy.privanet.com' },
    { id: 'uk-london', location: 'London, UK', flag: '🇬🇧', domain: 'uk.proxy.privanet.com' },
    { id: 'de-frankfurt', location: 'Frankfurt, DE', flag: '🇩🇪', domain: 'de.proxy.privanet.com' },
];

async function getProxyNodes(context) {
    const { user } = context;
    // In a production scenario, you could filter servers based on the user's subscription plan.
    // For now, we return the full list to any authenticated user.
    return jsonResponse(servers);
}

export const onRequestGet = requireAuth(getProxyNodes);

export async function onRequestOptions({ request }) {
    return handleOptions(request);
}
