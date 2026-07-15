import { apiRequest } from "@/lib/apiClient";
import type { SocialLink } from "@/lib/types";
import { resolveSocialPlatform } from "@/lib/socialPlatforms";
import { PlatformsMarqueeView, type PlatformItem } from "./SocialplatformsorbitView";

async function getPlatforms(): Promise<PlatformItem[]> {
  let links: SocialLink[];
  try {
    links = await apiRequest<SocialLink[]>("/social-links", { cache: "no-store" });
  } catch {
    return [];
  }

  const items: PlatformItem[] = [];
  for (const link of links) {
    const meta = resolveSocialPlatform(link.platform);
    if (!meta) continue;
    items.push({ key: link.id, name: meta.label, level: meta.level, logo: meta.logo });
  }
  return items;
}

export default async function PlatformsMarquee() {
  const platforms = await getPlatforms();
  return <PlatformsMarqueeView platforms={platforms} />;
}
