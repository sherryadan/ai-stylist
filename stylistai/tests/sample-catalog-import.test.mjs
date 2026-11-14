import assert from "node:assert/strict";
import { test } from "node:test";
import { csvHeader, parseSampleCsv } from "../src/services/sample-collection-import.ts";

const row = 'example,"Jacket, sand",Demo Studio,Western,upper,4500,Sand,#c2aa81,Smart casual,S|M,Lahore|Karachi';

test("accepts UTF-8 CSV with quoted commas, size variants and regional delivery", () => {
  const { items, errors } = parseSampleCsv(`\uFEFF${csvHeader}\r\n${row}\r\n`);
  assert.deepEqual(errors, []);
  assert.equal(items[0].name, "Jacket, sand");
  assert.deepEqual(items[0].delivery, ["Lahore", "Karachi"]);
  assert.deepEqual(items[0].variants.map(({ size }) => size), ["S", "M"]);
  assert.equal(items[0].sample, true);
});

test("reports duplicate SKUs, malformed fields, invalid header and oversized payloads", () => {
  const { errors } = parseSampleCsv(`${csvHeader}\n${row}\n${row}\n${row.replace("4500", "free")}`);
  assert.match(errors[0], /Line 3: duplicate SKU/);
  assert.match(errors[1], /Line 4: check price/);
  assert.equal(parseSampleCsv("invalid").errors.length, 1);
  assert.equal(parseSampleCsv("x".repeat(40001)).errors.length, 1);
});
