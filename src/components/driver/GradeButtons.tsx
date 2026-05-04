import { GradeType } from "@/src/types";
import { calculateCredits, GRADE_COLORS } from "../../lib/credits/calculator";
import { cn } from "../../lib/utils";

interface Props {
  onGradeSelect: (grade: GradeType) => void;
  weight: number;
  isSubmitting?: boolean;
}

export function GradeButtons({ onGradeSelect, weight, isSubmitting }: Props) {
  const grades: { id: GradeType; emoji: string; label: string; rate: string }[] = [
    { id: 'BEST', emoji: '🟢', label: 'BEST', rate: '40 pts/kg' },
    { id: 'GOOD', emoji: '🟡', label: 'GOOD', rate: '30 pts/kg' },
    { id: 'AVERAGE', emoji: '🟠', label: 'AVG', rate: '15 pts/kg' },
    { id: 'REJECT', emoji: '🔴', label: 'REJECT', rate: 'Return Waste' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {grades.map((g) => (
        <button
          key={g.id}
          disabled={isSubmitting}
          onClick={() => onGradeSelect(g.id)}
          className={cn(
            "h-40 rounded-[32px] flex flex-col items-center justify-center gap-2 p-4 transition-all active:scale-95",
            GRADE_COLORS[g.id],
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="text-4xl">{g.emoji}</span>
          <span className="text-white font-black text-xl italic">{g.label}</span>
          <p className="text-white/80 font-bold text-xs uppercase tracking-wider bg-black/10 px-3 py-1 rounded-full text-center">
            {g.id === 'REJECT' ? g.rate : `+${calculateCredits(weight, g.id)} pts`}
          </p>
        </button>
      ))}
    </div>
  );
}
