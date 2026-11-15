"use client";

import { useRecoverableForm } from "@/hooks/use-recoverable-form";
import { passwordSignIn, passwordSignUp } from "@/app/account-actions";

const field = "mt-2 block w-full rounded-lg border border-stone-400 bg-white px-4 py-3";

export function PasswordForm({ registration, needsCode, next }: { registration: boolean; needsCode: boolean; next?: string }) {
  const { message, action, pending, onSubmit, errorRef } = useRecoverableForm(registration ? passwordSignUp : passwordSignIn);
  return (
    <form action={action} onSubmit={onSubmit} className="editorial-enter space-y-5">
      {next && <input type="hidden" name="next" value={next} />}
      <label className="block">Email<input name="email" type="email" autoComplete="email" maxLength={254} className={field} required /></label>
      <label className="block">Password<input name="password" type="password" autoComplete={registration ? "new-password" : "current-password"}
        minLength={registration ? 8 : undefined} maxLength={72} className={field} required /></label>
      {registration && <label className="block">Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" maxLength={72} className={field} required /></label>}
      {registration && needsCode && <label className="block">Demo access code<input name="signupCode" type="password" autoComplete="off" maxLength={256} className={field} required /></label>}
      {message && <p ref={errorRef} tabIndex={-1} role="alert" className="scroll-mt-24 text-red-900">{message}</p>}
      <button className="min-h-11 w-full rounded-full bg-stone-950 px-6 py-3 text-white hover:bg-orange-950 disabled:opacity-60 sm:w-auto" disabled={pending}>
        {pending ? "Working…" : registration ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
