import React, { useState } from 'react';
import { Message, PortalReport } from '../../data/types';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';
import { ResultsCard } from './ResultsCard';
import { SlotOfferCard } from './SlotOfferCard';
import { FormCard } from './FormCard';
import { Check, CheckCheck, Clock, Play, Pause, Star, Lock } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  currentUserId: string;
  isStaffView?: boolean;
  onMenuClick?: (option: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUserId,
  isStaffView = false,
  onMenuClick,
}) => {
  const { lang, t } = useT();
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Hidden internal notes for patients
  if (message.kind === 'internal_note' && !isStaffView) {
    return null;
  }

  // System Events
  if (message.kind === 'system_event') {
    return (
      <div className="my-3 flex items-center gap-3 px-4">
        <div className="flex-1 h-px bg-[#D9DBE6]" />
        <span className="text-[11px] text-[#5B607A] font-medium text-center">
          {lang === 'ar' ? message.textAr || message.textEn : message.textEn}
        </span>
        <div className="flex-1 h-px bg-[#D9DBE6]" />
      </div>
    );
  }

  // Internal Note (Staff only)
  if (message.kind === 'internal_note') {
    return (
      <div className="my-2.5 p-3 rounded-xl bg-[#F3E7B8] border border-[#D0AE29]/40 text-start text-xs text-[#252750]">
        <div className="flex items-center gap-1.5 font-bold text-[#8A6D12] mb-1">
          <Lock className="w-3.5 h-3.5" />
          <span>ملاحظة داخلية (يراها الفريق الطبي فقط) · Internal Note</span>
        </div>
        <p className="leading-relaxed">
          {lang === 'ar' ? message.textAr || message.textEn : message.textEn}
        </p>
        <span className="text-[10px] text-[#8A6D12]/80 mt-1 block" dir="ltr">
          {message.timestamp}
        </span>
      </div>
    );
  }

  // Results Card
  if (message.kind === 'results_card') {
    const report = demoStore
      .getState()
      .portalReports.find((r) => r.id === message.reportId) || demoStore.getState().portalReports[2];
    return (
      <div className="flex justify-start my-2">
        <ResultsCard report={report} />
      </div>
    );
  }

  // Slot Offer Card
  if (message.kind === 'slot_offer') {
    return (
      <div className="flex justify-start my-2">
        <SlotOfferCard
          caseId={message.caseId || 'BK-1042'}
          dayAr={message.slotDayAr}
          dayEn={message.slotDayEn}
          time={message.slotTime}
          branchId={message.slotBranchId}
          status={message.slotStatus}
          isStaffView={isStaffView}
        />
      </div>
    );
  }

  // Form Card
  if (message.kind === 'form_card') {
    const isOutgoing = message.from === 'patient' || message.from === 'doctor';
    return (
      <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} my-2`}>
        <FormCard
          form={message.form || 'booking'}
          caseId={message.caseId}
          formData={message.formData}
          timestamp={message.timestamp}
        />
      </div>
    );
  }

  // Rating Request Card
  if (message.kind === 'rating_request') {
    return (
      <div className="my-3 p-4 bg-white rounded-2xl border border-[#D9DBE6] shadow-sm max-w-sm mx-auto text-center text-[#252750]">
        <h5 className="font-bold text-sm mb-1">{t('rate_service_title')}</h5>
        <p className="text-xs text-[#5B607A] mb-3">{t('rate_service_desc')}</p>
        <div className="flex justify-center items-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => {
                setSelectedRating(star);
                if (message.caseId) {
                  demoStore.rateCase(message.caseId, star);
                }
              }}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`w-7 h-7 ${
                  (selectedRating !== null && star <= selectedRating) || (message.rating && star <= message.rating)
                    ? 'fill-[#D0AE29] text-[#D0AE29]'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
        {selectedRating && (
          <div className="text-xs text-[#1E7A55] font-semibold">
            {lang === 'ar' ? 'شكراً لتقييمكم!' : 'Thank you for your rating!'}
          </div>
        )}
      </div>
    );
  }

  // Menu Message (Interactive Greeting Menu)
  if (message.kind === 'menu') {
    const isDoctor = demoStore.getState().currentUserType === 'doctor';
    const patientButtons = [
      { id: 'book', labelAr: 'حجز أشعة جديدة', labelEn: 'Book a new scan' },
      { id: 'results', labelAr: 'نتائجي', labelEn: 'My results' },
      { id: 'issue', labelAr: 'الإبلاغ عن مشكلة', labelEn: 'Report an issue' },
      { id: 'prep', labelAr: 'الأسعار والتحضير', labelEn: 'Prices and preparation' },
      { id: 'support', labelAr: 'التحدث مع فريقنا', labelEn: 'Talk to our team' },
    ];
    const doctorButtons = [
      { id: 'new_referral', labelAr: 'تحويل جديد', labelEn: 'New referral' },
      { id: 'referral_status', labelAr: 'حالة التحويلات', labelEn: 'Referral status' },
      { id: 'report_question', labelAr: 'سؤال عن تقرير', labelEn: 'Question about a report' },
      { id: 'doctor_relations', labelAr: 'التحدث مع علاقات الأطباء', labelEn: 'Talk to doctor relations' },
    ];
    const buttons = isDoctor ? doctorButtons : patientButtons;

    return (
      <div className="my-2 max-w-xs w-full text-start">
        <div className="bg-white rounded-2xl p-4 border border-[#D9DBE6] shadow-xs text-[#252750]">
          <div className="text-[10px] font-semibold text-[#8A6D12] bg-[#F3E7B8] px-2 py-0.5 rounded-md w-fit mb-2">
            {lang === 'ar' ? 'خدمة الرد الآلي المباشر' : 'Automated Greeting'}
          </div>
          <p className="text-xs leading-relaxed mb-3">
            {lang === 'ar' ? message.textAr || message.textEn : message.textEn}
          </p>

          <div className="space-y-1.5">
            {buttons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => onMenuClick && onMenuClick(btn.id)}
                className="w-full text-start py-2 px-3 text-xs font-semibold rounded-xl border border-[#252750]/20 hover:border-[#252750] hover:bg-[#E7E8F2]/50 text-[#252750] transition-colors active:scale-98 flex items-center justify-between"
              >
                <span>{lang === 'ar' ? btn.labelAr : btn.labelEn}</span>
                <span className="text-[#D0AE29] font-bold">›</span>
              </button>
            ))}
          </div>
        </div>
        <span className="text-[10px] text-[#5B607A] mt-1 block px-2" dir="ltr">
          {message.timestamp}
        </span>
      </div>
    );
  }

  // Menu Reply Chip
  if (message.kind === 'menu_reply') {
    return (
      <div className="flex justify-end my-1">
        <div className="bg-[#E7E8F2] text-[#252750] font-semibold text-xs py-1.5 px-3.5 rounded-full border border-[#D9DBE6] shadow-xs">
          {lang === 'ar' ? message.textAr || message.textEn : message.textEn}
        </div>
      </div>
    );
  }

  // Standard Chat Bubbles (Text & Voice)
  const isPatientOrDoc = message.from === 'patient' || message.from === 'doctor';
  const isOutgoing = isStaffView ? !isPatientOrDoc : isPatientOrDoc;

  return (
    <div className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'} my-1.5`}>
      {/* Staff sender identification for patient */}
      {!isOutgoing && message.from === 'staff' && (
        <span className="text-[10px] font-medium text-[#5B607A] mb-1 px-1">
          {message.staffId === 'st-nour'
            ? 'نور حمدي (فريق الحجوزات)'
            : message.staffId === 'st-omar'
            ? 'عمر خالد (فريق النتائج)'
            : 'فريق دار الأشعة'}
        </span>
      )}

      <div
        className={`relative max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs text-start leading-relaxed shadow-xs ${
          isOutgoing
            ? 'bg-[#252750] text-white rounded-ee-sm'
            : 'bg-white text-[#252750] border border-[#D9DBE6] rounded-es-sm'
        }`}
        dir="auto"
      >
        {/* Voice Note Simulation */}
        {message.kind === 'voice' ? (
          <div className="flex items-center gap-2.5 min-w-[140px]">
            <button
              onClick={() => setIsPlayingVoice(!isPlayingVoice)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isOutgoing ? 'bg-[#D0AE29] text-[#252750]' : 'bg-[#252750] text-white'
              }`}
            >
              {isPlayingVoice ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ms-0.5" />}
            </button>
            <div className="flex-1">
              <div className="h-1 bg-current opacity-30 rounded-full w-full" />
              <div className="text-[10px] opacity-75 mt-0.5" dir="ltr">
                {message.voiceDuration || '0:12'}
              </div>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">
            {lang === 'ar' ? message.textAr || message.textEn : message.textEn}
          </p>
        )}

        {/* Timestamp and Status Tick */}
        <div
          className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
            isOutgoing ? 'text-white/70' : 'text-[#5B607A]'
          }`}
          dir="ltr"
        >
          <span>{message.timestamp}</span>
          {isOutgoing && (
            <span>
              {message.status === 'sending' && <Clock className="w-3 h-3 text-white/50" />}
              {message.status === 'sent' && <Check className="w-3 h-3 text-white/70" />}
              {message.status === 'delivered' && <CheckCheck className="w-3 h-3 text-white/80" />}
              {message.status === 'read' && <CheckCheck className="w-3 h-3 text-[#D0AE29]" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
