export interface Product {
  id: string;
  brand: string;
  brandLogo: string;
  productName: string;
  category: ProductCategory;
  description: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  colors: ProductColor[];
  rating: number;
  reviewCount: number;
  image: string;
  purchaseUrl: string;
  styleTags: StyleTag[];
  occasionTags: OccasionTag[];
  season: Season[];
  gender: Gender[];
  bodyType: BodyType[];
  isNew?: boolean;
  isBestseller?: boolean;
}

export type ProductCategory =
  | "top"
  | "bottom"
  | "shoes"
  | "watch"
  | "bag"
  | "belt"
  | "accessory"
  | "perfume"
  | "outerwear"
  | "jewelry"
  | "sunglasses"
  | "hat";

export type ProductColor = {
  name: string;
  hex: string;
};

export type StyleTag =
  | "streetwear"
  | "old-money"
  | "minimalist"
  | "luxury"
  | "casual"
  | "formal"
  | "techwear"
  | "business"
  | "athleisure"
  | "vintage"
  | "smart-casual"
  | "korean-fashion"
  | "japanese-streetwear"
  | "bohemian"
  | "classic";

export type OccasionTag =
  | "wedding"
  | "business-meeting"
  | "job-interview"
  | "graduation"
  | "birthday"
  | "party"
  | "university"
  | "date-night"
  | "conference"
  | "seminar"
  | "casual"
  | "travel"
  | "eid"
  | "family-gathering"
  | "formal-dinner";

export type Season = "spring" | "summer" | "fall" | "winter";

export type Gender = "male" | "female" | "unisex";

export type BodyType = "slim" | "athletic" | "average" | "muscular" | "plus-size";

export interface Brand {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  description: string;
  website: string;
  styleProfile: StyleTag[];
  priceRange: "budget" | "mid-range" | "premium" | "luxury";
  rating: number;
  productCount: number;
}

export interface OutfitRecommendation {
  id: string;
  name: string;
  type: "budget" | "balanced" | "premium";
  items: OutfitItem[];
  totalCost: number;
  score: OutfitScore;
  explanation: string;
  styleAnalysis: StyleAnalysis;
}

export interface OutfitItem {
  category: ProductCategory;
  product: Product;
  reason: string;
}

export interface OutfitScore {
  overall: number;
  confidence: number;
  estimatedTotalCost: number;
  occasionMatch: number;
  weatherMatch: number;
  colorHarmony: number;
  trendScore: number;
}

export interface StyleAnalysis {
  colorPsychology: string;
  fashionPrinciples: string;
  bodyTypeCompatibility: string;
  seasonSuitability: string;
  occasionAppropriateness: string;
  currentTrends: string;
}

export interface StylistFormData {
  gender: Gender | "";
  age: string;
  country: string;
  city: string;
  event: OccasionTag | "";
  dressCode: string;
  budget: number;
  preferredStyle: StyleTag[];
  preferredColors: string[];
  bodyType: BodyType | "";
  height: string;
  weather: Season | "";
  preferredBrands: string[];
  avoidBrands: string[];
  alreadyOwnedItems: string;
  accessoriesNeeded: string[];
  notes: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "premium" | "enterprise";
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}
