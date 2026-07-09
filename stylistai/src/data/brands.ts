import { Brand } from "@/types";

export const brands: Brand[] = [
  {
    id: "nike",
    name: "Nike",
    logo: "/brands/nike.svg",
    tagline: "Just Do It",
    description:
      "Nike delivers innovative athletic footwear, apparel, and equipment. A global leader in sports fashion with cutting-edge design and technology.",
    website: "https://www.nike.com",
    styleProfile: ["streetwear", "athleisure", "casual", "techwear"],
    priceRange: "premium",
    rating: 4.7,
    productCount: 342,
  },
  {
    id: "adidas",
    name: "Adidas",
    logo: "/brands/adidas.svg",
    tagline: "Impossible Is Nothing",
    description:
      "Adidas combines performance with style. Known for iconic sneakers and collaborations with designers and celebrities worldwide.",
    website: "https://www.adidas.com",
    styleProfile: ["streetwear", "athleisure", "casual"],
    priceRange: "mid-range",
    rating: 4.5,
    productCount: 289,
  },
  {
    id: "zara",
    name: "Zara",
    logo: "/brands/zara.svg",
    tagline: "Fashion Forward",
    description:
      "Zara offers high-fashion designs at accessible prices. Known for rapid trend cycles and sophisticated minimalist aesthetics.",
    website: "https://www.zara.com",
    styleProfile: ["minimalist", "smart-casual", "formal", "classic"],
    priceRange: "mid-range",
    rating: 4.3,
    productCount: 456,
  },
  {
    id: "hm",
    name: "H&M",
    logo: "/brands/hm.svg",
    tagline: "Fashion and Quality at the Best Price",
    description:
      "H&M provides affordable fashion for everyone. A wide range of styles from basics to designer collaborations.",
    website: "https://www.hm.com",
    styleProfile: ["casual", "minimalist", "streetwear"],
    priceRange: "budget",
    rating: 4.1,
    productCount: 523,
  },
  {
    id: "levis",
    name: "Levi's",
    logo: "/brands/levis.svg",
    tagline: "Live in Levi's",
    description:
      "The original denim brand since 1853. Levi's crafts iconic jeans and American heritage casual wear loved worldwide.",
    website: "https://www.levi.com",
    styleProfile: ["casual", "vintage", "classic", "old-money"],
    priceRange: "mid-range",
    rating: 4.4,
    productCount: 198,
  },
  {
    id: "outfitters",
    name: "Outfitters",
    logo: "/brands/outfitters.svg",
    tagline: "Style for Everyone",
    description:
      "Urban Outfitters offers a curated mix of casual clothing, accessories, and lifestyle products for the modern individual.",
    website: "https://www.urbanoutfitters.com",
    styleProfile: ["casual", "streetwear", "vintage"],
    priceRange: "budget",
    rating: 4.0,
    productCount: 367,
  },
  {
    id: "breakout",
    name: "Breakout",
    logo: "/brands/breakout.svg",
    tagline: "Break the Rules",
    description:
      "Breakout delivers trendy, youthful fashion with bold designs. Perfect for those who want to stand out from the crowd.",
    website: "https://www.breakout.com",
    styleProfile: ["casual", "streetwear", "korean-fashion"],
    priceRange: "budget",
    rating: 3.9,
    productCount: 234,
  },
  {
    id: "sapphire",
    name: "Sapphire",
    logo: "/brands/sapphire.svg",
    tagline: "Elegance Redefined",
    description:
      "Sapphire offers sophisticated ready-to-wear fashion blending Eastern elegance with contemporary Western design sensibilities.",
    website: "https://www.sapphireonline.pk",
    styleProfile: ["formal", "classic", "minimalist", "smart-casual"],
    priceRange: "mid-range",
    rating: 4.2,
    productCount: 178,
  },
  {
    id: "khaadi",
    name: "Khaadi",
    logo: "/brands/khaadi.svg",
    tagline: "Weave Your Story",
    description:
      "Khaadi celebrates handcrafted artistry with contemporary fashion. Known for luxurious fabrics and intricate embroidery work.",
    website: "https://www.khaadi.com",
    styleProfile: ["bohemian", "classic", "formal", "old-money"],
    priceRange: "premium",
    rating: 4.6,
    productCount: 156,
  },
  {
    id: "j.",
    name: "J.",
    logo: "/brands/junaid-jamshed.svg",
    tagline: "Tradition Meets Trend",
    description:
      "Junaid Jamshed (J.) offers a blend of traditional and modern fashion. Known for quality fabrics and elegant Eastern wear.",
    website: "https://www.junaidjamshed.com",
    styleProfile: ["formal", "classic", "old-money"],
    priceRange: "premium",
    rating: 4.3,
    productCount: 142,
  },
];

export const getBrandByName = (name: string): Brand | undefined =>
  brands.find((b) => b.name.toLowerCase() === name.toLowerCase());

export const getBrandsByStyle = (style: string): Brand[] =>
  brands.filter((b) => b.styleProfile.includes(style as never));

export const getBrandsByPriceRange = (range: string): Brand[] =>
  brands.filter((b) => b.priceRange === range);
