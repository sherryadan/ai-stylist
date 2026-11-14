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
  notes: z.string().trim().max(500),
});

export type StylingRequest = z.output<typeof stylingRequestSchema>;
