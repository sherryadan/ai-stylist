import assert from "node:assert/strict";
import { test } from "node:test";
import { sampleMenswear } from "../src/data/sample-menswear.ts";
import { matchMenswear } from "../src/services/menswear-matching.ts";

const request = {
  category: "Mixed", budget: 20_000, dressCode: "", occasion: "wedding", city: "Lahore",
  clothingSize: "M", shoeSize: "EU 42", avoidColors: "", avoidBrands: "",
};

for (const category of ["Eastern", "Western", "Mixed"]) {
  for (const budget of [1, 8_000, 10_000, 15_000, 30_000]) {
    for (const dressCode of ["", "Casual", "Smart casual", "Formal"]) {
      test(`${category} / PKR ${budget} / ${dressCode || "any dress code"}`, () => {
        const input = { ...request, category, budget, dressCode, avoidColors: " white " };
        const result = matchMenswear(input, sampleMenswear);
        assert.deepEqual(result, matchMenswear(input, sampleMenswear));
        assert.ok(result.looks.length <= 3);
        for (const look of result.looks) {
          assert.equal(look.subtotal, look.items.reduce((total, item) => total + item.price, 0));
          assert.ok(look.subtotal <= budget);
          assert.ok(look.items.every((item) =>
            item.color !== "White" && (category === "Mixed" || item.category === category) &&
            (!dressCode || item.dressCodes.includes(dressCode))));
          const slots = look.items.map(({ slot }) => slot);
          assert.ok(slots.includes("footwear") && (slots.includes("set") || (slots.includes("upper") && slots.includes("lower"))));
        }
      });
    }
  }
}

test("exposes honest shortfalls and checks stock, size, brand and delivery", () => {
  assert.equal(matchMenswear(request, sampleMenswear).looks.length, 3);
  assert.equal(matchMenswear({ ...request, shoeSize: "EU 52" }, sampleMenswear).looks.length, 0);
  assert.equal(matchMenswear({ ...request, avoidBrands: "stylistai sample" }, sampleMenswear).eligible.length, 0);
  const restricted = sampleMenswear.map((item) => ({ ...item, delivery: ["Karachi"] }));
  assert.equal(matchMenswear(request, restricted).eligible.length, 0);
  const unavailable = sampleMenswear.map((item) => ({ ...item, variants: [{ size: "M", inStock: false }] }));
  assert.equal(matchMenswear(request, unavailable).eligible.length, 0);
});
