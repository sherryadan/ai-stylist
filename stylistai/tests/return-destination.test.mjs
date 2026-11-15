import assert from "node:assert/strict";
import { test } from "node:test";
import { profileHandoff, returnDestination } from "../src/lib/return-destination.ts";

test("keeps a selected styling request through authentication", () => {
  const path = "/styling-requests?category=Western&occasion=wedding";
  assert.equal(returnDestination(path), path);
  assert.equal(new URL(profileHandoff("/login", path), "https://stylist.invalid").searchParams.get("next"), path);
  assert.equal(returnDestination("/styling-requests/11111111-1111-4111-8111-111111111111"), "/styling-requests/11111111-1111-4111-8111-111111111111");
});

test("rejects external and unrelated destinations", () => {
  for (const value of ["https://example.com", "//example.com", "/\\example.com", "/login", "/catalog-admin", null, ["/dashboard"]]) {
    assert.equal(returnDestination(value), undefined);
  }
});
