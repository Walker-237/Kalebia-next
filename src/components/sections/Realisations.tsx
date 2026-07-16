import { apiRequest } from "@/lib/apiClient";
import type { Realisation } from "@/lib/types";
import { RealisationsView, type RealisationItem } from "./RealisationsView";

async function getRealisations(): Promise<Realisation[]> {
  try {
    return await apiRequest<Realisation[]>("/realisations", { cache: "no-store" });
  } catch {
    return [];
  }
}

export default async function Realisations() {
  const realisations = await getRealisations();

  // Featured items first (if any), most recent within each group otherwise
  // — matches admin's "featured" toggle intent: lead with what's pinned.
  const sorted = [...realisations].sort((a, b) => Number(b.featured) - Number(a.featured));

  const items: RealisationItem[] = sorted.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    shortDescription: r.shortDescription,
    coverImage: r.coverImage,
    // NOTE: `metric` isn't on the current `Realisation` type — add
    // `metric: { value: string; label: string }` to it and to the API
    // response. Falling back to a placeholder here so this compiles,
    // but every project should have a real number: reach %, budget
    // managed, campaign count, whatever anchors that chapter.
    metric: r.metric ?? { value: "—", label: "métrique à renseigner" },
  }));

  return <RealisationsView items={items} />;
}