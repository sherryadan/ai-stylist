"use server";

import { redirect } from "next/navigation";
import { saveLocalStylingRequest } from "@/lib/local-account";
import { stylingRequestSchema } from "@/lib/styling-request";

export async function submitRequest(_: string, form: FormData): Promise<string> {
  const request = stylingRequestSchema.safeParse(Object.fromEntries(form));
  if (!request.success) return "Check the occasion, clothing category, budget and field lengths.";
  const result = await saveLocalStylingRequest(request.data);
  if (result === "signed-out") return "Sign in again to save this request.";
  if (result === "quota") return "The local limit is 30 requests per 24 hours. Try again later.";
  return redirect(`/styling-requests/${request.data.id}`);
}
