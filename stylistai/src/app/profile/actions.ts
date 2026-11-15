"use server";

import { redirect } from "next/navigation";
import { deleteLocalAccount, endLocalSession, localAccountEnabled, startLocalSession, writeLocalProfile } from "@/lib/local-account";
import { z } from "zod";
import { googleAccountId, googleDatabase, revokeGoogleSession } from "@/lib/google-account";

export async function signIn() {
  if (!localAccountEnabled()) redirect("/profile");
  await startLocalSession();
  redirect("/profile");
}

export async function signOut() {
  await revokeGoogleSession();
  await endLocalSession();
  redirect("/profile");
}

export async function deleteAccount(form: FormData) {
  if (form.get("confirm") !== "yes") return;
  const owner = await googleAccountId();
  if (owner) {
    googleDatabase().prepare("DELETE FROM demo_account WHERE id = ?").run(owner);
    await revokeGoogleSession();
    await endLocalSession();
    redirect("/profile?deleted=google");
  }
  if (await deleteLocalAccount()) redirect("/profile?deleted=1");
  redirect("/profile");
}

const measurement = (min: number, max: number) => z.union([
  z.literal("").transform(() => null),
  z.string().regex(/^\d{1,3}(?:\.\d)?$/).transform(Number).pipe(z.number().min(min).max(max)),
]);

const profileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  birth_date: z.iso.date().refine((value) => Number(value.slice(0, 4)) >= 1900),
  preference: z.enum(["Eastern", "Western", "Both"]),
  city: z.string().trim().max(80),
  gender: z.string().trim().max(80),
  clothing_size: z.string().trim().max(32),
  shoe_size: z.string().trim().max(32),
  height_cm: measurement(50, 260),
  weight_kg: measurement(20, 400),
  preferred_fit: z.enum(["", "Fitted", "Regular", "Relaxed"]),
  timezone: z.string().max(80).refine((value) => {
    try {
      new Intl.DateTimeFormat("en", { timeZone: value });
      return true;
    } catch {
      return false;
    }
  }),
});

export async function saveProfile(_: string, form: FormData): Promise<string> {
  const parsed = profileSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return "Check the required fields and optional measurements. Height must be 50–260 cm and weight 20–400 kg.";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: parsed.data.timezone }).format(new Date());
  if (parsed.data.birth_date > today) return "Enter a birth date that is today or earlier.";
  if (!(await writeLocalProfile(parsed.data))) return "Your session expired. Sign in again to save.";
  return redirect("/profile?saved=1");
}
