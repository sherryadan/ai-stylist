import { products } from "@/data/products";
import type {
  Product,
  StylistFormData,
  OutfitRecommendation,
  OutfitItem,
  OutfitScore,
  StyleAnalysis,
  ProductCategory,
  Gender,
} from "@/types";

const ACCESSORY_CATEGORIES: ProductCategory[] = ["watch", "bag", "belt", "perfume", "jewelry"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function scoreGender(product: Product, formData: StylistFormData): number {
  if (!formData.gender) return 10;
  const g = formData.gender as Gender;
  if (product.gender.includes(g as never)) return 20;
  if (product.gender.includes("unisex" as never)) return 12;
  return 0;
}

function scoreOccasion(product: Product, formData: StylistFormData): number {
  if (!formData.event) return 10;
  return product.occasionTags.includes(formData.event as never) ? 20 : 0;
}

function scoreStyle(product: Product, formData: StylistFormData): number {
  if (formData.preferredStyle.length === 0) return 10;
  const matchCount = formData.preferredStyle.filter((s) =>
    product.styleTags.includes(s as never)
  ).length;
  return clamp(Math.round((matchCount / formData.preferredStyle.length) * 20), 0, 20);
}

function scoreColor(product: Product, formData: StylistFormData): number {
  if (formData.preferredColors.length === 0) return 10;
  const preferredLower = formData.preferredColors.map((c) => c.toLowerCase());
  const match = product.colors.some((c) =>
    preferredLower.some(
      (p) => c.name.toLowerCase().includes(p) || p.includes(c.name.toLowerCase())
    )
  );
  return match ? 10 : 2;
}

function scoreBodyType(product: Product, formData: StylistFormData): number {
  if (!formData.bodyType) return 10;
  return product.bodyType.includes(formData.bodyType as never) ? 10 : 2;
}

function scoreSeason(product: Product, formData: StylistFormData): number {
  if (!formData.weather) return 10;
  return product.season.includes(formData.weather as never) ? 10 : 3;
}

function scoreBrand(product: Product, formData: StylistFormData): number {
  let score = 5;
  if (formData.preferredBrands.length > 0) {
    const match = formData.preferredBrands.some(
      (b) => product.brand.toLowerCase() === b.toLowerCase()
    );
    if (match) score += 10;
  }
  if (formData.avoidBrands.length > 0) {
    const avoid = formData.avoidBrands.some(
      (b) => product.brand.toLowerCase() === b.toLowerCase()
    );
    if (avoid) score -= 15;
  }
  return clamp(score, 0, 15);
}

function matchScore(product: Product, formData: StylistFormData): number {
  const weights = {
    gender: 0.15,
    occasion: 0.2,
    style: 0.2,
    color: 0.1,
    bodyType: 0.1,
    season: 0.1,
    brand: 0.15,
  };

  const scores = {
    gender: scoreGender(product, formData),
    occasion: scoreOccasion(product, formData),
    style: scoreStyle(product, formData),
    color: scoreColor(product, formData),
    bodyType: scoreBodyType(product, formData),
    season: scoreSeason(product, formData),
    brand: scoreBrand(product, formData),
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const weighted =
    Object.entries(scores).reduce(
      (acc, [key, val]) => acc + val * weights[key as keyof typeof weights],
      0
    ) / totalWeight;

  return clamp(Math.round(weighted), 0, 100);
}

function generateExplanation(
  product: Product,
  formData: StylistFormData,
  category: string
): string {
  const firstColor = product.colors[0]?.name ?? "versatile";
  const styleRef =
    formData.preferredStyle.length > 0
      ? formData.preferredStyle[0]
      : "versatile";
  const occasionRef = formData.event || "daily wear";

  const templates: Record<string, string[]> = {
    top: [
      `The ${product.productName} from ${product.brand} anchors this outfit with its ${firstColor.toLowerCase()} hue — a perfect foundation for the ${styleRef} aesthetic. The silhouette complements a ${formData.bodyType || "standard"} build, offering structure without sacrificing comfort. Ideal for ${occasionRef}, this piece transitions effortlessly from day to evening.`,
      `I've selected the ${product.productName} for its impeccable balance of sophistication and ease. The ${firstColor.toLowerCase()} shade harmonizes beautifully with the palette below, while ${product.brand}'s craftsmanship ensures you'll look polished for ${occasionRef}. The cut is particularly flattering for a ${formData.bodyType || "standard"} frame.`,
      `For the top layer, the ${product.productName} brings that coveted ${styleRef} energy. ${product.brand} has designed this piece with precision — the ${firstColor.toLowerCase()} tone adds depth while remaining understated. It pairs naturally with the other items here, creating a cohesive look for ${occasionRef}.`,
    ],
    bottom: [
      `The ${product.productName} ground this look with their clean lines and ${firstColor.toLowerCase()} finish. ${product.brand} nails the fit here — relaxed yet intentional, moving with you throughout ${occasionRef}. They complement the top piece by creating a balanced proportion that suits ${formData.bodyType || "most builds"} beautifully.`,
      `These ${product.productName} from ${product.brand} are the unsung hero of this outfit. The ${firstColor.toLowerCase()} tone provides a neutral anchor, letting the statement pieces shine. The cut is tailored to enhance a ${formData.bodyType || "standard"} silhouette while keeping you comfortable all day at ${occasionRef}.`,
      `I'm pairing this look with the ${product.productName} because they offer the perfect blend of structure and flow. The ${firstColor.toLowerCase()} colorway ties into our ${styleRef} theme seamlessly. ${product.brand}'s attention to detail ensures a premium feel that elevates the entire ensemble for ${occasionRef}.`,
    ],
    shoes: [
      `The ${product.productName} by ${product.brand} are the finishing touch that pulls everything together. Their ${firstColor.toLowerCase()} profile adds a subtle contrast that keeps the eye moving. Beyond looks, they provide all-day comfort — essential for ${occasionRef} when you'll be on your feet making impressions.`,
      `Footwear can make or break an outfit, and the ${product.productName} deliver. ${product.brand}'s design language speaks directly to the ${styleRef} vibe we're cultivating. The ${firstColor.toLowerCase()} finish ties back to the overall palette, creating a full-circle moment for your ${occasionRef} look.`,
      `I've chosen the ${product.productName} to complete this silhouette. Their ${firstColor.toLowerCase()} aesthetic bridges the gap between the top and bottom pieces, creating visual flow. ${product.brand} brings reliability and style in equal measure — exactly what ${occasionRef} demands.`,
    ],
    watch: [
      `Timekeeping meets style with the ${product.productName}. The ${firstColor.toLowerCase()} strap adds a refined touch that signals attention to detail. This piece from ${product.brand} elevates the entire outfit, proving that the best accessories are both functional and fashionable for ${occasionRef}.`,
      `The ${product.productName} is my pick for wrist candy here. ${product.brand} has crafted a piece that walks the line between statement and subtlety. The ${firstColor.toLowerCase()} accents pick up on the outfit's undertones, creating a cohesive look that's perfect for ${occasionRef}.`,
    ],
    bag: [
      `The ${product.productName} from ${product.brand} is both practical and polished. Its ${firstColor.toLowerCase()} finish complements the outfit's color story while providing ample space for your ${occasionRef} essentials. This is the kind of piece that quietly announces your style sophistication.`,
      `I'm adding the ${product.productName} for that final layer of functionality and flair. ${product.brand} understands modern needs — this piece carries your daily essentials while the ${firstColor.toLowerCase()} shade harmonizes with the rest of the ensemble for ${occasionRef}.`,
    ],
    belt: [
      `The ${product.productName} cinches this look together — literally. The ${firstColor.toLowerCase()} leather from ${product.brand} adds a touch of rugged refinement that anchors the waist and creates a more defined silhouette. A small detail that makes a big impact for ${occasionRef}.`,
      `Never underestimate a great belt. The ${product.productName} from ${product.brand} provides that crucial middle note in our composition. The ${firstColor.toLowerCase()} finish echoes the other leather elements, creating a through-line that ties the whole ${occasionRef} look together.`,
    ],
    perfume: [
      `The ${product.productName} from ${product.brand} adds an invisible layer of sophistication. Its ${firstColor.toLowerCase()}-accented bottle hints at the warm, inviting notes within — a scent profile that lingers appropriately for ${occasionRef} without overwhelming. The final touch to a fully considered outfit.`,
      `Scent is the most memorable accessory. The ${product.productName} by ${product.brand} offers a signature fragrance that complements the ${styleRef} mood we've built. Its ${firstColor.toLowerCase()} inspired notes create an aura of confidence for ${occasionRef}.`,
    ],
    jewelry: [
      `The ${product.productName} adds just the right amount of sparkle. ${product.brand}'s ${firstColor.toLowerCase()} finish catches the light without competing for attention. It's the kind of piece that reveals itself gradually — a delightful discovery that elevates your ${occasionRef} presence.`,
      `I've included the ${product.productName} to inject a moment of brilliance. The ${firstColor.toLowerCase()} detailing from ${product.brand} catches the eye at just the right moments, adding depth and dimension to the overall composition. Perfect for ${occasionRef} when you want to stand out thoughtfully.`,
    ],
  };

  const categoryTemplates = templates[category] || templates.top;
  const template = pickRandom(categoryTemplates);
  return template;
}

function calculateColorHarmony(items: OutfitItem[]): number {
  const colors = items
    .map((item) => item.product.colors[0]?.hex)
    .filter(Boolean) as string[];

  if (colors.length < 2) return 85;

  let harmonyScore = 0;
  let comparisons = 0;

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const c1 = hexToRgb(colors[i]);
      const c2 = hexToRgb(colors[j]);
      if (c1 && c2) {
        const diff =
          Math.abs(c1.r - c2.r) +
          Math.abs(c1.g - c2.g) +
          Math.abs(c1.b - c2.b);
        const scaledDiff = (diff / 765) * 100;
        const pairScore = Math.min(100, 100 - Math.abs(scaledDiff - 50) * 2);
        harmonyScore += pairScore;
        comparisons++;
      }
    }
  }

  const avg = comparisons > 0 ? harmonyScore / comparisons : 85;
  return clamp(Math.round(avg + (Math.random() * 10 - 5)), 70, 99);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function generateScore(
  items: OutfitItem[],
  totalCost: number,
  colorHarmony: number,
  formData: StylistFormData
): OutfitScore {
  const avgMatch =
    items.length > 0
      ? Math.round(
          items.reduce((acc, item) => acc + matchScore(item.product, formData), 0) /
            items.length
        )
      : 80;

  const overall = clamp(
    Math.round(avgMatch * 0.3 + colorHarmony * 0.25 + (Math.random() * 20 + 70) * 0.45),
    70,
    95
  );
  const confidence = clamp(
    Math.round(overall * 0.6 + avgMatch * 0.4 + (Math.random() * 10 - 5)),
    75,
    98
  );
  const occasionMatch = clamp(
    Math.round(overall * 0.5 + avgMatch * 0.5 + (Math.random() * 10 - 5)),
    80,
    99
  );
  const weatherMatch = clamp(
    Math.round(
      (items.reduce(
        (acc, item) =>
          acc +
          (formData.weather && item.product.season.includes(formData.weather as never)
            ? 100
            : 50),
        0
      ) /
        items.length) *
        0.8 +
        Math.random() * 20
    ),
    70,
    95
  );
  const trendScore = clamp(
    Math.round(
      colorHarmony * 0.3 + avgMatch * 0.4 + (Math.random() * 15 + 70) * 0.3
    ),
    65,
    95
  );

  return {
    overall,
    confidence,
    estimatedTotalCost: totalCost,
    occasionMatch,
    weatherMatch,
    colorHarmony,
    trendScore,
  };
}

function generateStyleAnalysis(
  items: OutfitItem[],
  formData: StylistFormData
): StyleAnalysis {
  const topItem = items.find((i) => i.category === "top")?.product;
  const bottomItem = items.find((i) => i.category === "bottom")?.product;
  const shoeItem = items.find((i) => i.category === "shoes")?.product;
  const dominantStyle = formData.preferredStyle[0] || "refined";
  const occasion = formData.event || "your occasion";
  const season = formData.weather || "current season";

  const topColor = topItem?.colors[0]?.name ?? "neutral";
  const bottomColor = bottomItem?.colors[0]?.name ?? "neutral";
  const shoeColor = shoeItem?.colors[0]?.name ?? "neutral";

  return {
    colorPsychology: `The ${topColor} top paired with ${bottomColor} bottoms and ${shoeColor} footwear creates a carefully calibrated emotional palette. ${topColor} evokes ${getColorPsychology(topColor)}, while ${bottomColor} grounds the look with ${getColorPsychology(bottomColor)}. This combination communicates confidence, intentionality, and a sophisticated understanding of visual impact — exactly the right message for ${occasion}.`,
    fashionPrinciples: `This outfit demonstrates mastery of several core fashion principles: proportion (the relationship between the top and bottom pieces creates an elongating effect), texture contrast (different fabric weights add visual interest without clashing), and the 60-30-10 rule (a dominant color, a secondary shade, and strategic accents). The silhouette follows the principle of balance — relaxed elements are offset by structured ones, creating harmony.`,
    bodyTypeCompatibility: `For a ${formData.bodyType || "standard"} build, this composition works by creating clear visual zones. The ${topItem?.productName?.toLowerCase() || "top"} defines the upper silhouette, while the ${bottomItem?.productName?.toLowerCase() || "bottom"} provides a complementary lower line. The ${shoeItem?.productName?.toLowerCase() || "shoes"} complete the vertical flow. This arrangement flatters by drawing the eye along natural lines rather than breaking them.`,
    seasonSuitability: `Tailored for ${season} conditions, each piece has been evaluated for thermal comfort and seasonal appropriateness. The fabric weights are chosen to keep you comfortable without bulk, while the color palette resonates with ${season}'s natural tones. The layering potential here allows for adaptability as temperatures fluctuate throughout ${occasion}.`,
    occasionAppropriateness: `For ${occasion}, this outfit strikes the ideal tone — polished without being overwhelming, stylish without trying too hard. The combination reads as thoughtfully curated rather than costume-like. Each piece respects the context of ${occasion} while allowing your personal style to shine through. The overall impression is someone who understands the assignment and executes it with flair.`,
    currentTrends: `This look channels several current movements in fashion: the return of ${dominantStyle} as a dominant aesthetic, the emphasis on quality over quantity, and the push toward versatile pieces that work across contexts. The color blocking and texture play here reflect what we're seeing on runways and in street style. ${getTrendInsight(dominantStyle)}`,
  };
}

function getColorPsychology(color: string): string {
  const map: Record<string, string> = {
    black: "authority and timeless sophistication",
    white: "purity, clarity, and fresh minimalism",
    navy: "trust, stability, and quiet confidence",
    beige: "approachable warmth and understated elegance",
    grey: "balance, neutrality, and refined restraint",
    brown: "reliability, warmth, and organic authenticity",
    blue: "calm, professionalism, and open communication",
    green: "growth, harmony, and natural vitality",
    red: "passion, energy, and bold self-assurance",
    cream: "soft luxury and effortless grace",
    sage: "serenity, growth, and grounded sophistication",
    olive: "earthy resilience and understated strength",
    charcoal: "gravity, focus, and urban sophistication",
    burgundy: "richness, depth, and cultured refinement",
    camel: "timeless luxury with a relaxed sensibility",
    gold: "success, optimism, and celebratory spirit",
    silver: "modernity, innovation, and sleek futurism",
    pink: "playful confidence with a contemporary edge",
    peach: "gentle warmth and subtle femininity",
    lavender: "creativity, calm, and artistic sensitivity",
    coral: "vibrant energy and tropical warmth",
    teal: "sophisticated depth and creative balance",
    indigo: "intuition, depth, and spiritual awareness",
    rust: "earthy warmth with vintage character",
    wine: "opulence, depth, and mature sophistication",
  };
  for (const [key, val] of Object.entries(map)) {
    if (color.toLowerCase().includes(key)) return val;
  }
  return "refined elegance and intentional style";
}

function getTrendInsight(style: string): string {
  const insights: Record<string, string> = {
    streetwear:
      "Streetwear continues to evolve toward elevated basics — think premium fabrics applied to classic silhouettes. The oversized-but-tailored balance is particularly strong this season.",
    "old-money":
      "The quiet luxury movement shows no signs of slowing. Investment pieces in neutral palettes with exceptional tailoring define this enduring trend.",
    minimalist:
      "Clean lines and intentional simplicity dominate. The focus is on cut and fabric quality rather than ornamentation — a 'less is more' philosophy executed with precision.",
    luxury:
      "Luxury is increasingly about craftsmanship narratives and heritage details. Pieces that tell a story through their construction are leading the conversation.",
    casual:
      "Elevated casual continues to blur the line between comfort and polish. The key is intentional relaxation — pieces that look effortless but are carefully considered.",
    formal:
      "Formal wear is experiencing a renaissance of soft tailoring — structured but not stiff, traditional but with contemporary proportions and subtle detailing.",
    techwear:
      "Technical fabrics are crossing over into mainstream fashion. Utility details and weather-resistant materials no longer sacrifice style for function.",
    business:
      "The new business casual is smarter than ever. Blazers worn with refined separates — the modern uniform for the hybrid work era.",
    athleisure:
      "Performance fabrics in everyday silhouettes continue to dominate. The line between activewear and ready-to-wear is increasingly invisible.",
    vintage:
      "Archival inspiration is driving design across the board. Authentic vintage details and washes are being reimagined with modern fits.",
    "smart-casual":
      "The most versatile dress code demands pieces that can pivot. Texture and layering are the smart-casual stylist's secret weapons this season.",
    "korean-fashion":
      "K-fashion's influence continues to grow globally. Layered, oversized silhouettes with unexpected color combinations define the look.",
    "japanese-streetwear":
      "Japanese streetwear's emphasis on fabric innovation and deconstruction is influencing mainstream collections. Avant-garde details appear in wearable forms.",
    bohemian:
      "Boho is back with a refined edge. Artisanal details, handcrafted textures, and earthy palettes updated for a contemporary audience.",
    classic:
      "Classic style endures because it evolves. The current iteration favors impeccable fit, heritage fabrics, and the quiet confidence of timeless design.",
  };
  return insights[style] || "Current fashion favors personal expression over rigid rules — mixing textures, unexpected color combinations, and pieces that reflect individual identity.";
}

function generateOutfitExplanation(
  items: OutfitItem[],
  type: string,
  formData: StylistFormData
): string {
  const top = items.find((i) => i.category === "top")?.product;
  const bottom = items.find((i) => i.category === "bottom")?.product;
  const shoes = items.find((i) => i.category === "shoes")?.product;
  const occasion = formData.event || "your occasion";

  const typeAdjectives: Record<string, string> = {
    budget:
      "value-conscious without compromising on style",
    balanced:
      "the sweet spot where quality meets reasonable investment",
    premium:
      "our most curated selection for those who demand the best",
  };

  return (
    `This ${type} outfit is ${typeAdjectives[type] || "carefully selected for you"}. ` +
    `The ${top?.productName || "top"} from ${top?.brand || "our collection"} sets the tone, ` +
    `paired with ${bottom?.productName || "bottoms"} to create a cohesive foundation. ` +
    `${shoes?.productName || "The shoes"} from ${shoes?.brand || "a trusted brand"} anchor the look. ` +
    `Every accessory has been chosen to complement rather than compete — ` +
    `resulting in a complete ensemble that's ready for ${occasion}. ` +
    `The overall effect is intentional, polished, and distinctly you.`
  );
}

function filterProducts(
  formData: StylistFormData,
  category: ProductCategory
): Product[] {
  return products.filter((p) => {
    if (p.category !== category) return false;

    if (formData.gender) {
      const g = formData.gender as Gender;
      if (!p.gender.includes(g as never) && !p.gender.includes("unisex" as never)) {
        return false;
      }
    }

    if (formData.event && !p.occasionTags.includes(formData.event as never)) {
      return false;
    }

    if (formData.preferredStyle.length > 0) {
      const hasMatch = formData.preferredStyle.some((s) =>
        p.styleTags.includes(s as never)
      );
      if (!hasMatch) return false;
    }

    if (formData.weather) {
      if (!p.season.includes(formData.weather as never)) return false;
    }

    if (formData.bodyType) {
      if (!p.bodyType.includes(formData.bodyType as never)) return false;
    }

    if (formData.avoidBrands.length > 0) {
      if (
        formData.avoidBrands.some(
          (b) => p.brand.toLowerCase() === b.toLowerCase()
        )
      )
        return false;
    }

    return true;
  });
}

function selectBestProduct(
  pool: Product[],
  formData: StylistFormData,
  maxPrice: number,
  excludeIds: Set<string>
): Product | null {
  const candidates = pool.filter((p) => p.price <= maxPrice && !excludeIds.has(p.id));
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => matchScore(b, formData) - matchScore(a, formData));
  const topTier = candidates.slice(0, Math.min(3, candidates.length));
  return pickRandom(topTier);
}

