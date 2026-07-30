import { JwtPayload } from "@/types/user";

// A JWT looks like: header.payload.signature — three base64url-encoded
// parts separated by dots. We only need to read the middle "payload" part
// to see what's inside (e.g. the user's id).
//
// IMPORTANT: this does NOT verify the token is genuine — it just reads it.
// That's fine for our purposes, because we only use this to display data
// and to know which user's profile to fetch. The backend is the one that
// actually verifies the token's signature on every protected request
// (see app/utils/jwtHelper.js -> verifyAccessToken). If someone tampered
// with the token, the backend would simply reject their requests.
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payloadPart = token.split(".")[1];

    // JWTs use "base64url" encoding, which swaps a couple of characters
    // compared to regular base64 so it's safe to use in URLs. We convert
    // it back to regular base64 before decoding.
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");

    const jsonString = atob(base64);
    return JSON.parse(jsonString) as JwtPayload;
  } catch {
    // Malformed token — treat it the same as "couldn't read it".
    return null;
  }
}
