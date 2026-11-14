"use server";

import { revalidatePath } from "next/cache";
import { canAdministerLocalCatalog, importLocalCatalog } from "@/lib/local-account";
import { parseSampleCsv } from "@/services/sample-collection-import";

export type ImportState = { message: string; errors: string[]; names: string[]; csv: string };

export async function reviewCatalogImport(_: ImportState, form: FormData): Promise<ImportState> {
  const token = form.get("token");
  const csv = form.get("csv");
  const intent = form.get("intent");
  if (typeof token !== "string" || typeof csv !== "string" || !(await canAdministerLocalCatalog(token))) {
    return { message: "Enter the local catalog administrator token.", errors: [], names: [], csv: typeof csv === "string" ? csv.slice(0, 40_000) : "" };
  }
  const { items, errors } = parseSampleCsv(csv);
  const names = items.map(({ name }) => name);
  if (errors.length) return { message: "Correct the listed errors. No rows were imported.", errors, names, csv: csv.slice(0, 40_000) };
  if (intent === "preview") return { message: `${items.length} rows passed validation.`, errors, names, csv };
  if (intent !== "import") return { message: "Choose preview or import.", errors, names, csv };
  const result = await importLocalCatalog(token, items);
  if (result === "limit") return { message: "The local catalog supports up to 100 imported sample SKUs.", errors, names, csv };
  if (result !== "saved") return { message: "Admin access expired. Sign in and try again.", errors, names, csv };
  revalidatePath("/sample-catalog");
  return { message: `${items.length} sample rows imported.`, errors, names, csv: "" };
}
