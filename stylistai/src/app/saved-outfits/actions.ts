"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sampleMenswear } from "@/data/sample-menswear";
import { readLocalStylingRequest, removeLocalLook, saveLocalLook } from "@/lib/local-account";
import { matchMenswear } from "@/services/menswear-matching";

const identifiers = z.object({ requestId: z.uuid(), lookId: z.string().min(1).max(160) });

export async function saveLook(_: string, form: FormData): Promise<string> {
  const parsed = identifiers.safeParse(Object.fromEntries(form));
  if (!parsed.success) return "This look can’t be saved.";
  const { requestId, lookId } = parsed.data;
  const request = await readLocalStylingRequest(requestId);
  if (!request) return "Your request is unavailable. Sign in and try again.";
  const look = matchMenswear(request, sampleMenswear).options.find(({ id }) => id === lookId);
  if (!look) return "This look no longer meets the request’s constraints.";
  if (!(await saveLocalLook(requestId, look))) return "Sign in again to save the look.";
  revalidatePath("/saved-outfits");
  return "Look saved.";
}

export async function removeLook(form: FormData) {
  const parsed = identifiers.safeParse(Object.fromEntries(form));
  if (!parsed.success) return;
  if (!(await removeLocalLook(parsed.data.requestId, parsed.data.lookId))) redirect("/profile");
  revalidatePath("/saved-outfits");
}
