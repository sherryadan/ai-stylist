"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { issuePasswordSession } from "@/lib/password-account";
import { supabaseClient, supabaseConfig } from "@/lib/supabase-auth";

const credentials = z.object({
  email: z.email().max(254).trim().toLowerCase(),
  password: z.string().min(1).max(72),
});

function equalSecret(first: string, second: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(first), digest(second));
}

async function authenticate(form: FormData, registration: boolean): Promise<string> {
  const config = supabaseConfig();
  if (!config) return "Email sign-in is unavailable.";
  const parsed = credentials.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success || Buffer.byteLength(parsed.data.password, "utf8") > 72) {
    return "Enter a valid email address and a password of at most 72 bytes.";
  }
  if (registration) {
    const code = form.get("signupCode");
    if (config.signupCode && (typeof code !== "string" || code.length > 256 || !equalSecret(code, config.signupCode))) {
      return "Enter a valid demo access code.";
    }
    if (parsed.data.password.length < 8) return "Use a password with at least 8 characters.";
    if (parsed.data.password !== form.get("confirmPassword")) return "The passwords do not match.";
  }
  const client = supabaseClient(config.url, config.key);
  try {
    let result = registration ? await client.auth.signUp(parsed.data) : await client.auth.signInWithPassword(parsed.data);
    if (registration && ["user_already_exists", "email_exists"].includes(result.error?.code ?? "")) {
      result = await client.auth.signInWithPassword(parsed.data);
    }
    if (result.error) {
      if (result.error.status === 429) return "Too many attempts. Try again in a few minutes.";
      return registration ? "Couldn’t create the account. Check the details or try signing in." : "The email or password is incorrect.";
    }
    if (!result.data.session || !result.data.user) {
      return registration ? "Registration did not start a session. Ask the demo administrator to check email confirmation settings." : "Sign-in did not start a session. Try again.";
    }
    const { user, session } = result.data;
    const identity = `supabase:${config.url}:${user.id}`;
    if (!(await issuePasswordSession(identity, session.expires_in, registration || !config.signupCode))) {
      return "This account hasn’t joined the private demo. Use the sign-up form with the demo access code.";
    }
  } catch {
    return "Sign-in is temporarily unavailable. Try again.";
  }
  return redirect("/profile");
}

export async function passwordSignIn(_: string, form: FormData) {
  return authenticate(form, false);
}

export async function passwordSignUp(_: string, form: FormData) {
  return authenticate(form, true);
}
