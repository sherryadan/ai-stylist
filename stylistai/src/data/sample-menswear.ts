export type WearCategory = "Eastern" | "Western";
export type DressCode = "Casual" | "Smart casual" | "Formal";
export type GarmentSlot = "upper" | "lower" | "set" | "footwear";

export interface CatalogItem {
  id: string;
  name: string;
  brand: string;
  category: WearCategory;
  slot: GarmentSlot;
  price: number;
  currency: "PKR";
  color: string;
  swatch: string;
  dressCodes: readonly DressCode[];
  variants: readonly { size: string; inStock: boolean }[];
  delivery: "Pakistan" | readonly string[];
  sample: true;
}

const sizes = (values: string[]) => values.map((size) => ({ size, inStock: true }));
const apparel = sizes(["S", "M", "L", "XL"]);
const footwear = sizes(["EU 40", "EU 41", "EU 42", "EU 43", "EU 44"]);

type SampleFields = Pick<CatalogItem, "id" | "name" | "category" | "slot" | "price" | "color" | "swatch" | "dressCodes">;

function sample(item: SampleFields): CatalogItem {
  return {
    ...item,
    brand: "StylistAI Sample",
    currency: "PKR",
    variants: item.slot === "footwear" ? footwear : apparel,
    delivery: "Pakistan",
    sample: true,
  };
}

export const sampleMenswear = [
  sample({ id: "ivory-kurta-set", name: "Ivory kurta and trousers", category: "Eastern", slot: "set", price: 5600, color: "Ivory", swatch: "#e3d5b9", dressCodes: ["Smart casual", "Formal"] }),
  sample({ id: "olive-kurta", name: "Olive cotton kurta", category: "Eastern", slot: "upper", price: 3300, color: "Olive", swatch: "#646349", dressCodes: ["Casual", "Smart casual"] }),
  sample({ id: "charcoal-kurta-set", name: "Charcoal kurta and trousers", category: "Eastern", slot: "set", price: 6900, color: "Charcoal", swatch: "#48484b", dressCodes: ["Smart casual", "Formal"] }),
  sample({ id: "cream-shalwar", name: "Cream cotton shalwar", category: "Eastern", slot: "lower", price: 2200, color: "Cream", swatch: "#d9cbb2", dressCodes: ["Casual", "Smart casual"] }),
  sample({ id: "tan-peshawari", name: "Tan Peshawari chappal", category: "Eastern", slot: "footwear", price: 4300, color: "Tan", swatch: "#9b6f4d", dressCodes: ["Casual", "Smart casual", "Formal"] }),
  sample({ id: "black-khussa", name: "Black embroidered khussa", category: "Eastern", slot: "footwear", price: 3800, color: "Black", swatch: "#302e30", dressCodes: ["Smart casual", "Formal"] }),
  sample({ id: "blue-oxford", name: "Blue Oxford shirt", category: "Western", slot: "upper", price: 3500, color: "Blue", swatch: "#8bacc1", dressCodes: ["Casual", "Smart casual"] }),
  sample({ id: "white-shirt", name: "White poplin shirt", category: "Western", slot: "upper", price: 4100, color: "White", swatch: "#efece0", dressCodes: ["Smart casual", "Formal"] }),
  sample({ id: "sand-chinos", name: "Sand straight-leg chinos", category: "Western", slot: "lower", price: 4200, color: "Sand", swatch: "#c2aa81", dressCodes: ["Casual", "Smart casual"] }),
  sample({ id: "navy-trousers", name: "Navy tailored trousers", category: "Western", slot: "lower", price: 5300, color: "Navy", swatch: "#303a51", dressCodes: ["Smart casual", "Formal"] }),
  sample({ id: "white-sneakers", name: "White canvas sneakers", category: "Western", slot: "footwear", price: 4500, color: "White", swatch: "#ece7dd", dressCodes: ["Casual"] }),
  sample({ id: "brown-loafers", name: "Brown penny loafers", category: "Western", slot: "footwear", price: 6100, color: "Brown", swatch: "#61473d", dressCodes: ["Smart casual", "Formal"] }),
] as const;
