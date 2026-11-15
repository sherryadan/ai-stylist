"use client";

import { useActionState } from "react";
import { passwordSignIn, passwordSignUp } from "@/app/account-actions";

const field = "mt-2 block w-full rounded-lg border border-stone-400 bg-white px-4 py-3";

export function PasswordForm({ registration, needsCode }: { registration: boolean; needsCode: boolean }) {
  const [message, action, pending] = useActionState(registration ? passwordSignUp : passwordSignIn, "");
  return (
    <form action={action} className="editorial-enter space-y-5">
      <label className="block">Email<input name="email" type="email" autoComplete="email" maxLength={254} className={field} required /></label>
      <label className="block">Password<input name="password" type="password" autoComplete={registration ? "new-password" : "current-password"}
        minLength={registration ? 8 : undefined} maxLength={72} className={field} required /></label>
      {registration && <label className="block">Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" maxLength={72} className={field} required /></label>}
      {registration && needsCode && <label className="block">Demo access code<input name="signupCode" type="password" autoComplete="off" maxLength={256} className={field} required /></label>}
      {message && <p role="alert" className="text-red-900">{message}</p>}
      <button className="rounded-full bg-stone-950 px-6 py-3 text-white hover:bg-orange-950 disabled:opacity-60" disabled={pending}>
        {pending ? "Working…" : registration ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
