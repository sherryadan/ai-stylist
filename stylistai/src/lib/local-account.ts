import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { cookies } from "next/headers";
import type { StylingRequest } from "./styling-request";
import type { MatchedLook } from "@/services/menswear-matching";
import type { CatalogItem } from "@/data/sample-menswear";
import type { StylingBlueprint } from "@/services/styling-blueprint";

const cookieName = "stylist-local-session";
const sessionSeconds = 8 * 60 * 60;
let database: DatabaseSync | undefined;

export function localAccountEnabled() {
  return process.env.NODE_ENV === "development" && process.env.STYLIST_LOCAL_ACCOUNT === "1";
}

function accountDatabase() {
  if (!localAccountEnabled()) throw new Error("Local accounts are disabled.");
  if (!database) {
    const connection = new DatabaseSync(process.env.STYLIST_LOCAL_DB_FILE || ".stylist-local.sqlite");
    connection.exec(`
      CREATE TABLE IF NOT EXISTS local_session (
        token_hash TEXT PRIMARY KEY,
        expires_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS local_profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        name TEXT NOT NULL,
        birth_date TEXT NOT NULL,
        preference TEXT NOT NULL,
        timezone TEXT NOT NULL,
        city TEXT NOT NULL,
        gender TEXT NOT NULL,
        clothing_size TEXT NOT NULL,
        shoe_size TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS local_measurement (
        profile_id INTEGER PRIMARY KEY REFERENCES local_profile(id) ON DELETE CASCADE,
        height_cm REAL CHECK (height_cm BETWEEN 50 AND 260),
        weight_kg REAL CHECK (weight_kg BETWEEN 20 AND 400),
        preferred_fit TEXT NOT NULL CHECK (preferred_fit IN ('', 'Fitted', 'Regular', 'Relaxed'))
      );
      CREATE TABLE IF NOT EXISTS styling_request (
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS request_blueprint (
        request_id TEXT PRIMARY KEY REFERENCES styling_request(id) ON DELETE CASCADE,
        payload TEXT
      );
      CREATE TABLE IF NOT EXISTS saved_look (
        request_id TEXT NOT NULL REFERENCES styling_request(id) ON DELETE CASCADE,
        look_id TEXT NOT NULL,
        payload TEXT NOT NULL,
        saved_at INTEGER NOT NULL,
        PRIMARY KEY (request_id, look_id)
      );
      CREATE TABLE IF NOT EXISTS look_feedback (
        request_id TEXT NOT NULL REFERENCES styling_request(id) ON DELETE CASCADE,
        look_id TEXT NOT NULL,
        rating TEXT NOT NULL CHECK (rating IN ('like', 'dislike')),
        PRIMARY KEY (request_id, look_id)
      );
      CREATE TABLE IF NOT EXISTS local_catalog_item (
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS local_catalog_import (
        id INTEGER PRIMARY KEY,
        row_count INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
    database = connection;
  }
  return database;
}

function digest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function currentLocalAccount() {
  if (!localAccountEnabled()) return false;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;
  return Boolean(accountDatabase().prepare(
    "SELECT 1 FROM local_session WHERE token_hash = ? AND expires_at > ?",
  ).get(digest(token), Date.now()));
}

export async function startLocalSession() {
  const db = accountDatabase();
  const jar = await cookies();
  const previous = jar.get(cookieName)?.value;
  if (previous) db.prepare("DELETE FROM local_session WHERE token_hash = ?").run(digest(previous));
  db.prepare("DELETE FROM local_session WHERE expires_at <= ?").run(Date.now());
  const token = randomBytes(32).toString("hex");
  db.prepare("INSERT INTO local_session VALUES (?, ?)").run(digest(token), Date.now() + sessionSeconds * 1000);
  jar.set(cookieName, token, { httpOnly: true, sameSite: "strict", path: "/", maxAge: sessionSeconds });
}

export async function endLocalSession() {
  if (!localAccountEnabled()) return;
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) accountDatabase().prepare("DELETE FROM local_session WHERE token_hash = ?").run(digest(token));
  jar.delete(cookieName);
}

export async function deleteLocalAccount() {
  if (!(await currentLocalAccount())) return false;
  const db = accountDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.exec("DELETE FROM styling_request; DELETE FROM local_profile; DELETE FROM local_session;");
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  (await cookies()).delete(cookieName);
  return true;
}

export type LocalProfile = {
  name: string;
  birth_date: string;
  preference: string;
  timezone: string;
  city: string;
  gender: string;
  clothing_size: string;
  shoe_size: string;
  height_cm: number | null;
  weight_kg: number | null;
  preferred_fit: string;
};

export async function readLocalProfile() {
  if (!(await currentLocalAccount())) return undefined;
  const profile = accountDatabase().prepare(`
    SELECT name, birth_date, preference, timezone, city, gender, clothing_size, shoe_size,
           height_cm, weight_kg, coalesce(preferred_fit, '') AS preferred_fit
    FROM local_profile LEFT JOIN local_measurement ON local_measurement.profile_id = local_profile.id
    WHERE local_profile.id = 1
  `)
    .get() as LocalProfile | undefined;
  return profile && { ...profile };
}

export async function writeLocalProfile(profile: LocalProfile) {
  if (!(await currentLocalAccount())) return false;
  const db = accountDatabase();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(`
      INSERT INTO local_profile VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET name = excluded.name, birth_date = excluded.birth_date,
        preference = excluded.preference, timezone = excluded.timezone, city = excluded.city,
        gender = excluded.gender, clothing_size = excluded.clothing_size, shoe_size = excluded.shoe_size
    `).run(profile.name, profile.birth_date, profile.preference, profile.timezone,
      profile.city, profile.gender, profile.clothing_size, profile.shoe_size);
    db.prepare(`
      INSERT INTO local_measurement (profile_id, height_cm, weight_kg, preferred_fit) VALUES (1, ?, ?, ?)
      ON CONFLICT(profile_id) DO UPDATE SET height_cm = excluded.height_cm,
        weight_kg = excluded.weight_kg, preferred_fit = excluded.preferred_fit
    `).run(profile.height_cm, profile.weight_kg, profile.preferred_fit);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return true;
}

export async function saveLocalStylingRequest(request: StylingRequest) {
  if (!(await currentLocalAccount())) return "signed-out";
  const db = accountDatabase();
  if (db.prepare("SELECT 1 FROM styling_request WHERE id = ?").get(request.id)) return "saved";
  const now = Date.now();
  const result = db.prepare(`
    INSERT INTO styling_request (id, payload, created_at)
    SELECT ?, ?, ?
    WHERE (SELECT count(*) FROM styling_request WHERE created_at > ?) < 30
    ON CONFLICT(id) DO NOTHING
  `).run(request.id, JSON.stringify(request), now, now - 86_400_000);
  return result.changes ? "saved" : "quota";
}

export async function readLocalStylingRequest(id: string): Promise<StylingRequest | undefined> {
  if (!(await currentLocalAccount())) return;
  const stored = accountDatabase().prepare("SELECT payload FROM styling_request WHERE id = ?")
    .get(id) as { payload: string } | undefined;
  return stored && JSON.parse(stored.payload);
}

export async function claimBlueprintRequest(id: string) {
  if (!(await currentLocalAccount())) return false;
  return Boolean(accountDatabase().prepare(`
    INSERT INTO request_blueprint (request_id)
    SELECT id FROM styling_request WHERE id = ?
    ON CONFLICT(request_id) DO NOTHING
  `).run(id).changes);
}

export async function storeBlueprint(id: string, blueprint: StylingBlueprint) {
  if (!(await currentLocalAccount())) return;
  accountDatabase().prepare("UPDATE request_blueprint SET payload = ? WHERE request_id = ?")
    .run(JSON.stringify(blueprint), id);
}

export async function readBlueprint(id: string): Promise<StylingBlueprint | undefined> {
  if (!(await currentLocalAccount())) return;
  const row = accountDatabase().prepare("SELECT payload FROM request_blueprint WHERE request_id = ?").get(id);
  return typeof row?.payload === "string" ? JSON.parse(row.payload) : undefined;
}

export async function listLocalStylingRequests(before?: string) {
  if (!(await currentLocalAccount())) return [];
  const db = accountDatabase();
  const cursor = before && db.prepare("SELECT id, created_at FROM styling_request WHERE id = ?").get(before);
  const rows = cursor
    ? db.prepare("SELECT payload, created_at FROM styling_request WHERE (created_at, id) < (?, ?) ORDER BY created_at DESC, id DESC LIMIT 21")
      .all(cursor.created_at, cursor.id)
    : db.prepare("SELECT payload, created_at FROM styling_request ORDER BY created_at DESC, id DESC LIMIT 21").all();
  return rows.map((row) => ({
    request: JSON.parse(String(row.payload)) as StylingRequest,
    createdAt: Number(row.created_at),
  }));
}

export async function localDashboardSummary() {
  if (!(await currentLocalAccount())) return;
  const db = accountDatabase();
  const counts = db.prepare(`
    SELECT (SELECT count(*) FROM styling_request) AS requests,
           (SELECT count(*) FROM saved_look) AS saved,
           (SELECT count(*) FROM look_feedback) AS feedback
  `).get();
  const recent = db.prepare("SELECT payload FROM styling_request ORDER BY created_at DESC, id DESC LIMIT 5").all();
  return {
    requests: Number(counts?.requests ?? 0),
    saved: Number(counts?.saved ?? 0),
    feedback: Number(counts?.feedback ?? 0),
    recent: recent.map((row) => JSON.parse(String(row.payload)) as StylingRequest),
  };
}

export async function saveLocalLook(requestId: string, look: MatchedLook) {
  if (!(await currentLocalAccount())) return false;
  accountDatabase().prepare(`
    INSERT INTO saved_look (request_id, look_id, payload, saved_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(request_id, look_id) DO NOTHING
  `).run(requestId, look.id, JSON.stringify(look), Date.now());
  return true;
}

export async function listLocalLooks(offset: number) {
  if (!(await currentLocalAccount())) return [];
  return accountDatabase().prepare("SELECT request_id, payload FROM saved_look ORDER BY saved_at DESC, request_id, look_id LIMIT 21 OFFSET ?")
    .all(offset)
    .map((row) => ({ requestId: String(row.request_id), look: JSON.parse(String(row.payload)) as MatchedLook }));
}

export async function removeLocalLook(requestId: string, lookId: string) {
  if (!(await currentLocalAccount())) return false;
  accountDatabase().prepare("DELETE FROM saved_look WHERE request_id = ? AND look_id = ?").run(requestId, lookId);
  return true;
}

export async function writeLocalLookFeedback(requestId: string, lookId: string, rating: "like" | "dislike") {
  if (!(await currentLocalAccount())) return false;
  accountDatabase().prepare(`
    INSERT INTO look_feedback (request_id, look_id, rating) VALUES (?, ?, ?)
    ON CONFLICT(request_id, look_id) DO UPDATE SET rating = excluded.rating
  `).run(requestId, lookId, rating);
  return true;
}

export async function readLocalLookFeedback(requestId: string): Promise<Record<string, string>> {
  if (!(await currentLocalAccount())) return {};
  const rows = accountDatabase().prepare("SELECT look_id, rating FROM look_feedback WHERE request_id = ?").all(requestId);
  return Object.fromEntries(rows.map((row) => [String(row.look_id), String(row.rating)]));
}

export async function canAdministerLocalCatalog(token: string) {
  const secret = process.env.STYLIST_LOCAL_ADMIN_TOKEN;
  if (!secret || secret.length < 24 || token.length > 256 || !(await currentLocalAccount())) return false;
  return timingSafeEqual(Buffer.from(digest(token)), Buffer.from(digest(secret)));
}

export async function importLocalCatalog(token: string, items: CatalogItem[]) {
  if (!(await canAdministerLocalCatalog(token))) return "denied";
  const db = accountDatabase();
  const now = Date.now();
  db.exec("BEGIN IMMEDIATE");
  try {
    const unique = new Set(db.prepare("SELECT id FROM local_catalog_item").all().map(({ id }) => id));
    for (const item of items) unique.add(item.id);
    if (unique.size > 100) {
      db.exec("ROLLBACK");
      return "limit";
    }
    const upsert = db.prepare(`
      INSERT INTO local_catalog_item VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
    `);
    for (const item of items) upsert.run(item.id, JSON.stringify(item), now);
    db.prepare("INSERT INTO local_catalog_import (row_count, created_at) VALUES (?, ?)").run(items.length, now);
    db.exec("COMMIT");
    return "saved";
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function listImportedSamples(): CatalogItem[] {
  if (!localAccountEnabled()) return [];
  return accountDatabase().prepare("SELECT payload FROM local_catalog_item ORDER BY id").all()
    .map((row) => JSON.parse(String(row.payload)) as CatalogItem);
}

export async function localCatalogOverview(token: string) {
  if (!(await canAdministerLocalCatalog(token))) return;
  const db = accountDatabase();
  const imported = listImportedSamples();
  const counts = db.prepare(`
    SELECT (SELECT count(*) FROM styling_request) AS requests,
           (SELECT count(*) FROM look_feedback WHERE rating = 'like') AS likes,
           (SELECT count(*) FROM look_feedback WHERE rating = 'dislike') AS dislikes,
           (SELECT count(*) FROM request_blueprint) AS blueprint_attempts,
           (SELECT count(*) FROM request_blueprint WHERE payload IS NOT NULL) AS blueprint_successes
  `).get();
  const imports = db.prepare("SELECT id, row_count, created_at FROM local_catalog_import ORDER BY created_at DESC, id DESC LIMIT 10").all();
  return {
    imported: imported.length,
    available: imported.filter((item) => item.variants.some(({ inStock }) => inStock)).length,
    requests: Number(counts?.requests ?? 0),
    likes: Number(counts?.likes ?? 0),
    dislikes: Number(counts?.dislikes ?? 0),
    attempts: Number(counts?.blueprint_attempts ?? 0),
    successes: Number(counts?.blueprint_successes ?? 0),
    imports: imports.map((row) => ({ id: Number(row.id), rows: Number(row.row_count), createdAt: Number(row.created_at) })),
  };
}
