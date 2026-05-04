import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { WeightInput } from './WeightInput';
import { GradeButtons } from './GradeButtons';
import { GradeType } from '@/src/types';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export function DriverScanView({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<'SCANNING' | 'READY' | 'SUCCESS'>('SCANNING');
  const [scannedHousehold, setScannedHousehold] = useState<any>(null);
  const [weight, setWeight] = useState(1.4);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (state === 'SCANNING') {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 15, qrbox: { width: 250, height: 250 } },
        false
      );
      
      scannerRef.current.render(
        (decodedText) => {
          console.log('Scanned:', decodedText);
          // Simplified simulation:
          setScannedHousehold({
            name: "Priya Sharma",
            flat: "Flat 204",
            lastGrades: ['BEST', 'GOOD', 'BEST']
          });
          setState('READY');
          scannerRef.current?.clear();
        },
        (error) => {
          // console.warn(error);
        }
      );
    }

    return () => {
      scannerRef.current?.clear();
    };
  }, [state]);

  const handleGradeSelect = async (grade: GradeType) => {
    setState('SUCCESS');
    // In real app: POST /api/collect
    setTimeout(() => {
      setState('SCANNING');
      setScannedHousehold(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-gray-950 z-[100] flex flex-col text-white sans-serif overflow-hidden">
      <header className="p-6 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 font-bold uppercase text-xs">
          <ArrowLeft size={16} /> End Route
        </button>
        <div className="bg-green-500/10 text-green-500 px-4 py-1 rounded-full text-xs font-black italic">
          12 / 78 COLLECTED
        </div>
      </header>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {state === 'SCANNING' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              <div id="qr-reader" className="rounded-3xl overflow-hidden border-2 border-dashed border-gray-700 bg-gray-900 aspect-square"></div>
              <div className="mt-auto py-12 text-center">
                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] animate-pulse">Scan Resident QR</p>
              </div>
            </motion.div>
          )}

          {state === 'READY' && (
            <motion.div
              key="ready"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
                <h2 className="text-3xl font-black">{scannedHousehold.name}</h2>
                <p className="text-green-500 font-bold text-lg uppercase">{scannedHousehold.flat}</p>
                <div className="flex gap-2 mt-4">
                   {scannedHousehold.lastGrades.map((g: any, i: number) => (
                     <div key={i} className="h-2 w-8 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full w-full ${g === 'BEST' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                     </div>
                   ))}
                </div>
              </div>

              <WeightInput weight={weight} onChange={setWeight} />
              
              <GradeButtons onGradeSelect={handleGradeSelect} weight={weight} />
            </motion.div>
          )}

          {state === 'SUCCESS' && (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="h-32 w-32 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(34,197,94,0.4)]">
                 <CheckCircle2 size={64} className="text-white" />
              </div>
              <h2 className="text-4xl font-black mt-8">SUCCESS!</h2>
              <p className="text-green-500 text-xl font-bold mt-2">+48 CREDITS AWARDED</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
