export interface Style {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  popularBrands: string[];
}

export const styles: Style[] = [
  {
    id: "streetwear",
    name: "Streetwear",
    description: "Urban-inspired fashion with bold graphics and oversized silhouettes.",
    image: "/styles/streetwear.jpg",
    color: "#F43F5E",
    popularBrands: ["Nike", "Adidas", "Outfitters"],
  },
  {
    id: "old-money",
    name: "Old Money",
    description: "Timeless elegance with understated luxury and classic pieces.",
    image: "/styles/old-money.jpg",
    color: "#1E3A5F",
    popularBrands: ["Levi's", "Zara", "Sapphire"],
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean lines, neutral palettes, and purposeful simplicity.",
    image: "/styles/minimalist.jpg",
    color: "#71717A",
    popularBrands: ["Zara", "H&M", "Sapphire"],
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Premium materials, exquisite craftsmanship, and exclusive designs.",
    image: "/styles/luxury.jpg",
    color: "#C9A84C",
    popularBrands: ["Khaadi", "J.", "Sapphire"],
  },
  {
    id: "casual",
    name: "Casual",
    description: "Relaxed, comfortable everyday wear that looks effortlessly cool.",
    image: "/styles/casual.jpg",
    color: "#22C55E",
    popularBrands: ["H&M", "Levi's", "Outfitters"],
  },
  {
    id: "formal",
    name: "Formal",
    description: "Refined and polished attire for distinguished occasions.",
    image: "/styles/formal.jpg",
    color: "#18181B",
    popularBrands: ["Zara", "Sapphire", "J."],
  },
  {
    id: "techwear",
    name: "Techwear",
    description: "Futuristic functional fashion with technical fabrics and utility.",
    image: "/styles/techwear.jpg",
    color: "#2563EB",
    popularBrands: ["Nike", "Adidas"],
  },
  {
    id: "business",
    name: "Business",
    description: "Professional attire that commands confidence and authority.",
    image: "/styles/business.jpg",
    color: "#1E40AF",
    popularBrands: ["Zara", "Sapphire", "J."],
  },
  {
    id: "athleisure",
    name: "Athleisure",
    description: "Athletic wear that transitions seamlessly from gym to street.",
    image: "/styles/athleisure.jpg",
    color: "#F97316",
    popularBrands: ["Nike", "Adidas", "Outfitters"],
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Classic styles from past decades with modern reinterpretation.",
    image: "/styles/vintage.jpg",
    color: "#A16207",
    popularBrands: ["Levi's", "Outfitters", "Breakout"],
  },
  {
    id: "smart-casual",
    name: "Smart Casual",
    description: "The perfect balance between relaxed and refined dressing.",
    image: "/styles/smart-casual.jpg",
    color: "#6366F1",
    popularBrands: ["Zara", "Sapphire", "Levi's"],
  },
  {
    id: "korean-fashion",
    name: "Korean Fashion",
    description: "Trend-inspired K-fashion with layered looks and clean aesthetics.",
    image: "/styles/korean.jpg",
    color: "#EC4899",
    popularBrands: ["Breakout", "H&M", "Zara"],
  },
  {
    id: "japanese-streetwear",
    name: "Japanese Streetwear",
    description: "Avant-garde street style mixing tradition with urban culture.",
    image: "/styles/japanese.jpg",
    color: "#EF4444",
    popularBrands: ["Nike", "Adidas", "Outfitters"],
  },
  {
    id: "bohemian",
    name: "Bohemian",
    description: "Free-spirited fashion with rich textures and earthy tones.",
    image: "/styles/bohemian.jpg",
    color: "#D97706",
    popularBrands: ["Khaadi", "H&M", "Outfitters"],
  },
  {
    id: "classic",
    name: "Classic",
    description: "Timeless pieces that never go out of style. Enduring elegance.",
    image: "/styles/classic.jpg",
    color: "#0F766E",
    popularBrands: ["Levi's", "Zara", "J.", "Sapphire"],
  },
];

export const getStyleById = (id: string): Style | undefined =>
  styles.find((s) => s.id === id);
