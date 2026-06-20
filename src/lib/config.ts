import type { LucideIcon } from "lucide-react";
import {
  Heart,
  Cake,
  GraduationCap,
  Baby,
  Briefcase,
  Sparkles,
  Gem,
  PartyPopper,
} from "lucide-react";

export const SITE_CONFIG = {
  name: "Invyty",
  tagline: "Beautiful digital invitations, delivered in hours.",
  description:
    "Browse stunning invitation designs, share event details, and send a private RSVP link to your guests on WhatsApp.",
  url: "https://invyty.bundlyplus.com",
  ogImage: "/og.svg",
  supportEmail: "hello@invyty.bundlyplus.com",
  whatsapp: "+10000000000",
  currency: "USD",
} as const;

export type EventCategory = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  startingAt: number;
};

export const CATEGORIES: EventCategory[] = [
  {
    slug: "weddings",
    name: "Weddings",
    description: "Timeless designs for your forever moment.",
    icon: Heart,
    startingAt: 15,
  },
  {
    slug: "engagements",
    name: "Engagements",
    description: "Romantic invites for the next chapter.",
    icon: Gem,
    startingAt: 12,
  },
  {
    slug: "birthdays",
    name: "Birthdays",
    description: "Playful, modern, or elegant — your call.",
    icon: Cake,
    startingAt: 9,
  },
  {
    slug: "graduations",
    name: "Graduations",
    description: "Celebrate the achievement in style.",
    icon: GraduationCap,
    startingAt: 9,
  },
  {
    slug: "baby-showers",
    name: "Baby Showers",
    description: "Soft, sweet designs for the little one.",
    icon: Baby,
    startingAt: 9,
  },
  {
    slug: "corporate",
    name: "Corporate",
    description: "Polished invites for company events.",
    icon: Briefcase,
    startingAt: 19,
  },
  {
    slug: "private",
    name: "Private",
    description: "Anniversaries, dinners, gatherings.",
    icon: Sparkles,
    startingAt: 9,
  },
  {
    slug: "custom",
    name: "Custom Design",
    description: "We design from scratch around your vision.",
    icon: PartyPopper,
    startingAt: 39,
  },
];
