/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// WARNING: This is a simplified JWT and password hashing implementation for demonstration purposes
// in a Web Crypto environment. For a production system, use a robust, well-vetted library like 'jose'.

// --- Pure JS Base64 Polyfill for Edge Runtime Compatibility ---
// This avoids using btoa/atob or Buffer, which are not available in the Edge Runtime.
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function polyfill_btoa(input = '') {
  let str = String(input);
  let output = '';
  for (
    let block = 0, charCode, i = 0, map = chars;
    str.charAt(i | 0) || (map = '=', i % 1);
    output += map.charAt(63 & block >> 8 - i % 1 * 8)
  ) {
    charCode = str.charCodeAt(i += 3/4);
    if (charCode > 0xFF) {
      throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
    }
    block = block << 8 | charCode;
  }
  return output;
}

function polyfill_atob(input = '') {
  let str = String(input).replace(/=+$/, '');
  let output = '';
  if (str.length % 4 === 1) {
    throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    let bc = 0, bs = 0, buffer, i = 0;
    buffer = str.charAt(i++);
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  return output;
}

// --- JWT-like Token Functions ---

function base64urlEncode(data) {
    const buffer = data instanceof ArrayBuffer ? data : new TextEncoder().encode(JSON.stringify(data));
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return polyfill_btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function base64urlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return polyfill_atob(str);
}

async function getHmacKey(secret) {
    return crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
    );
}

export async function createToken(payload, secret) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = base64urlEncode(header);
    const encodedPayload = base64urlEncode(payload);
    const dataToSign = `${encodedHeader}.${encodedPayload}`;
    
    const key = await getHmacKey(secret);
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(dataToSign));
    
    const encodedSignature = base64urlEncode(signature);
    return `${dataToSign}.${encodedSignature}`;
}

export async function verifyToken(token, secret) {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;
    
    const key = await getHmacKey(secret);
    const signatureStr = base64urlDecode(encodedSignature);
    // Convert the decoded base64 string to a Uint8Array, then get its buffer.
    const signature = Uint8Array.from(signatureStr, c => c.charCodeAt(0));
    
    const isValid = await crypto.subtle.verify('HMAC', key, signature.buffer, new TextEncoder().encode(dataToVerify));
    if (!isValid) return null;

    return JSON.parse(base64urlDecode(encodedPayload));
}
