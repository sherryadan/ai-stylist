"use server";

import { localCatalogOverview } from "@/lib/local-account";

export type OverviewState = {
  error: string;
  data?: Awaited<ReturnType<typeof localCatalogOverview>>;
};

export async function viewCatalogOverview(_: OverviewState, form: FormData): Promise<OverviewState> {
  const token = form.get("token");
  const data = typeof token === "string" ? await localCatalogOverview(token) : undefined;
  return data ? { error: "", data } : { error: "Enter the local catalog administrator token." };
}
