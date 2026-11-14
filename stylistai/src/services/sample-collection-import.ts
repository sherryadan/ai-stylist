import { z } from "zod";
import type { CatalogItem } from "../data/sample-menswear";

export const csvHeader = "sku,name,brand,category,slot,price,color,swatch,dress_codes,in_stock_sizes,delivery";
const labels = csvHeader.split(",");
const rowSchema = z.object({
  sku: z.string().regex(/^[a-z0-9-]{1,36}$/),
  name: z.string().min(1).max(80),
  brand: z.string().min(1).max(80),
  category: z.enum(["Eastern", "Western"]),
  slot: z.enum(["upper", "lower", "set", "footwear"]),
  price: z.string().regex(/^[1-9][0-9]{0,7}$/).transform(Number),
  color: z.string().min(1).max(30),
  swatch: z.string().regex(/^#[\da-fA-F]{6}$/),
  dress_codes: z.string().transform((value) => value.split("|").map((part) => part.trim()))
    .pipe(z.array(z.enum(["Casual", "Smart casual", "Formal"])).min(1).max(3)),
  in_stock_sizes: z.string().transform((value) => value.split("|").map((part) => part.trim()).filter(Boolean))
    .pipe(z.array(z.string().min(1).max(30)).max(30)),
  delivery: z.string().min(1).max(100),
});

function splitRow(line: string) {
  const cells: string[] = [];
  const field = /(?:"((?:[^"]|"")*)"|([^",]*))(,|$)/gy;
  let offset = 0;
  do {
    const match = field.exec(line);
    if (!match) return;
    cells.push((match[1]?.replaceAll('""', '"') ?? match[2]).trim());
    offset = field.lastIndex;
    if (!match[3]) return cells;
  } while (offset <= line.length);
}

export function parseSampleCsv(text: string) {
  const items: CatalogItem[] = [];
  const errors: string[] = [];
  if (text.length > 40_000) return { items, errors: ["CSV text must be 40,000 characters or smaller."] };
  const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  if (lines.shift() !== csvHeader) return { items, errors: ["Use the exact header shown in the template."] };
  if (lines.length > 100) return { items, errors: ["Import up to 100 data rows at a time."] };

  const known = new Set<string>();
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    const cells = splitRow(line);
    if (!cells || cells.length !== labels.length) {
      errors.push(`Line ${index + 2}: expected ${labels.length} single-line CSV fields.`);
      return;
    }
    const parsed = rowSchema.safeParse(Object.fromEntries(labels.map((label, cell) => [label, cells[cell]])));
    if (!parsed.success) {
      errors.push(`Line ${index + 2}: check ${parsed.error.issues.map((issue) => issue.path[0]).join(", ")}.`);
      return;
    }
    const row = parsed.data;
    if (known.has(row.sku)) {
      errors.push(`Line ${index + 2}: duplicate SKU ${row.sku}.`);
      return;
    }
    known.add(row.sku);
    items.push({
      id: `import-${row.sku}`, name: row.name, brand: row.brand, category: row.category, slot: row.slot,
      price: row.price, currency: "PKR", color: row.color, swatch: row.swatch, dressCodes: row.dress_codes,
      variants: [...new Set(row.in_stock_sizes)].map((size) => ({ size, inStock: true })),
      delivery: row.delivery === "Pakistan" ? "Pakistan" : row.delivery.split("|").map((part) => part.trim()).filter(Boolean),
      sample: true,
    });
  });
  if (!items.length && !errors.length) errors.push("Add at least one item.");
  return { items, errors };
}
