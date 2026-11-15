import { createClient } from "@supabase/supabase-js";

export function supabaseConfig() {
  const { SUPABASE_URL: url, SUPABASE_PUBLISHABLE_KEY: key, STYLIST_HOSTED_DB_FILE: databaseFile } = process.env;
  if (!url || !key || !databaseFile) return;
  try {
    const origin = new URL(url);
    if (origin.protocol !== "https:" &&
      !(process.env.NODE_ENV === "development" && origin.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(origin.hostname))) return;
    return { url: origin.origin, key, databaseFile, adminKey: process.env.SUPABASE_SECRET_KEY,
      signupCode: process.env.STYLIST_SIGNUP_CODE };
  } catch {
    return;
  }
}

export function supabaseClient(url: string, key: string) {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(8000) }) },
  });
}
