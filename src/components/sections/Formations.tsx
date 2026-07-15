import { apiRequest } from "@/lib/apiClient";
import type { Formation } from "@/lib/types";
import { FormationsView, type Course } from "./FormationsView";

async function getCourses(): Promise<Course[]> {
  try {
    const formations = await apiRequest<Formation[]>("/formations", { cache: "no-store" });
    return formations.map((f) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      image: f.image,
      duration: f.duration,
      price: f.price,
    }));
  } catch {
    return [];
  }
}

export default async function Formations() {
  const courses = await getCourses();
  return <FormationsView courses={courses} />;
}
