import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone, Maximize2 } from 'lucide-react';
import { demoStore } from '../../store/demoStore';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [frameMode, setFrameMode] = useState(demoStore.getState().frameMode);
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setFrameMode(demoStore.getState().frameMode);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  if (frameMode === 'fullscreen') {
    return (
      <div className="min-h-screen w-full bg-[#F5F6FA] flex flex-col mx-auto max-w-md shadow-2xl relative">
        {children}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-2 sm:p-6 min-h-screen bg-slate-900/90 overflow-x-hidden">
      {/* Outer Phone Shell */}
      <div className="relative w-full max-w-[400px] h-[852px] bg-black rounded-[52px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)] border-[4px] border-slate-700/60 flex flex-col transition-all">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-2 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#1F5FAD]/40" />
        </div>

        {/* Screen Bezel Content */}
        <div className="w-full h-full bg-[#F5F6FA] rounded-[42px] overflow-hidden flex flex-col relative">
          {/* Status Bar */}
          <div className="h-11 pt-2.5 px-6 flex items-center justify-between text-xs font-semibold text-[#252750] z-40 select-none bg-transparent">
            <span className="font-mono text-[13px] tracking-tight" dir="ltr">
              {currentTime}
            </span>
            <div className="flex items-center gap-1.5" dir="ltr">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono">98%</span>
                <Battery className="w-4 h-4 fill-current" />
              </div>
            </div>
          </div>

          {/* Main App Canvas */}
          <div className="flex-1 overflow-hidden flex flex-col relative">
            {children}
          </div>

          {/* Bottom Home Indicator */}
          <div className="h-5 flex items-center justify-center bg-white/70 backdrop-blur-xs select-none">
            <div className="w-32 h-1 bg-slate-400/80 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
