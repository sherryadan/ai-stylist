import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { cookies } from "next/headers";
import { googleConfig, randomToken, tokenDigest } from "./google-identity";

export const googleSessionCookie = "stylist-google-session";
export const googleSessionSeconds = 8 * 60 * 60;
let database: DatabaseSync | undefined;

export function googleDatabase() {
  const config = googleConfig();
  if (!config) throw new Error("Google accounts are not configured");
  if (database) return database;
  const connection = new DatabaseSync(config.databaseFile);
  try {
    connection.exec("PRAGMA busy_timeout = 5000; BEGIN IMMEDIATE");
    if (!connection.prepare("SELECT 1 FROM sqlite_schema WHERE name = 'demo_account'").get()) {
      connection.exec(readFileSync(join(process.cwd(), "migrations", "hosted", "0001_private_demo.sql"), "utf8"));
    }
    connection.exec("COMMIT");
  } catch (error) {
    connection.close();
    throw error;
  }
  database = connection;
  return connection;
}

export function issueGoogleSession(subject: string, previous?: string) {
  const db = googleDatabase();
  const now = Date.now();
  const { id } = db.prepare(`
    INSERT INTO demo_account (id, google_subject, created_at) VALUES (?, ?, ?)
    ON CONFLICT(google_subject) DO UPDATE SET google_subject = excluded.google_subject
    RETURNING id
  `).get(randomUUID(), subject, now) as { id: string };
  const token = randomToken();
  db.prepare("INSERT INTO demo_session VALUES (?, ?, ?)").run(tokenDigest(token), id, now + googleSessionSeconds * 1000);
  db.prepare("DELETE FROM demo_session WHERE expires_at <= ? OR token_digest = ?").run(now, previous ? tokenDigest(previous) : "");
  return token;
}

export async function googleAccountId() {
  const token = (await cookies()).get(googleSessionCookie)?.value;
  if (!token || !/^[\w-]{43}$/.test(token) || !googleConfig()) return;
  const row = googleDatabase().prepare("SELECT account_id FROM demo_session WHERE token_digest = ? AND expires_at > ?")
    .get(tokenDigest(token), Date.now());
  return typeof row?.account_id === "string" ? row.account_id : undefined;
}

export async function revokeGoogleSession() {
  const jar = await cookies();
  const token = jar.get(googleSessionCookie)?.value;
  if (token && googleConfig()) googleDatabase().prepare("DELETE FROM demo_session WHERE token_digest = ?").run(tokenDigest(token));
  if (token) jar.delete(googleSessionCookie);
}
