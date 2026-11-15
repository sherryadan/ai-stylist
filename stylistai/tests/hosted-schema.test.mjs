import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";

test("hosted records require valid owners and account deletion cascades only to that account", () => {
  using db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../migrations/hosted/0001_private_demo.sql", import.meta.url), "utf8"));
  db.exec(`
    INSERT INTO demo_account VALUES ('a', 'google-a', 1), ('b', 'google-b', 1);
    INSERT INTO demo_session VALUES ('digest-a', 'a', 100), ('digest-b', 'b', 100);
    INSERT INTO demo_profile VALUES ('a', '{}', 1), ('b', '{}', 1);
    INSERT INTO demo_styling_request VALUES ('a', 'request-a', '{}', 1), ('b', 'request-b', '{}', 1);
  `);
  assert.throws(() => db.exec("INSERT INTO demo_saved_look VALUES ('b', 'request-a', 'look', '{}', 1)"), /FOREIGN KEY/);
  assert.throws(() => db.exec("INSERT INTO demo_rating VALUES ('a', 'request-b', 'look', 'like')"), /FOREIGN KEY/);
  assert.throws(() => db.exec("INSERT INTO demo_account VALUES ('c', 'google-a', 1)"), /UNIQUE/);
  for (const owner of ["a", "b"]) {
    db.prepare("INSERT INTO demo_saved_look VALUES (?, ?, 'look', '{}', 1)").run(owner, `request-${owner}`);
    db.prepare("INSERT INTO demo_rating VALUES (?, ?, 'look', 'like')").run(owner, `request-${owner}`);
  }
  db.exec("DELETE FROM demo_account WHERE id = 'a'");
  for (const table of ["demo_session", "demo_profile", "demo_styling_request", "demo_saved_look", "demo_rating"]) {
    assert.deepEqual(db.prepare(`SELECT account_id FROM ${table}`).all().map((row) => row.account_id), ["b"]);
  }
});