function selectAccessoryProducts(
  pool: Product[],
  formData: StylistFormData,
  maxPrice: number,
  count: number,
  excludeIds: Set<string>
): Product[] {
  const candidates = pool.filter((p) => p.price <= maxPrice && !excludeIds.has(p.id));
  if (candidates.length === 0) return [];

  candidates.sort((a, b) => matchScore(b, formData) - matchScore(a, formData));

  const result: Product[] = [];
  const usedCategories = new Set<ProductCategory>();

  for (const candidate of candidates) {
    if (result.length >= count) break;
    if (usedCategories.has(candidate.category)) continue;
    result.push(candidate);
    usedCategories.add(candidate.category);
    excludeIds.add(candidate.id);
  }

  return result;
}

export async function generateRecommendations(
  formData: StylistFormData
): Promise<OutfitRecommendation[]> {
  const delay = 2000 + Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const budget = formData.budget || 500;

  const allTops = filterProducts(formData, "top");
  const allBottoms = filterProducts(formData, "bottom");
  const allShoes = filterProducts(formData, "shoes");

  const allAccessories = ACCESSORY_CATEGORIES.flatMap((cat) =>
    filterProducts(formData, cat)
  );

  const tiers: { type: "budget" | "balanced" | "premium"; maxBudget: number }[] = [
    { type: "budget", maxBudget: budget * 0.6 },
    { type: "balanced", maxBudget: budget * 0.8 },
    { type: "premium", maxBudget: budget * 1.2 },
  ];

  const globalExclude = new Set<string>();
  const recommendations: OutfitRecommendation[] = [];

  for (const tier of tiers) {
    const usedIds = new Set(globalExclude);

    const top = selectBestProduct(allTops, formData, tier.maxBudget, usedIds);
    if (top) usedIds.add(top.id);
    const bottom = selectBestProduct(allBottoms, formData, tier.maxBudget, usedIds);
    if (bottom) usedIds.add(bottom.id);
    const shoe = selectBestProduct(allShoes, formData, tier.maxBudget, usedIds);
    if (shoe) usedIds.add(shoe.id);

    const accessories = selectAccessoryProducts(
      allAccessories,
      formData,
      tier.maxBudget,
      3,
      usedIds
    );

    const items: OutfitItem[] = [];

    if (top) {
      items.push({
        category: "top",
        product: top,
        reason: generateExplanation(top, formData, "top"),
      });
    }
    if (bottom) {
      items.push({
        category: "bottom",
        product: bottom,
        reason: generateExplanation(bottom, formData, "bottom"),
      });
    }
    if (shoe) {
      items.push({
        category: "shoes",
        product: shoe,
        reason: generateExplanation(shoe, formData, "shoes"),
      });
    }

    const accessoryReasonMap: Partial<Record<ProductCategory, string>> = {
      watch: "watch",
      bag: "bag",
      belt: "belt",
      perfume: "perfume",
      jewelry: "jewelry",
    };

    for (const acc of accessories) {
      const reasonKey = (accessoryReasonMap[acc.category] as string) || "accessory";
      items.push({
        category: acc.category,
        product: acc,
        reason: generateExplanation(acc, formData, reasonKey),
      });
    }

    const totalCost = items.reduce((sum, item) => sum + item.product.price, 0);
    const colorHarmony = calculateColorHarmony(items);
    const score = generateScore(items, totalCost, colorHarmony, formData);
    const explanation = generateOutfitExplanation(items, tier.type, formData);
    const styleAnalysis = generateStyleAnalysis(items, formData);

    const namePrefix =
      tier.type === "budget"
        ? "Smart Saver"
        : tier.type === "balanced"
          ? "Editor's Pick"
          : "Premium Select";

    const styleName =
      formData.preferredStyle.length > 0
        ? formData.preferredStyle[0].charAt(0).toUpperCase() +
          formData.preferredStyle[0].slice(1)
        : "Curated";

    recommendations.push({
      id: `outfit-${tier.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: `${namePrefix} ${styleName} Look`,
      type: tier.type,
      items,
      totalCost,
      score,
      explanation,
      styleAnalysis,
    });

    items.forEach((item) => globalExclude.add(item.product.id));
  }

  return recommendations;
}
