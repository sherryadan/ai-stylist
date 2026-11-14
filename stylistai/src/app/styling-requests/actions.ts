"use server";

import { redirect } from "next/navigation";
import { claimBlueprintRequest, readLocalStylingRequest, saveLocalStylingRequest, storeBlueprint } from "@/lib/local-account";
import { stylingRequestSchema } from "@/lib/styling-request";
import { localBlueprintPort, requestBlueprint } from "@/services/styling-blueprint";

export async function submitRequest(_: string, form: FormData): Promise<string> {
  const request = stylingRequestSchema.safeParse(Object.fromEntries(form));
  if (!request.success) return "Check the occasion, clothing category, budget and field lengths.";
  const result = await saveLocalStylingRequest(request.data);
  if (result === "signed-out") return "Sign in again to save this request.";
  if (result === "quota") return "The local limit is 30 requests per 24 hours. Try again later.";
  const port = localBlueprintPort();
  if (port && await claimBlueprintRequest(request.data.id)) {
    const saved = await readLocalStylingRequest(request.data.id);
    const blueprint = saved && await requestBlueprint(port, saved);
    if (blueprint) await storeBlueprint(request.data.id, blueprint);
  }
  return redirect(`/styling-requests/${request.data.id}`);
}
