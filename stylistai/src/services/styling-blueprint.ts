import { z } from "zod";
import type { StylingRequest } from "../lib/styling-request";

const palette = z.enum(["ivory", "olive", "charcoal", "cream", "tan", "black", "blue", "white", "sand", "navy", "brown"]);
const blueprintSchema = z.object({ preferredColors: z.array(palette).max(4) }).strict();
export type StylingBlueprint = z.output<typeof blueprintSchema>;
type BlueprintInput = Pick<StylingRequest, "occasion" | "category" | "dressCode">;

export function templateBlueprint(input: BlueprintInput): StylingBlueprint {
  return ["wedding", "business-meeting"].includes(input.occasion) || input.dressCode === "Formal"
    ? { preferredColors: ["ivory", "charcoal", "navy", "black"] }
    : { preferredColors: ["sand", "cream", "olive", "blue"] };
}

export function localBlueprintPort() {
  const port = process.env.STYLIST_BLUEPRINT_PORT;
  return process.env.NODE_ENV === "development" && port && /^[1-9][0-9]{0,4}$/.test(port) && Number(port) <= 65535
    ? Number(port) : undefined;
}

export async function requestBlueprint(port: number, input: BlueprintInput, send = fetch) {
  if (!Number.isInteger(port) || port < 1 || port > 65535) return;
  try {
    const response = await send(`http://127.0.0.1:${port}/blueprint`, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(2_000),
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ occasion: input.occasion, category: input.category, dressCode: input.dressCode }),
    });
    if (!response.ok || !response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8", { fatal: true });
    let bytes = 0;
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 2_048) {
        await reader.cancel();
        return;
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    const result = blueprintSchema.safeParse(JSON.parse(text));
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}
