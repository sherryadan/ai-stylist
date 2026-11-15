import { cache } from "react";
import { cookies } from "next/headers";
import { supabaseClient, supabaseConfig } from "./supabase-auth";

export const shopperAccessCookie = "stylist-shopper-access";

export async function issuePasswordSession(accessToken: string, lifetime: number) {
  if (!accessToken || !Number.isFinite(lifetime) || lifetime < 1) return false;
  (await cookies()).set(shopperAccessCookie, accessToken, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/",
    maxAge: Math.min(8 * 60 * 60, Math.floor(lifetime)),
  });
  return true;
}

export const passwordAccountId = cache(async () => {
  const token = (await cookies()).get(shopperAccessCookie)?.value;
  const config = supabaseConfig();
  if (!token || !config) return;
  const { data, error } = await supabaseClient(config.url, config.key).auth.getUser(token);
  if (error || !data.user) return;
  if (config.signupCode && data.user.app_metadata.stylist_demo_enrolled !== true) return;
  return data.user.id;
});

export async function revokePasswordSession() {
  const jar = await cookies();
  const token = jar.get(shopperAccessCookie)?.value;
  if (token) jar.delete(shopperAccessCookie);
  if (jar.has("stylist-password-session")) jar.delete("stylist-password-session");
  const config = supabaseConfig();
  if (token && config) await supabaseClient(config.url, config.key).auth.admin.signOut(token, "local");
}
