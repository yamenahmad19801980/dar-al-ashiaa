import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Clock3, RotateCcw } from 'lucide-react';
import { demoStore } from '../../store/demoStore';
import { useT } from '../../i18n';
import confetti from 'canvas-confetti';

interface SlotOfferCardProps {
  caseId: string;
  dayEn?: string;
  dayAr?: string;
  time?: string;
  branchId?: string;
  status?: 'pending' | 'confirmed' | 'declined';
  isStaffView?: boolean;
}

export const SlotOfferCard: React.FC<SlotOfferCardProps> = ({
  caseId,
  dayEn,
  dayAr,
  time,
  branchId,
  status = 'pending',
  isStaffView = false,
}) => {
  const { t, lang } = useT();
  const branches = demoStore.getState().branches;
  const branch = branches.find((b) => b.id === branchId) || branches[1];

  const handleConfirm = () => {
    demoStore.confirmSlot(caseId);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D0AE29', '#252750', '#1E7A55'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleDecline = () => {
    demoStore.declineSlot(caseId);
  };

  return (
    <div className="my-2 max-w-sm w-full bg-white rounded-2xl p-4 border border-[#D9DBE6] shadow-sm text-start text-[#252750]">
      {/* Title */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#D9DBE6]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#252750]">
          <Clock3 className="w-4 h-4 text-[#D0AE29]" />
          <span>{lang === 'ar' ? 'اقتراح موعد للفحص' : 'Slot Offer Proposal'}</span>
        </div>
        <span className="text-[11px] font-mono text-[#5B607A]" dir="ltr">
          {caseId}
        </span>
      </div>

      {/* Details Box */}
      <div className="bg-[#F5F6FA] p-3 rounded-xl space-y-2 text-xs mb-3">
        <div className="flex items-center gap-2 text-[#252750]">
          <Calendar className="w-4 h-4 text-[#3B3F7A] shrink-0" />
          <span className="font-semibold">{lang === 'ar' ? dayAr || dayEn : dayEn}</span>
        </div>
        <div className="flex items-center gap-2 text-[#252750]">
          <Clock className="w-4 h-4 text-[#3B3F7A] shrink-0" />
          <span className="font-semibold" dir="ltr">{time || '10:30 AM'}</span>
        </div>
        <div className="flex items-center gap-2 text-[#5B607A]">
          <MapPin className="w-4 h-4 text-[#3B3F7A] shrink-0" />
          <span>{lang === 'ar' ? branch.nameAr : branch.nameEn}</span>
        </div>
      </div>

      {/* Action Buttons or Status Badge */}
      {status === 'confirmed' ? (
        <div className="flex items-center justify-center gap-2 py-2 px-3 bg-[#1E7A55]/10 text-[#1E7A55] rounded-xl text-xs font-bold">
          <CheckCircle className="w-4 h-4" />
          <span>{lang === 'ar' ? 'تم تأكيد الموعد بنجاح' : 'Appointment Confirmed'}</span>
        </div>
      ) : status === 'declined' ? (
        <div className="flex items-center justify-center gap-2 py-2 px-3 bg-[#A15C00]/10 text-[#A15C00] rounded-xl text-xs font-semibold">
          <RotateCcw className="w-4 h-4" />
          <span>{lang === 'ar' ? 'تم طلب موعد بديل' : 'Alternative Requested'}</span>
        </div>
      ) : isStaffView ? (
        <div className="text-center py-1.5 text-xs text-[#5B607A] bg-[#F5F6FA] rounded-xl font-medium">
          {lang === 'ar' ? 'بانتظار تأكيد المريض...' : 'Waiting for patient confirmation...'}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleConfirm}
            className="py-2.5 px-3 bg-[#252750] hover:bg-[#3B3F7A] text-white font-bold text-xs rounded-xl transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#D0AE29]" />
            <span>{t('confirm')}</span>
          </button>
          <button
            onClick={handleDecline}
            className="py-2.5 px-3 bg-white hover:bg-slate-50 text-[#5B607A] border border-[#D9DBE6] font-medium text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center"
          >
            <span>{lang === 'ar' ? 'اقتراح موعد آخر' : 'Another time'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
