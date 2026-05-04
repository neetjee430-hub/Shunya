import { useState } from "react";
import { Minus, Plus, RefreshCw } from "lucide-react";

interface Props {
  weight: number;
  onChange: (w: number) => void;
}

export function WeightInput({ weight, onChange }: Props) {
  const adjust = (amount: number) => {
    const newVal = Math.max(0.1, Math.min(50, weight + amount));
    onChange(Number(newVal.toFixed(1)));
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-gray-800">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Measured Weight</p>
      
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => adjust(-0.1)}
          className="h-16 w-16 bg-gray-800 rounded-2xl flex items-center justify-center text-white active:bg-gray-700 active:scale-95 transition-all"
        >
          <Minus size={24} />
        </button>

        <div className="flex-1 text-center">
          <div className="text-5xl font-black text-white tabular-nums">
            {weight.toFixed(1)} <span className="text-xl text-green-500">kg</span>
          </div>
        </div>

        <button 
          onClick={() => adjust(0.1)}
          className="h-16 w-16 bg-gray-800 rounded-2xl flex items-center justify-center text-white active:bg-gray-700 active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <button 
        onClick={() => onChange(0.0)}
        className="w-full mt-6 py-3 bg-gray-800 text-gray-400 font-bold rounded-xl flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
      >
        <RefreshCw size={14} /> Zero Reset
      </button>
    </div>
  );
}
