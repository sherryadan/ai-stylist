"use server";

import { redirect } from "next/navigation";
import { endLocalSession, localAccountEnabled, startLocalSession, writeLocalProfile } from "@/lib/local-account";
import { z } from "zod";

export async function signIn() {
  if (!localAccountEnabled()) redirect("/profile");
  await startLocalSession();
  redirect("/profile");
}

export async function signOut() {
  await endLocalSession();
  redirect("/profile");
}

const profileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  birth_date: z.iso.date().refine((value) => Number(value.slice(0, 4)) >= 1900),
  preference: z.enum(["Eastern", "Western", "Both"]),
  city: z.string().trim().max(80),
  gender: z.string().trim().max(80),
  clothing_size: z.string().trim().max(32),
  shoe_size: z.string().trim().max(32),
  timezone: z.string().max(80).refine((value) => {
    try {
      new Intl.DateTimeFormat("en", { timeZone: value });
      return true;
    } catch {
      return false;
    }
  }),
});

export async function saveProfile(_: string, form: FormData) {
  const parsed = profileSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return "Check the required fields and the length of the optional entries.";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: parsed.data.timezone }).format(new Date());
  if (parsed.data.birth_date > today) return "Enter a birth date that is today or earlier.";
  if (!(await writeLocalProfile(parsed.data))) return "Your session expired. Sign in again to save.";
  redirect("/profile?saved=1");
}
