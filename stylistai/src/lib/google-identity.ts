import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";

const keys = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"), { timeoutDuration: 5000 });
export const randomToken = () => randomBytes(32).toString("base64url");
export const tokenDigest = (value: string) => createHash("sha256").update(value).digest("hex");

export function sameToken(expected: string, actual: string) {
  return timingSafeEqual(Buffer.from(tokenDigest(expected)), Buffer.from(tokenDigest(actual)));
}

export function googleConfig() {
  const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret, STYLIST_AUTH_ORIGIN: origin,
    STYLIST_HOSTED_DB_FILE: databaseFile, STYLIST_GOOGLE_ALLOWED_EMAILS: emails } = process.env;
  if (!clientId || !clientSecret || !origin || !databaseFile || !emails) return;
  try {
    const url = new URL(origin);
    const loopback = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.origin !== origin || (url.protocol !== "https:" && !loopback)) return;
    const invitations = new Set(emails.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
    if (!invitations.size) return;
    return { clientId, clientSecret, origin, databaseFile, invitations, secure: !loopback,
      callback: `${origin}/auth/google/callback` };
  } catch {
    return;
  }
}

export type GoogleConfig = NonNullable<ReturnType<typeof googleConfig>>;

export async function verifyGoogleIdentity(config: GoogleConfig, code: string, verifier: string, nonce: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(5000),
    body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, code,
      code_verifier: verifier, redirect_uri: config.callback, grant_type: "authorization_code" }),
  });
  if (!response.ok) throw new Error("Google token exchange failed");
  const { id_token: token } = await response.json();
  if (typeof token !== "string") throw new Error("Google did not supply an ID token");
  const { payload } = await jwtVerify(token, keys, {
    issuer: ["https://accounts.google.com", "accounts.google.com"], audience: config.clientId,
    algorithms: ["RS256"], requiredClaims: ["exp", "iat", "sub", "nonce"],
  });
  if (!payload.sub || payload.nonce !== nonce || (payload.azp && payload.azp !== config.clientId)) {
    throw new Error("Google identity did not match this sign-in");
  }
  if (payload.email_verified !== true || typeof payload.email !== "string" ||
      !config.invitations.has(payload.email.trim().toLowerCase())) return;
  return payload.sub;
}
