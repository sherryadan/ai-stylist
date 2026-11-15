import { cookies } from "next/headers";
import { z } from "zod";
import { passwordDatabase, shopperAccessCookie } from "./password-account";
import { supabaseClient, supabaseConfig } from "./supabase-auth";
import type { LocalProfile } from "./local-account";
import type { StylingRequest } from "./styling-request";
import type { MatchedLook } from "@/services/menswear-matching";

const uuid = z.uuid();

function checked<T>(result: { data: T; error: unknown }) {
  if (result.error) throw new Error("Shopper storage request failed");
  return result.data;
}

export async function supabaseShopper(owner: string) {
  const config = supabaseConfig();
  const token = (await cookies()).get(shopperAccessCookie)?.value;
  const identity = passwordDatabase().prepare("SELECT identity_subject FROM demo_account WHERE id = ?").get(owner)?.identity_subject;
  if (!config || !token || typeof identity !== "string") throw new Error("Shopper session expired");
  const userId = identity.slice(`supabase:${config.url}:`.length);
  const db = supabaseClient(config.url, config.key, token);
  const requests = () => db.from("stylist_requests").select("id,payload,created_at").eq("user_id", userId);
  const looks = () => db.from("stylist_saved_looks");
  const ratings = () => db.from("stylist_ratings");
  return {
    async profile() {
      const row = checked(await db.from("stylist_profiles").select("payload").eq("user_id", userId).maybeSingle());
      return row?.payload as LocalProfile | undefined;
    },
    async saveProfile(payload: LocalProfile) {
      checked(await db.from("stylist_profiles").upsert({ user_id: userId, payload, updated_at: new Date().toISOString() }));
      return true;
    },
    async request(id: string) {
      if (!uuid.safeParse(id).success) return;
      const row = checked(await requests().eq("id", id).maybeSingle());
      return row?.payload as StylingRequest | undefined;
    },
    async saveRequest(request: StylingRequest) {
      return checked(await db.rpc("stylist_save_request", { request_id: request.id, request_payload: request })) ? "saved" : "quota";
    },
    async history(before?: string) {
      const cursor = uuid.safeParse(before).success ? checked(await requests().eq("id", before).maybeSingle()) : undefined;
      const page = requests().order("created_at", { ascending: false }).order("id", { ascending: false }).limit(21);
      if (cursor) page.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
      return (checked(await page) ?? []).map((row) => ({
        request: row.payload as StylingRequest, createdAt: Date.parse(row.created_at),
      }));
    },
    async summary() {
      const count = (table: string) => db.from(table).select("user_id", { count: "exact", head: true }).eq("user_id", userId);
      const [requestCount, saved, feedback, latest] = await Promise.all([
        count("stylist_requests"), count("stylist_saved_looks"), count("stylist_ratings"),
        requests().order("created_at", { ascending: false }).order("id", { ascending: false }).limit(5),
      ]);
      for (const result of [requestCount, saved, feedback]) checked(result);
      return { requests: requestCount.count ?? 0, saved: saved.count ?? 0, feedback: feedback.count ?? 0,
        recent: (checked(latest) ?? []).map((row) => row.payload as StylingRequest) };
    },
    async saveLook(requestId: string, look: MatchedLook) {
      checked(await looks().upsert({ user_id: userId, request_id: requestId, look_id: look.id, payload: look },
        { onConflict: "user_id,request_id,look_id", ignoreDuplicates: true }));
      return true;
    },
    async listLooks(offset: number) {
      const rows = checked(await looks().select("request_id,payload").eq("user_id", userId)
        .order("saved_at", { ascending: false }).order("request_id").order("look_id").range(offset, offset + 20));
      return (rows ?? []).map((row) => ({ requestId: row.request_id as string, look: row.payload as MatchedLook }));
    },
    async removeLook(requestId: string, lookId: string) {
      checked(await looks().delete().eq("user_id", userId).eq("request_id", requestId).eq("look_id", lookId));
      return true;
    },
    async rate(requestId: string, lookId: string, rating: "like" | "dislike") {
      checked(await ratings().upsert({ user_id: userId, request_id: requestId, look_id: lookId, rating }));
      return true;
    },
    async feedback(requestId: string): Promise<Record<string, string>> {
      const rows = checked(await ratings().select("look_id,rating").eq("user_id", userId).eq("request_id", requestId));
      return Object.fromEntries((rows ?? []).map((row) => [row.look_id, row.rating]));
    },
  };
}
