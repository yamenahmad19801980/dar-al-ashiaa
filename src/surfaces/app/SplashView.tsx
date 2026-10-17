import React, { useEffect } from 'react';

interface SplashViewProps {
  onComplete: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 bg-[#252750] flex flex-col items-center justify-center p-6 text-white text-center select-none relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-[#3B3F7A]/30 blur-3xl -top-10 -end-10 pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-[#D0AE29]/10 blur-3xl -bottom-10 -start-10 pointer-events-none" />

      {/* Signature Logo Frame with Gold Corner Accents */}
      <div className="relative p-6 mb-6">
        {/* Logo Icon Graphic */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3B3F7A] to-[#252750] border-2 border-[#D0AE29] flex items-center justify-center shadow-xl relative">
          {/* Inner radiology beam lines */}
          <div className="w-10 h-10 border border-[#D0AE29]/60 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-[#D0AE29] rounded-full flex items-center justify-center text-[#252750] font-black text-xs">
              DA
            </div>
          </div>
        </div>

        {/* Decorative corner brackets around emblem */}
        <div className="absolute top-2 start-2 w-4 h-4 border-t-2 border-s-2 border-[#D0AE29]" />
        <div className="absolute top-2 end-2 w-4 h-4 border-t-2 border-e-2 border-[#D0AE29]" />
        <div className="absolute bottom-2 start-2 w-4 h-4 border-b-2 border-s-2 border-[#D0AE29]" />
        <div className="absolute bottom-2 end-2 w-4 h-4 border-b-2 border-e-2 border-[#D0AE29]" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5 font-sans">
        دار الأشعة
      </h1>
      <div className="text-xs text-[#D0AE29] font-medium tracking-wide">
        DAR EL ASHAA RADIOLOGY
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-white/60">
        <div className="w-1.5 h-1.5 rounded-full bg-[#D0AE29] animate-pulse" />
        <span>الإسكندرية · جمهورية مصر العربية</span>
      </div>
    </div>
  );
};
