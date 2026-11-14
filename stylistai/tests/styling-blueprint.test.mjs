import assert from "node:assert/strict";
import { test } from "node:test";
import { requestBlueprint, templateBlueprint } from "../src/services/styling-blueprint.ts";

const input = { occasion: "wedding", category: "Eastern", dressCode: "Formal", privateNote: "Do not send" };

test("sends only minimal styling inputs to the configured loopback port", async () => {
  const result = await requestBlueprint(3132, input, async (url, init) => {
    assert.equal(url, "http://127.0.0.1:3132/blueprint");
    assert.equal(init.redirect, "error");
    assert.deepEqual(JSON.parse(init.body), { occasion: "wedding", category: "Eastern", dressCode: "Formal" });
    return Response.json({ preferredColors: ["ivory", "navy"] });
  });
  assert.deepEqual(result, { preferredColors: ["ivory", "navy"] });
});

test("rejects invalid responses and supports a deterministic template fallback", async () => {
  const responses = [
    () => Response.json({ preferredColors: ["ivory"], budget: 100_000 }),
    () => Response.json({ preferredColors: ["invented color"] }),
    () => new Response("x".repeat(2_049)),
    () => new Response("", { status: 503 }),
    () => { throw new Error("provider unavailable"); },
  ];
  for (const response of responses) {
    assert.equal(await requestBlueprint(3132, input, response), undefined);
  }
  assert.deepEqual(templateBlueprint(input), { preferredColors: ["ivory", "charcoal", "navy", "black"] });
});
