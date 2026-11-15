import Link from "next/link";
import { redirect } from "next/navigation";
import { currentShopper, localAccountEnabled } from "@/lib/local-account";
import { supabaseConfig } from "@/lib/supabase-auth";
import { PasswordForm } from "./password-form";

export async function PasswordEntry({ registration = false }: { registration?: boolean }) {
  if (await currentShopper()) redirect("/profile");
  const config = supabaseConfig();
  if (!config && localAccountEnabled()) redirect("/profile");
  return (
    <section className="bg-[#f4ede2] px-5 py-16 text-stone-950">
      <div className="mx-auto max-w-lg">
        <h1 className="font-serif text-5xl tracking-tight">{registration ? "Create your account" : "Sign in"}</h1>
        <div className="mt-7 rounded-3xl border border-stone-300 bg-[#fffbf5] p-6 sm:p-9">
          {config ? <PasswordForm registration={registration} needsCode={Boolean(config.signupCode)} />
            : <p>Email sign-in is currently unavailable.</p>}
          <p className="mt-6 text-sm">{registration ? "Already have an account?" : "New to StylistAI?"}{" "}
            <Link href={registration ? "/login" : "/signup"} className="underline underline-offset-4">
              {registration ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
