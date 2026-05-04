import { motion } from "motion/react";
import { formatCreditsToRupees } from "../../lib/utils";

interface Props {
  balance: number;
  lifetimeEarned: number;
  streakWeeks: number;
  totalKg: number;
}

export function CreditBalanceCard({ balance, lifetimeEarned, streakWeeks, totalKg }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-green-100 text-sm font-medium uppercase tracking-wider">Available Balance</p>
          <motion.h1 className="text-5xl font-black mt-1">
            {balance}
          </motion.h1>
          <p className="text-green-100 mt-1 opacity-90">
            ≈ {formatCreditsToRupees(balance)} value
          </p>
        </div>
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
          <span className="text-2xl">🌱</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/20">
        <div>
          <p className="text-green-100 text-xs opacity-80 uppercase">Total Waste</p>
          <p className="font-bold">{totalKg} kg</p>
        </div>
        <div>
          <p className="text-green-100 text-xs opacity-80 uppercase">Lifetime</p>
          <p className="font-bold font-mono">{lifetimeEarned} pts</p>
        </div>
      </div>
    </motion.div>
  );
}
