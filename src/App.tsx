import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, QrCode, History, Trophy, ShoppingBag, LayoutDashboard, Truck, Leaf, ShieldCheck } from 'lucide-react';
import { CreditBalanceCard } from './components/household/CreditBalanceCard';
import { StreakTracker } from './components/household/StreakTracker';
import { QRCodeDisplay } from './components/household/QRCodeDisplay';
import { DriverScanView } from './components/driver/DriverScanView';
import { cn } from './lib/utils';
import { firestoreService } from './lib/firestoreService';
import { CreditWallet } from './types';

type View = 'DASHBOARD' | 'QR' | 'HISTORY' | 'LEADERBOARD' | 'SHOP' | 'DRIVER' | 'ADMIN' | 'LOGIN';

export default function App() {
  const [view, setView] = useState<View>('LOGIN');
  const [user, setUser] = useState<{ id: string, name: string, flat: string } | null>(null);
  const [wallet, setWallet] = useState<CreditWallet | null>(null);

  useEffect(() => {
    if (user) {
      // Real-time wallet sync
      const unsubscribe = firestoreService.subscribeToWallet(user.id, (updatedWallet) => {
        setWallet(updatedWallet);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogin = () => {
    // Simulated Login
    setUser({
      id: 'household_123',
      name: 'Priya Sharma',
      flat: 'Flat 204, Vasant Vihar'
    });
    setWallet({
      id: 'wallet_123',
      household_id: 'household_123',
      balance: 480,
      lifetime_earned: 1240,
      current_streak_weeks: 3,
      updated_at: new Date().toISOString()
    });
    setView('DASHBOARD');
  };

  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-8 max-w-sm w-full"
        >
          <div className="flex flex-col items-center">
             <div className="h-20 w-20 bg-green-600 rounded-3xl flex items-center justify-center text-white mb-4 shadow-2xl">
                <Leaf size={40} />
             </div>
             <h1 className="text-4xl font-black text-green-900 tracking-tighter">BioLoop</h1>
             <p className="text-green-700 font-bold mt-2 italic px-4">कचरे को बदलो, पैसे बचाओ 🌿</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-green-100">
            <div className="space-y-4">
              <div className="text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label>
                <div className="mt-1 flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
                  <span className="text-gray-400 font-bold mr-2">+91</span>
                  <input type="tel" disabled className="bg-transparent outline-none font-bold text-lg w-full" value="9876543210" />
                </div>
              </div>
              <button 
                onClick={handleLogin}
                className="w-full bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-200 active:scale-95 transition-all text-lg"
              >
                Launch Platform
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-6 font-medium leading-relaxed">
              By continuing, you agree to transform North India into a cleaner, greener habitat.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'DRIVER') {
    return <DriverScanView onBack={() => setView('DASHBOARD')} />;
  }

  const renderView = () => {
    switch (view) {
      case 'DASHBOARD':
        return (
          <div className="space-y-6">
            <header className="flex justify-between items-center py-4">
              <div>
                <h2 className="text-gray-500 text-sm font-medium">{getGreetingTime()}, {user?.name.split(' ')[0]}!</h2>
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  Welcome Back <span className="animate-wave inline-block">🌿</span>
                </h1>
              </div>
              <div className="h-12 w-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                👤
              </div>
            </header>
            
            {wallet && (
              <CreditBalanceCard 
                balance={wallet.balance} 
                lifetimeEarned={wallet.lifetime_earned} 
                streakWeeks={wallet.current_streak_weeks} 
                totalKg={34.2} 
              />
            )}
            
            {wallet && <StreakTracker currentStreak={wallet.current_streak_weeks} />}
            
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-lg uppercase tracking-tight">Next Collection</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Lucknow Route</span>
              </div>
              <div className="bg-white border border-gray-100 p-5 rounded-[2rem] flex justify-between items-center shadow-sm">
                <div className="flex gap-4 items-center">
                  <div className="bg-green-500 p-3 rounded-2xl text-white">
                    <Home size={20} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold">Tomorrow Morning</p>
                    <p className="text-gray-400 text-sm font-medium">7:30 AM — 9:30 AM</p>
                  </div>
                </div>
                <button className="bg-green-50 p-2.5 rounded-xl text-green-600 active:scale-90 transition-transform">
                  🔔
                </button>
              </div>
            </section>

            <section className="bg-gray-900 rounded-[2.5rem] p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-green-500" size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Verified Impact</span>
                </div>
                <h3 className="text-xl font-black mb-1 italic">17.1 kg CO₂ Saved</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">You have officially prevented methane emissions equivalent to driving 84km.</p>
              </div>
              <Leaf size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
            </section>
          </div>
        );
      case 'QR':
        return (
          <div className="py-6 h-full flex flex-col">
            <h1 className="text-2xl font-black mb-1">Scan to Collect</h1>
            <p className="text-gray-400 text-sm mb-6 font-medium font-hindi">दिखाएँ अपना BioLoop कोड</p>
            <QRCodeDisplay 
              qrPayload={JSON.stringify({ hid: user?.id, t: 'daily-token-xyz' })}
              residentName={user?.name || ''}
              flatNumber={user?.flat || ''}
            />
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 p-6">
            <div className="text-7xl animate-bounce">🏗️</div>
            <div>
              <h2 className="text-2xl font-black">Under Construction</h2>
              <p className="text-gray-500 mt-2 max-w-[200px] mx-auto leading-relaxed">This module is being connected to the Firebase ecosystem.</p>
            </div>
            <button onClick={() => setView('DASHBOARD')} className="bg-gray-100 text-gray-900 font-bold px-6 py-2 rounded-xl">Back Home</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 text-gray-950 font-sans selection:bg-green-100 antialiased overflow-x-hidden">
      <div className="max-w-md mx-auto px-6 pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 safe-area-inset-bottom">
        <NavItem 
          active={view === 'DASHBOARD'} 
          icon={<Home size={22} />} 
          label="Home" 
          onClick={() => setView('DASHBOARD')} 
        />
        <NavItem 
          active={view === 'QR'} 
          icon={<QrCode size={22} />} 
          label="QR Code" 
          onClick={() => setView('QR')} 
        />
        <NavItem 
          active={view === 'HISTORY'} 
          icon={<History size={22} />} 
          label="History" 
          onClick={() => setView('HISTORY')} 
        />
        <NavItem 
          active={view === 'LEADERBOARD'} 
          icon={<Trophy size={22} />} 
          label="Ranks" 
          onClick={() => setView('LEADERBOARD')} 
        />
        <NavItem 
          active={view === 'SHOP'} 
          icon={<ShoppingBag size={22} />} 
          label="Shop" 
          onClick={() => setView('SHOP')} 
        />
      </nav>
      
      {/* Dev Role Switcher */}
      <div className="fixed top-4 right-4 flex gap-1 z-[60]">
         <div className="bg-black/80 backdrop-blur-md rounded-2xl p-1.5 flex gap-1.5 shadow-2xl border border-white/10">
            <button 
              onClick={() => setView('DASHBOARD')} 
              className={cn("p-2 rounded-xl transition-all", view === 'DASHBOARD' ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "text-white/40 hover:text-white")}
            >
              <Home size={18}/>
            </button>
            <button 
              onClick={() => setView('DRIVER')} 
              className={cn("p-2 rounded-xl transition-all", view === 'DRIVER' ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "text-white/40 hover:text-white")}
            >
              <Truck size={18}/>
            </button>
            <button 
              onClick={() => setView('ADMIN')} 
              className={cn("p-2 rounded-xl transition-all", view === 'ADMIN' ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "text-white/40 hover:text-white")}
            >
              <LayoutDashboard size={18}/>
            </button>
         </div>
      </div>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean, icon: ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 transition-all duration-300 relative",
        active ? "text-green-600" : "text-gray-400"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-2xl transition-all duration-300",
        active ? "bg-green-500 text-white shadow-[0_8px_16px_rgba(34,197,94,0.2)]" : ""
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-[9px] uppercase font-black tracking-widest leading-none transition-opacity",
        active ? "opacity-100" : "opacity-0"
      )}>
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute -bottom-3 w-1 h-1 bg-green-500 rounded-full"
        />
      )}
    </button>
  );
}

function getGreetingTime() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}
