import type { Tables } from "@/integrations/supabase/types";

export type TourListItem = Pick<
  Tables<"tours">,
  "id" | "title" | "duration" | "duration_category" | "price" | "difficulty" | "zone" | "description" | "emoji"
>;

export type TourDetails = Pick<
  Tables<"tours">,
  "id" | "title" | "duration" | "price" | "difficulty" | "zone" | "description" | "includes" | "emoji"
>;

export type TourCardData = Pick<Tables<"tours">, "duration" | "zone" | "title" | "description" | "price">;

const difficultyColors: Record<string, string> = {
  Easy: "bg-seafoam/30 text-forest",
  Medium: "bg-amber-100 text-amber-800",
  Hard: "bg-red-100 text-red-700",
};

export const difficultyClass = (difficulty: string) =>
  difficultyColors[difficulty] || "bg-muted text-foreground";
