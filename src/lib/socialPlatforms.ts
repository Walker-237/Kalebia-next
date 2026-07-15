export type SocialPlatformLevel = "Expert" | "Avancé" | "Intermédiaire";

export interface SocialPlatformMeta {
  key: string;
  label: string;
  logo: string;
  level: SocialPlatformLevel;
}

/**
 * The fixed set of social media the site knows how to display (brand PNG +
 * skill-level badge on the public marquee). Admins pick a link's platform
 * from this list rather than typing a free-text name — the site has a
 * fixed set of channels; adding a "link" means attaching a URL to one of
 * these, not inventing a new platform.
 */
export const SOCIAL_PLATFORMS: SocialPlatformMeta[] = [
  { key: "instagram", label: "Instagram", logo: "/instagram.png", level: "Expert" },
  { key: "facebook", label: "Facebook", logo: "/facebook.png", level: "Expert" },
  { key: "tiktok", label: "TikTok", logo: "/tiktok.png", level: "Expert" },
  { key: "snapchat", label: "Snapchat", logo: "/snap.png", level: "Avancé" },
  { key: "linkedin", label: "LinkedIn", logo: "/linkdin.png", level: "Avancé" },
  { key: "twitter", label: "X (Twitter)", logo: "/x.png", level: "Avancé" },
  { key: "youtube", label: "YouTube", logo: "/youtube.png", level: "Intermédiaire" },
  { key: "whatsapp", label: "WhatsApp", logo: "/whatsapp.png", level: "Expert" },
];

// Legacy/alternate spellings that should resolve to a canonical key above.
const ALIASES: Record<string, string> = { x: "twitter" };

export function resolveSocialPlatform(rawPlatform: string): SocialPlatformMeta | undefined {
  const normalized = rawPlatform.trim().toLowerCase();
  const key = ALIASES[normalized] ?? normalized;
  return SOCIAL_PLATFORMS.find((p) => p.key === key);
}
