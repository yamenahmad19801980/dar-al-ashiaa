import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  WifiOff,
  Wifi,
  RotateCcw,
  Users,
  Smartphone,
  Maximize2,
  FileCheck2,
  ShieldAlert,
  Send,
  MessageSquare,
  Settings,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { demoStore } from '../../store/demoStore';
import { useT } from '../../i18n';

interface PresenterToolbarProps {
  onOpenStaffConsole: () => void;
}

export const PresenterToolbar: React.FC<PresenterToolbarProps> = ({
  onOpenStaffConsole,
}) => {
  const { lang, toggleLang } = useT();
  const [isExpanded, setIsExpanded] = useState(false);
  const state = demoStore.getState();

  const handleTriggerReportReadyMona = () => {
    // Scene 2 simulation: R-501 Mona Adel
    demoStore.releaseReport('R-501', 'System (Portal Integration)');
  };

  const handleTriggerReportReadyKarim = () => {
    // Scene 5 simulation: R-504 Karim Hassan (consented to Dr. Rania)
    demoStore.releaseReport('R-504', 'System (Portal Integration)');
  };

  const handleAdvanceTime = () => {
    demoStore.advanceClock(30);
  };

  const handleToggleOffline = () => {
    demoStore.setOffline(!state.phoneOffline);
  };

  const handleReset = () => {
    if (window.confirm('إعادة ضبط جميع البيانات الأولية التجريبية؟')) {
      demoStore.resetDemo();
    }
  };

  return (
    <div className="fixed top-2 start-2 end-2 z-50 flex flex-col items-center">
      {/* Compact Floating Bar */}
      <div className="bg-[#252750]/95 backdrop-blur-md text-white border border-[#D0AE29]/60 rounded-2xl px-3 py-2 shadow-xl flex items-center justify-between gap-2 max-w-lg w-full text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#D0AE29] text-[#252750] font-black text-xs flex items-center justify-center">
            DA
          </div>
          <div className="hidden sm:block text-start">
            <span className="font-bold text-[11px] text-[#D0AE29] block leading-none">
              دار الأشعة · منصة العرض التجريبي
            </span>
            <span className="text-[9px] text-white/70">
              {state.phoneOffline ? '⚠️ الهاتف غير متصل' : '🟢 المحاكاة نشطة'} · ساعة العرض: +{state.demoClockOffsetMinutes} د
            </span>
          </div>
        </div>

        {/* Quick action pill buttons */}
        <div className="flex items-center gap-1.5">
          {/* Staff Console Drawer trigger */}
          <button
            onClick={onOpenStaffConsole}
            className="py-1 px-2.5 bg-[#D0AE29] hover:bg-[#D0AE29]/90 text-[#252750] font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">شاشة الكونسول</span>
          </button>

          {/* Report Ready Trigger */}
          <button
            onClick={handleTriggerReportReadyMona}
            title="محاكاة: وصول التقرير الطبي لمنى عادل"
            className="py-1 px-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-[#D0AE29]" />
            <span className="hidden sm:inline">تقرير جاهز</span>
          </button>

          {/* Toggle Expand for more controls */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="عرض أدوات المحاكاة"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Simulation Drawer */}
      {isExpanded && (
        <div className="mt-2 bg-white border border-[#D9DBE6] rounded-2xl p-4 shadow-2xl max-w-lg w-full text-xs text-[#252750] animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#D9DBE6]">
            <span className="font-bold text-xs text-[#252750] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D0AE29]" />
              <span>أدوات محاكاة سيناريوهات العرض (Demo Script Controls)</span>
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[#5B607A] hover:text-[#252750] text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-start">
            {/* 1. Report Ready (Mona) */}
            <button
              onClick={() => {
                handleTriggerReportReadyMona();
                setIsExpanded(false);
              }}
              className="p-2.5 rounded-xl border border-[#D9DBE6] hover:border-[#1E7A55] hover:bg-[#1E7A55]/5 text-start transition-colors"
            >
              <div className="font-bold text-[#1E7A55] flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>تقرير جاهز (منى عادل)</span>
              </div>
              <div className="text-[10px] text-[#5B607A] mt-0.5">
                محاكاة Webhook البوابة وتسليم النتيجة بالباركود
              </div>
            </button>

            {/* 2. Advance Time +30m */}
            <button
              onClick={handleAdvanceTime}
              className="p-2.5 rounded-xl border border-[#D9DBE6] hover:border-[#A15C00] hover:bg-[#A15C00]/5 text-start transition-colors"
            >
              <div className="font-bold text-[#A15C00] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>تقديم الوقت +٣٠ دقيقة</span>
              </div>
              <div className="text-[10px] text-[#5B607A] mt-0.5">
                اختبار عداد SLA وتحول الحالات لمعرّض للتأخير
              </div>
            </button>

            {/* 3. Offline Mode */}
            <button
              onClick={handleToggleOffline}
              className={`p-2.5 rounded-xl border text-start transition-colors ${
                state.phoneOffline
                  ? 'border-[#B3261E] bg-[#B3261E]/10 text-[#B3261E]'
                  : 'border-[#D9DBE6] hover:border-[#B3261E] hover:bg-slate-50'
              }`}
            >
              <div className="font-bold flex items-center gap-1">
                {state.phoneOffline ? <WifiOff className="w-3.5 h-3.5 text-[#B3261E]" /> : <Wifi className="w-3.5 h-3.5 text-[#1E7A55]" />}
                <span>{state.phoneOffline ? 'إنهاء وضع عدم الاتصال' : 'محاكاة انقطاع الاتصال'}</span>
              </div>
              <div className="text-[10px] text-[#5B607A] mt-0.5">
                اختبار حفظ وإرسال الرسائل في قائمة الانتظار
              </div>
            </button>

            {/* 4. Switch to Doctor View */}
            <button
              onClick={() => {
                demoStore.switchUser('dr-rania', 'doctor');
                setIsExpanded(false);
              }}
              className="p-2.5 rounded-xl border border-[#D9DBE6] hover:border-[#252750] hover:bg-[#252750]/5 text-start transition-colors"
            >
              <div className="font-bold text-[#252750] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#D0AE29]" />
                <span>تبديل: طبيب محوّل (د. رانيا)</span>
              </div>
              <div className="text-[10px] text-[#5B607A] mt-0.5">
                معاينة واجهة الأطباء والتحويلات والنتائج
              </div>
            </button>
          </div>

          {/* Quick Switch Patient Options */}
          <div className="mt-3 pt-2.5 border-t border-[#D9DBE6] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-[11px] text-[#5B607A]">
              <span>تبديل المريض:</span>
              <button
                onClick={() => demoStore.switchUser('pt-mona', 'patient')}
                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                  state.currentUserId === 'pt-mona' ? 'bg-[#252750] text-white' : 'bg-[#E7E8F2] text-[#252750]'
                }`}
              >
                منى عادل
              </button>
              <button
                onClick={() => demoStore.switchUser('pt-ahmed', 'patient')}
                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                  state.currentUserId === 'pt-ahmed' ? 'bg-[#252750] text-white' : 'bg-[#E7E8F2] text-[#252750]'
                }`}
              >
                أحمد سمير
              </button>
              <button
                onClick={() => demoStore.switchUser('pt-salma', 'patient')}
                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                  state.currentUserId === 'pt-salma' ? 'bg-[#252750] text-white' : 'bg-[#E7E8F2] text-[#252750]'
                }`}
              >
                سلمى فتحي
              </button>
            </div>

            {/* Reset Seed Button */}
            <button
              onClick={handleReset}
              className="text-[11px] text-[#B3261E] hover:underline font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط البيانات الأولية</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
