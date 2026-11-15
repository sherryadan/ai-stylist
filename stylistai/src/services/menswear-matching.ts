import type { CatalogItem } from "@/data/sample-menswear";
import type { StylingRequest } from "@/lib/styling-request";
import type { StylingBlueprint } from "./styling-blueprint";

export interface MatchedLook {
  id: string;
  items: readonly CatalogItem[];
  subtotal: number;
}

const normalize = (value: string) => value.trim().toLowerCase();
const normalizedList = (value = "") => new Set(value.split(",").map(normalize).filter(Boolean));
const neutralColors = new Set(["ivory", "cream", "charcoal", "tan", "black", "white", "sand", "navy", "brown"]);

export function matchMenswear(request: StylingRequest, catalog: readonly CatalogItem[], blueprint?: StylingBlueprint) {
  const colors = normalizedList(request.avoidColors);
  const brands = normalizedList(request.avoidBrands);
  const preferredColors = normalizedList(request.preferredColors);
  const preferredBrands = normalizedList(request.preferredBrands);
  const palette = new Set<string>(blueprint?.preferredColors);
  const eligible = catalog.filter((item) => {
    const size = normalize(item.slot === "footwear" ? request.shoeSize : request.clothingSize);
    return item.currency === "PKR" &&
      (request.category === "Mixed" || request.category === item.category) &&
      (!request.dressCode || item.dressCodes.includes(request.dressCode)) &&
      !colors.has(normalize(item.color)) && !brands.has(normalize(item.brand)) &&
      item.variants.some((variant) => variant.inStock && (!size || normalize(variant.size) === size)) &&
      (item.delivery === "Pakistan" || Boolean(request.city && item.delivery.some((city) => normalize(city) === normalize(request.city)))) &&
      item.price <= request.budget;
  });

  const shoes = eligible.filter((item) => item.slot === "footwear");
  const lowers = eligible.filter((item) => item.slot === "lower");
  const clothing = eligible.filter((item) => item.slot === "set").map((item) => [item]);
  for (const upper of eligible.filter((item) => item.slot === "upper")) {
    for (const lower of lowers) clothing.push([upper, lower]);
  }

  const looks: Array<MatchedLook & { score: number }> = [];
  for (const garments of clothing) {
    for (const shoe of shoes) {
      const items = [...garments, shoe];
      const subtotal = items.reduce((total, item) => total + item.price, 0);
      if (subtotal > request.budget) continue;
      const compatibleColors = items.filter((item) => neutralColors.has(normalize(item.color))).length;
      const categoryCoherence = items.every((item) => item.category === shoe.category) ? 1 : 0;
      const formalOccasion = ["wedding", "business-meeting"].includes(request.occasion);
      const occasionMatches = items.filter((item) => item.dressCodes.includes(formalOccasion ? "Formal" : "Casual")).length;
      const paletteMatches = items.filter((item) => palette.has(normalize(item.color))).length;
      const shopperMatches = items.reduce((count, item) =>
        count + Number(preferredColors.has(normalize(item.color))) + Number(preferredBrands.has(normalize(item.brand))), 0);
      looks.push({
        id: items.map(({ id }) => id).join("+"), items, subtotal,
        score: (compatibleColors + occasionMatches + paletteMatches * 0.5 + shopperMatches) / items.length + categoryCoherence * 0.25,
      });
    }
  }

  looks.sort((a, b) => b.score - a.score || a.subtotal - b.subtotal || a.id.localeCompare(b.id));
  const distinct = new Set<string>();
  const selected: MatchedLook[] = [];
  for (const { id, items, subtotal } of looks) {
    const garments = items.filter((item) => item.slot !== "footwear").map((item) => item.id).join("+");
    if (distinct.has(garments)) continue;
    distinct.add(garments);
    selected.push({ id, items, subtotal });
    if (selected.length === 3) break;
  }
  return { looks: selected, eligible, options: looks };
}
