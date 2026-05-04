import { motion } from "motion/react";

interface Props {
  currentStreak: number;
}

export function StreakTracker({ currentStreak }: Props) {
  const nextMilestone = currentStreak < 4 ? 4 : currentStreak < 8 ? 8 : 12;
  const progress = (currentStreak / nextMilestone) * 100;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="bg-orange-100 p-4 rounded-2xl">
          <span className="text-3xl">🔥</span>
        </div>
        <div>
          <h3 className="font-bold text-lg">Your Green Streak</h3>
          <p className="text-gray-500 text-sm">
            {currentStreak > 0 
              ? `${currentStreak} weeks across Lucknow!`
              : "Start your streak today!"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          <span>{currentStreak} weeks</span>
          <span>Goal: {nextMilestone} weeks</span>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-orange-500 rounded-full"
          />
        </div>
        <p className="text-sm text-center mt-4 text-orange-600 font-medium">
          {nextMilestone - currentStreak} weeks to your next bonus! 🎁
        </p>
      </div>
    </div>
  );
}
