import { createHash, randomBytes } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { cookies } from "next/headers";

const cookieName = "stylist-local-session";
const sessionSeconds = 8 * 60 * 60;
let database: DatabaseSync | undefined;

export function localAccountEnabled() {
  return process.env.NODE_ENV === "development" && process.env.STYLIST_LOCAL_ACCOUNT === "1";
}

function accountDatabase() {
  if (!localAccountEnabled()) throw new Error("Local accounts are disabled.");
  if (!database) {
    const connection = new DatabaseSync(".stylist-local.sqlite");
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

export type LocalProfile = {
  name: string;
  birth_date: string;
  preference: string;
  timezone: string;
  city: string;
  gender: string;
  clothing_size: string;
  shoe_size: string;
};

export async function readLocalProfile() {
  if (!(await currentLocalAccount())) return undefined;
  const profile = accountDatabase().prepare("SELECT name, birth_date, preference, timezone, city, gender, clothing_size, shoe_size FROM local_profile WHERE id = 1")
    .get() as LocalProfile | undefined;
  return profile && { ...profile };
}

export async function writeLocalProfile(profile: LocalProfile) {
  if (!(await currentLocalAccount())) return false;
  accountDatabase().prepare(`
    INSERT INTO local_profile VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name = excluded.name, birth_date = excluded.birth_date,
      preference = excluded.preference, timezone = excluded.timezone, city = excluded.city,
      gender = excluded.gender, clothing_size = excluded.clothing_size, shoe_size = excluded.shoe_size
  `).run(profile.name, profile.birth_date, profile.preference, profile.timezone,
    profile.city, profile.gender, profile.clothing_size, profile.shoe_size);
  return true;
}
