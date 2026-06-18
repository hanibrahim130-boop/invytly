import type { LucideIcon } from "lucide-react";

export type DesignStyle = "modern" | "classic" | "minimal" | "floral" | "glam";

export interface Design {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  style: DesignStyle;
  description: string;
  features: string[];
  popular?: boolean;
  new?: boolean;
}

export const DESIGNS: Design[] = [
  // Weddings
  {
    id: "w1",
    name: "Eternal Rose",
    category: "weddings",
    categoryLabel: "Wedding",
    price: 19,
    style: "floral",
    description:
      "Soft watercolor roses on cream linen. Perfect for romantic garden ceremonies.",
    features: ["RSVP page", "Guest count", "WhatsApp share", "PDF download"],
    popular: true,
  },
  {
    id: "w2",
    name: "Modern Love",
    category: "weddings",
    categoryLabel: "Wedding",
    price: 15,
    style: "modern",
    description:
      "Clean typography and subtle gold accents. City-chic with a warm soul.",
    features: ["RSVP page", "Guest count", "WhatsApp share", "PDF download"],
    new: true,
  },
  {
    id: "w3",
    name: "Royal Bloom",
    category: "weddings",
    categoryLabel: "Wedding",
    price: 25,
    style: "glam",
    description:
      "Dramatic florals, deep jewel tones, and gold foil. For the statement wedding.",
    features: ["RSVP page", "Guest count", "WhatsApp share", "PDF download"],
    popular: true,
  },
  {
    id: "w4",
    name: "Minimal Vows",
    category: "weddings",
    categoryLabel: "Wedding",
    price: 15,
    style: "minimal",
    description:
      "Whitespace, serif type, and a single elegant line. Less is more.",
    features: ["RSVP page", "Guest count", "WhatsApp share", "PDF download"],
  },
  // Engagements
  {
    id: "e1",
    name: "Blush Promise",
    category: "engagements",
    categoryLabel: "Engagement",
    price: 12,
    style: "floral",
    description:
      "Dusty pink peonies with hand-lettered script. Sweet, intimate, and celebratory.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
    popular: true,
  },
  {
    id: "e2",
    name: "Golden Hour",
    category: "engagements",
    categoryLabel: "Engagement",
    price: 15,
    style: "glam",
    description:
      "Warm metallic textures and sunset gradients. For golden-moment announcements.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
    new: true,
  },
  // Birthdays
  {
    id: "b1",
    name: "Sparkle Party",
    category: "birthdays",
    categoryLabel: "Birthday",
    price: 9,
    style: "glam",
    description:
      "Confetti sparkles and bold color pops. Vibrant energy for any age.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
    popular: true,
  },
  {
    id: "b2",
    name: "Tropical Vibe",
    category: "birthdays",
    categoryLabel: "Birthday",
    price: 9,
    style: "modern",
    description:
      "Palm leaves and tropical blooms. Summer party vibes, all year round.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
  },
  {
    id: "b3",
    name: "Vintage Cake",
    category: "birthdays",
    categoryLabel: "Birthday",
    price: 12,
    style: "classic",
    description:
      "Illustrated cake tiers and vintage lace. For milestone birthdays with charm.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
  },
  // Graduations
  {
    id: "g1",
    name: "Cap & Gown",
    category: "graduations",
    categoryLabel: "Graduation",
    price: 9,
    style: "minimal",
    description:
      "Clean academic motif with modern layout. Celebrate the achievement.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
  },
  {
    id: "g2",
    name: "Future Bright",
    category: "graduations",
    categoryLabel: "Graduation",
    price: 12,
    style: "modern",
    description:
      "Gradients of hope and ambition. A bold start to the next chapter.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
    new: true,
  },
  // Baby Showers
  {
    id: "s1",
    name: "Sweet Dreams",
    category: "baby-showers",
    categoryLabel: "Baby Shower",
    price: 9,
    style: "floral",
    description:
      "Soft clouds, stars, and gentle pastels. Tender joy for the new arrival.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
    popular: true,
  },
  {
    id: "s2",
    name: "Little One",
    category: "baby-showers",
    categoryLabel: "Baby Shower",
    price: 9,
    style: "minimal",
    description:
      "Simple icons and warm neutrals. Gender-neutral and timeless.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
  },
  // Corporate
  {
    id: "c1",
    name: "Executive Evening",
    category: "corporate",
    categoryLabel: "Corporate",
    price: 19,
    style: "modern",
    description:
      "Bold geometry, deep tones, and confident typography. Boardroom-ready.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
    popular: true,
  },
  {
    id: "c2",
    name: "Launch Night",
    category: "corporate",
    categoryLabel: "Corporate",
    price: 25,
    style: "glam",
    description:
      "Cinematic gradients and spotlight feel. For product launches and galas.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
    new: true,
  },
  // Private
  {
    id: "p1",
    name: "Anniversary Toast",
    category: "private",
    categoryLabel: "Private",
    price: 9,
    style: "classic",
    description:
      "Champagne bubbles and vintage script. Celebrate the years together.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
  },
  {
    id: "p2",
    name: "Garden Dinner",
    category: "private",
    categoryLabel: "Private",
    price: 9,
    style: "floral",
    description:
      "Hand-drawn botanicals and warm earth tones. Intimate gatherings.",
    features: ["RSVP page", "WhatsApp share", "PDF download"],
  },
  // Custom
  {
    id: "cu1",
    name: "Bespoke Commission",
    category: "custom",
    categoryLabel: "Custom",
    price: 39,
    style: "modern",
    description:
      "Work one-on-one with our design team. Unlimited revisions.",
    features: [
      "1-on-1 designer",
      "Unlimited revisions",
      "RSVP page",
      "WhatsApp share",
      "PDF download",
    ],
  },
];

export function getDesignById(id: string): Design | undefined {
  return DESIGNS.find((d) => d.id === id);
}

export function getDesignsByCategory(category: string): Design[] {
  return DESIGNS.filter((d) => d.category === category);
}

export function getRelatedDesigns(design: Design, limit = 4): Design[] {
  return DESIGNS.filter(
    (d) => d.id !== design.id && d.category === design.category
  ).slice(0, limit);
}
