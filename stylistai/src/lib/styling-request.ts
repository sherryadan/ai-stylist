import { z } from "zod";
import { occasions } from "@/data/occasions";

const optional = z.string().trim().max(100);

export const stylingRequestSchema = z.object({
  id: z.uuid(),
  occasion: z.string().refine((value) => occasions.some(({ id }) => id === value)),
  category: z.enum(["Eastern", "Western", "Mixed"]),
  budget: z.string().regex(/^[0-9]{1,8}$/).transform(Number).refine((value) => value > 0),
  city: optional,
  clothingSize: optional,
  shoeSize: optional,
  dressCode: z.enum(["", "Casual", "Smart casual", "Formal"]),
  avoidColors: optional,
  avoidBrands: optional,
  preferredColors: optional.default(""),
  preferredBrands: optional.default(""),
  style: optional.default(""),
  season: optional.default(""),
  fit: z.enum(["", "Fitted", "Regular", "Relaxed"]).default(""),
  notes: z.string().trim().max(500),
});

export type StylingRequest = z.output<typeof stylingRequestSchema>;

export function stylingRequestDetails(request: StylingRequest) {
  return Object.entries({
    City: request.city,
    "Clothing size": request.clothingSize,
    "Shoe size": request.shoeSize,
    "Dress code": request.dressCode,
    "Preferred colors": request.preferredColors,
    "Preferred brands": request.preferredBrands,
    "Excluded colors": request.avoidColors,
    "Excluded brands": request.avoidBrands,
    Style: request.style,
    "Season or weather": request.season,
    Fit: request.fit,
    Notes: request.notes,
  }).filter(([, value]) => Boolean(value));
}
