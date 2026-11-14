"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { currentSampleCatalog } from "@/lib/sample-catalog";
import { readLocalStylingRequest, writeLocalLookFeedback } from "@/lib/local-account";
import { matchMenswear } from "@/services/menswear-matching";

const feedbackSchema = z.object({
  requestId: z.uuid(),
  lookId: z.string().min(1).max(160),
  rating: z.enum(["like", "dislike"]),
});

export async function rateLook(_: string, form: FormData): Promise<string> {
  const parsed = feedbackSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return "Couldn’t record this rating.";
  const { requestId, lookId, rating } = parsed.data;
  const request = await readLocalStylingRequest(requestId);
  if (!request) return "Sign in to give feedback on this request.";
  if (!matchMenswear(request, currentSampleCatalog()).options.some(({ id }) => id === lookId)) {
    return "This look is unavailable for feedback.";
  }
  if (!(await writeLocalLookFeedback(requestId, lookId, rating))) return "Sign in again to give feedback.";
  revalidatePath(`/styling-requests/${requestId}`);
  return rating;
}
