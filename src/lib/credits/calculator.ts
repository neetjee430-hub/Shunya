import { GradeType } from "@/src/types";

export function getMultiplier(grade: GradeType): number {
  switch (grade) {
    case 'BEST': return 4.0;
    case 'GOOD': return 3.0;
    case 'AVERAGE': return 1.5;
    case 'REJECT': return 0.0;
    default: return 0.0;
  }
}

export function calculateCredits(weightKg: number, grade: GradeType): number {
  const multiplier = getMultiplier(grade);
  return Math.round(weightKg * 10 * multiplier);
}

export function getGradeTip(grade: GradeType): string {
  switch (grade) {
    case 'BEST': return "Excellent! Pure citrus/fruit peels are gold for bio-enzymes. 👌";
    case 'GOOD': return "Great work. Mixed veg peels make top-quality cleaning enzymes. 👍";
    case 'AVERAGE': return "Try to remove tea leaves or cooked items for better rewards! 🌿";
    case 'REJECT': return "Only uncooked fruit/veg peels allowed. Dairy/meat ruins the batch. ❌";
    default: return "";
  }
}

export const GRADE_COLORS = {
  BEST: "bg-green-500",
  GOOD: "bg-yellow-400",
  AVERAGE: "bg-orange-400",
  REJECT: "bg-red-500",
};
