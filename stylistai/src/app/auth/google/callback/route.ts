import { type NextRequest, NextResponse } from "next/server";
import { googleConfig, sameToken, verifyGoogleIdentity } from "@/lib/google-identity";
import { googleSessionCookie, googleSessionSeconds, issueGoogleSession } from "@/lib/google-account";

export async function GET(request: NextRequest) {
  const config = googleConfig();
  if (!config) return new NextResponse("Google sign-in is unavailable.", { status: 503 });
  const { origin, secure } = config;
  function finish(error?: string) {
    const destination = new URL("/profile", origin);
    if (error) destination.searchParams.set("auth", error);
    const response = NextResponse.redirect(destination);
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set("stylist-google-flow", "", { path: "/auth/google/callback", maxAge: 0,
      httpOnly: true, secure, sameSite: "lax" });
    return response;
  }
  const [expected, verifier, nonce] = request.cookies.get("stylist-google-flow")?.value.split(".") ?? [];
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  if (!expected || !verifier || !nonce || !state || !sameToken(expected, state)) return finish("restart");
  if (!code || code.length > 4096) return finish("cancelled");
  try {
    const identity = await verifyGoogleIdentity(config, code, verifier, nonce);
    if (!identity) return finish("invite");
    const token = issueGoogleSession(identity, request.cookies.get(googleSessionCookie)?.value);
    const response = finish();
    response.cookies.set(googleSessionCookie, token, { httpOnly: true, secure: config.secure,
      sameSite: "lax", path: "/", maxAge: googleSessionSeconds });
    return response;
  } catch {
    return finish("failed");
  }
}
