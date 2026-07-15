import { apiRequest } from "@/lib/apiClient";
import type { Testimonial } from "@/lib/types";
import { TemoignagesView, type TestimonialItem } from "./TemoignagesView";

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await apiRequest<Testimonial[]>("/testimonials", { cache: "no-store" });
  } catch {
    return [];
  }
}

export default async function Temoignages() {
  const testimonials = await getTestimonials();

  const items: TestimonialItem[] = testimonials.map((t) => ({
    quote: t.comment,
    name: t.name,
    role: [t.role, t.company].filter(Boolean).join(" · "),
  }));

  const averageRating =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      : 5;

  return <TemoignagesView testimonials={items} averageRating={averageRating} />;
}
