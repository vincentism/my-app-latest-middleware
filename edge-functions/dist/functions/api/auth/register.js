/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { errorResponse, handleOptions } from "../../lib/utils.js";

export async function onRequestPost({ request, env }) {
    return errorResponse("Email registration is disabled. Please use Google or a Web3 wallet to sign in.", 405);
}

export async function onRequestOptions({ request }) {
  return handleOptions(request);
}
