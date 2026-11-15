import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { googleConfig, randomToken } from "@/lib/google-identity";

export function GET() {
  const config = googleConfig();
  if (!config) return new NextResponse("Google sign-in is unavailable.", { status: 503 });
  const state = randomToken();
  const verifier = randomToken();
  const nonce = randomToken();
  const destination = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  destination.search = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.callback,
    response_type: "code", scope: "openid email", state, nonce, code_challenge_method: "S256",
    code_challenge: createHash("sha256").update(verifier).digest("base64url") }).toString();
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set("stylist-google-flow", [state, verifier, nonce].join("."), {
    httpOnly: true, secure: config.secure, sameSite: "lax", path: "/auth/google/callback", maxAge: 600,
  });
  return response;
}
