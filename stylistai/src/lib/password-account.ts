import { createHash, randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { cookies } from "next/headers";
import { supabaseConfig } from "./supabase-auth";

export const passwordSessionCookie = "stylist-password-session";
const tokenDigest = (token: string) => createHash("sha256").update(token).digest("hex");
let database: DatabaseSync | undefined;

export function passwordDatabase() {
  const config = supabaseConfig();
  if (!config) throw new Error("Email accounts are not configured");
  if (database) return database;
  const connection = new DatabaseSync(config.databaseFile);
  try {
    connection.exec("PRAGMA busy_timeout = 5000; BEGIN IMMEDIATE");
    if (!connection.prepare("SELECT 1 FROM sqlite_schema WHERE name = 'demo_account'").get()) {
      connection.exec(readFileSync(join(process.cwd(), "migrations", "hosted", "0001_private_demo.sql"), "utf8"));
    }
    if (!connection.prepare("SELECT 1 FROM pragma_table_info('demo_account') WHERE name = 'identity_subject'").get()) {
      connection.exec("ALTER TABLE demo_account RENAME COLUMN google_subject TO identity_subject");
    }
    connection.exec("COMMIT");
  } catch (error) {
    connection.close();
    throw error;
  }
  database = connection;
  return connection;
}

export async function issuePasswordSession(identity: string, lifetime: number, createAccount: boolean) {
  const db = passwordDatabase();
  const jar = await cookies();
  const previous = jar.get(passwordSessionCookie)?.value;
  const now = Date.now();
  if (!Number.isFinite(lifetime) || lifetime < 1) return false;
  if (createAccount) db.prepare(`
    INSERT INTO demo_account (id, identity_subject, created_at) VALUES (?, ?, ?)
    ON CONFLICT(identity_subject) DO NOTHING
  `).run(randomUUID(), identity, now);
  const account = db.prepare("SELECT id FROM demo_account WHERE identity_subject = ?").get(identity);
  if (typeof account?.id !== "string") return false;
  const token = randomBytes(32).toString("base64url");
  const maxAge = Math.min(8 * 60 * 60, Math.floor(lifetime));
  db.prepare("INSERT INTO demo_session VALUES (?, ?, ?)").run(tokenDigest(token), account.id, now + maxAge * 1000);
  db.prepare("DELETE FROM demo_session WHERE expires_at <= ? OR token_digest = ?").run(now, previous ? tokenDigest(previous) : "");
  jar.set(passwordSessionCookie, token, { httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge });
  return true;
}

export async function passwordAccountId() {
  const token = (await cookies()).get(passwordSessionCookie)?.value;
  const config = supabaseConfig();
  if (!token || !/^[\w-]{43}$/.test(token) || !config) return;
  const row = passwordDatabase().prepare(`
    SELECT account_id FROM demo_session JOIN demo_account ON demo_account.id = account_id
    WHERE token_digest = ? AND expires_at > ? AND instr(identity_subject, ?) = 1
  `).get(tokenDigest(token), Date.now(), `supabase:${config.url}:`);
  return typeof row?.account_id === "string" ? row.account_id : undefined;
}

export async function revokePasswordSession() {
  const jar = await cookies();
  const token = jar.get(passwordSessionCookie)?.value;
  if (token && supabaseConfig()) passwordDatabase().prepare("DELETE FROM demo_session WHERE token_digest = ?").run(tokenDigest(token));
  if (token) jar.delete(passwordSessionCookie);
}
