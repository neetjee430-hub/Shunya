import { QRCodeSVG } from "qrcode.react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Props {
  qrPayload: string;
  residentName: string;
  flatNumber: string;
}

export function QRCodeDisplay({ qrPayload, residentName, flatNumber }: Props) {
  const [expiresIn, setExpiresIn] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      
      setExpiresIn(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white p-8 rounded-[40px] shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-gray-900">{residentName}</h2>
        <p className="text-green-600 font-bold uppercase tracking-widest text-sm">{flatNumber}</p>
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative p-6 bg-white border-4 border-green-500 rounded-[32px]"
      >
        <QRCodeSVG value={qrPayload} size={220} />
      </motion.div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-1">Daily Access Token</p>
        <p className="text-gray-900 font-mono font-bold text-lg">
          Expires in: <span className="text-orange-500">{expiresIn}</span>
        </p>
      </div>

      <p className="mt-12 text-gray-500 text-center text-sm px-8 leading-relaxed">
        Show this code to your BioLoop collector. Do not share your static token.
      </p>
    </div>
  );
}
