import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright-core");
const base = process.env.STYLIST_ACCEPTANCE_URL;
const token = process.env.STYLIST_LOCAL_ADMIN_TOKEN;
const executablePath = process.env.BROWSER_EXECUTABLE;
if (!base || !/^http:\/\/127\.0\.0\.1:\d+$/.test(base) || !token || !executablePath) {
  throw new Error("Set the loopback acceptance URL, test administrator token, and Chromium executable.");
}

const browser = await chromium.launch({ executablePath, headless: true });
try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 980 }, reducedMotion: "reduce" });
  const errors = [];
  desktop.on("pageerror", (error) => errors.push(error.message));
  desktop.on("console", (message) => {
    if (message.type() === "error" && /hydrat/i.test(message.text())) errors.push(message.text());
  });
  await desktop.goto(base);
  await desktop.getByRole("heading", { name: "Dress for the occasion." }).waitFor();
  await desktop.waitForFunction(() => document.querySelector('img[alt*="ivory kurta"]')?.naturalWidth > 0);
  await desktop.getByRole("button", { name: "Western", exact: true }).click();
  await desktop.getByRole("link", { name: "Plan a western look" }).waitFor();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, reducedMotion: "reduce" });
  await mobile.goto(base);
  await mobile.getByRole("button", { name: "Open menu" }).click();
  await mobile.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Sample catalog" }).waitFor();
  await mobile.getByRole("button", { name: "Close menu" }).click();
  assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

  await desktop.goto(base + "/login");
  await desktop.getByRole("button", { name: "Open local test account" }).click();
  await desktop.getByLabel("Preferred name").fill("Acceptance shopper");
  await desktop.getByLabel("Date of birth").fill("2000-02-29");
  await desktop.getByText("Optional details", { exact: true }).click();
  await desktop.getByLabel("Delivery city").fill("Lahore");
  await desktop.getByLabel("Clothing size").fill("M");
  await desktop.getByLabel("Shoe size").fill("EU 42");
  await desktop.getByLabel("Height (cm)").fill("178");
  await desktop.getByLabel("Weight (kg)").fill("75");
  await desktop.locator('select[name="preferred_fit"]').selectOption("Regular");
  await desktop.getByRole("button", { name: "Save profile" }).click();
  await desktop.getByText("Profile saved.", { exact: true }).waitFor();
  await desktop.getByText(/Age · \d+ years, \d+ days/).waitFor();

  await desktop.goto(base + "/stylist?category=Western&occasion=wedding");
  assert.equal(await desktop.locator('select[name="category"]').inputValue(), "Western");
  assert.equal(await desktop.locator('select[name="occasion"]').inputValue(), "wedding");
  assert.equal(await desktop.getByLabel("Clothing size").inputValue(), "M");
  assert.equal(await desktop.getByLabel("Shoe size").inputValue(), "EU 42");
  await desktop.getByLabel("Budget (PKR)").fill("20000");
  await desktop.getByText("Additional preferences", { exact: true }).click();
  await desktop.getByLabel("Preferred colors").fill("Navy");
  await desktop.getByLabel("Season or weather").fill("Warm evening");
  await desktop.getByRole("button", { name: "Review request" }).click();
  await desktop.getByRole("heading", { name: "Review your request" }).waitFor();
  await desktop.getByRole("button", { name: "Edit request" }).click();
  assert.equal(await desktop.getByLabel("Budget (PKR)").inputValue(), "20000");
  await desktop.getByRole("button", { name: "Review request" }).click();
  await desktop.getByRole("button", { name: "Save request" }).click();
  await desktop.getByRole("heading", { name: "Your sample looks" }).waitFor();
  await desktop.getByText("Ranked with a curated styling template.").waitFor();
  await desktop.getByText("Request details", { exact: true }).click();
  await desktop.getByText("Warm evening", { exact: true }).waitFor();
  const receipt = new URL(desktop.url()).pathname;
  await desktop.getByRole("button", { name: /^Swap / }).first().click();
  await desktop.getByRole("button", { name: /PKR.* total/ }).first().click();
  await desktop.getByRole("button", { name: "Reset to original look" }).first().waitFor();
  await desktop.getByRole("button", { name: "Like", exact: true }).first().click();
  await desktop.getByText("Your rating is recorded.").first().waitFor();
  await desktop.getByRole("button", { name: "Save look", exact: true }).first().click();
  await desktop.getByRole("status").filter({ hasText: "Look saved." }).waitFor();
  await desktop.goto(base + "/saved-outfits");
  assert.equal(await desktop.getByRole("link", { name: "Open request" }).first().getAttribute("href"), receipt);
  await desktop.getByRole("button", { name: "Remove look" }).click();
  await desktop.getByText("There are no saved looks on this page.").waitFor();
  await desktop.goto(base + "/styling-history");
  await desktop.locator(`a[href="${receipt}"]`).waitFor();
  await desktop.goto(base + "/dashboard");
  await desktop.getByRole("heading", { name: "Your styling desk" }).waitFor();
  await desktop.locator(`a[href="${receipt}"]`).waitFor();
  await mobile.goto(base + receipt);
  await mobile.getByRole("button", { name: "Open local test account" }).waitFor();

  await desktop.goto(base + "/catalog-admin");
  const adminToken = desktop.getByLabel("Local administrator token", { exact: true });
  await adminToken.fill("incorrect");
  await desktop.getByRole("button", { name: "Validate and preview" }).click();
  await desktop.getByText("Enter the local catalog administrator token.", { exact: true }).waitFor();
  await adminToken.fill(token);
  await desktop.getByRole("button", { name: "Validate and preview" }).click();
  await desktop.getByText("1 rows passed validation.").waitFor();
  await adminToken.fill(token);
  await desktop.getByRole("button", { name: "Import sample items" }).click();
  await desktop.getByText("1 sample rows imported.").waitFor();
  await desktop.getByLabel("Administrator token", { exact: true }).fill(token);
  await desktop.getByRole("button", { name: "View activity" }).click();
  await desktop.getByRole("heading", { name: "Recent successful imports" }).waitFor();
  await desktop.goto(base + "/search?q=sample%20jacket&category=Western");
  await desktop.getByRole("heading", { name: "Sand sample jacket" }).waitFor();

  await desktop.goto(base + "/profile");
  await desktop.getByText("Delete local account data", { exact: true }).click();
  await desktop.getByLabel("Delete my local test data").check();
  await desktop.getByRole("button", { name: "Delete data", exact: true }).click();
  await desktop.getByText("Local account data deleted.").waitFor();
  await desktop.getByRole("button", { name: "Open local test account" }).click();
  assert.equal(await desktop.getByLabel("Preferred name").inputValue(), "");
  await desktop.goto(base + "/styling-history");
  await desktop.getByText("There are no requests here yet.").waitFor();
  assert.deepEqual(errors, []);
  console.log("Prototype browser acceptance passed.");
} finally {
  await browser.close();
}
