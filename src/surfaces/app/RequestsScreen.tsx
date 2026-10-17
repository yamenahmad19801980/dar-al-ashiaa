import React, { useState } from 'react';
import { Clock, CheckCircle2, ChevronRight, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';
import { Case, CaseStage } from '../../data/types';

interface RequestsScreenProps {
  onOpenChat: () => void;
}

export const RequestsScreen: React.FC<RequestsScreenProps> = ({ onOpenChat }) => {
  const { lang, t, isRtl } = useT();
  const state = demoStore.getState();

  const isDoctor = state.currentUserType === 'doctor';
  const currentUserId = state.currentUserId;

  const [tab, setTab] = useState<'open' | 'closed'>('open');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // Filter cases
  const allUserCases = state.cases.filter((c) =>
    isDoctor ? c.doctorId === currentUserId : c.patientId === currentUserId
  );

  const openCases = allUserCases.filter((c) => c.stage !== 'closed');
  const closedCases = allUserCases.filter((c) => c.stage === 'closed');
  const displayedCases = tab === 'open' ? openCases : closedCases;

  // Pipeline stages definitions
  const getStageSteps = (type: Case['type']): { key: CaseStage; labelAr: string; labelEn: string }[] => {
    if (type === 'BK') {
      return [
        { key: 'new', labelAr: 'جديد', labelEn: 'New' },
        { key: 'details-collected', labelAr: 'التفاصيل', labelEn: 'Details' },
        { key: 'slot-offered', labelAr: 'اقتراح موعد', labelEn: 'Slot offered' },
        { key: 'confirmed', labelAr: 'مؤكد', labelEn: 'Confirmed' },
      ];
    }
    if (type === 'RS') {
      return [
        { key: 'new', labelAr: 'جديد', labelEn: 'New' },
        { key: 'identity-verified', labelAr: 'التحقق', labelEn: 'Verified' },
        { key: 'report-located', labelAr: 'تجهيز التقرير', labelEn: 'Located' },
        { key: 'released', labelAr: 'تم الإرسال', labelEn: 'Released' },
      ];
    }
    if (type === 'RF') {
      return [
        { key: 'submitted', labelAr: 'مُرسَل', labelEn: 'Submitted' },
        { key: 'patient-contacted', labelAr: 'تم التواصل', labelEn: 'Contacted' },
        { key: 'booked', labelAr: 'تم الحجز', labelEn: 'Booked' },
        { key: 'scan-done', labelAr: 'تم الفحص', labelEn: 'Scan done' },
        { key: 'report-sent', labelAr: 'إرسال التقرير', labelEn: 'Report sent' },
      ];
    }
    return [
      { key: 'new', labelAr: 'جديد', labelEn: 'New' },
      { key: 'acknowledged', labelAr: 'تم الاستلام', labelEn: 'Acknowledged' },
      { key: 'investigating', labelAr: 'قيد المتابعة', labelEn: 'Investigating' },
      { key: 'resolved', labelAr: 'تم الحل', labelEn: 'Resolved' },
    ];
  };

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col overflow-hidden text-[#252750]">
      {/* Header */}
      <div className="bg-white px-5 pt-3.5 pb-2 border-b border-[#D9DBE6] shadow-xs select-none">
        <h2 className="text-base font-bold text-[#252750]">
          {isDoctor ? t('doctor_quick_my_referrals') : t('requests_title')}
        </h2>
        <p className="text-[11px] text-[#5B607A] mb-3">
          متابعة مراحل التنفيذ والحجز المعتمدة بدقة فورية
        </p>

        {/* Segmented Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-[#F5F6FA] p-1 rounded-xl">
          <button
            onClick={() => setTab('open')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === 'open'
                ? 'bg-white text-[#252750] shadow-xs'
                : 'text-[#5B607A] hover:text-[#252750]'
            }`}
          >
            {t('requests_tab_open')} ({openCases.length})
          </button>
          <button
            onClick={() => setTab('closed')}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === 'closed'
                ? 'bg-white text-[#252750] shadow-xs'
                : 'text-[#5B607A] hover:text-[#252750]'
            }`}
          >
            {t('requests_tab_closed')} ({closedCases.length})
          </button>
        </div>
      </div>

      {/* Case List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {displayedCases.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#5B607A] px-4">
            {t('requests_empty')}
          </div>
        ) : (
          displayedCases.map((c) => {
            const steps = getStageSteps(c.type);
            const currentStepIdx = steps.findIndex((s) => s.key === c.stage);

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className="bg-white rounded-2xl p-4 border border-[#D9DBE6] shadow-xs hover:border-[#252750] cursor-pointer transition-all active:scale-[0.99] text-start"
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#252750] bg-[#E7E8F2] px-2 py-0.5 rounded-md" dir="ltr">
                      {c.id}
                    </span>
                    <span className="text-[11px] font-semibold text-[#5B607A]">
                      {c.type === 'BK'
                        ? 'حجز أشعة'
                        : c.type === 'RS'
                        ? 'طلب نتائج'
                        : c.type === 'RF'
                        ? 'تحويل طبيب'
                        : 'شكوى / استفسار'}
                    </span>
                  </div>

                  {c.rating ? (
                    <div className="flex items-center gap-0.5 text-xs font-bold text-[#D0AE29]">
                      <Star className="w-3.5 h-3.5 fill-[#D0AE29]" />
                      <span>{c.rating}/5</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#5B607A] flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-[#1F5FAD]" />
                      <span>نشط</span>
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-[#252750] mb-3 leading-snug">
                  {lang === 'ar' ? c.summaryAr || c.summary : c.summary}
                </div>

                {/* Compact Horizontal Stepper */}
                <div className="pt-2 border-t border-[#D9DBE6]/60">
                  <div className="flex items-center justify-between relative">
                    {steps.map((step, idx) => {
                      const isDone = currentStepIdx > idx || c.stage === 'closed';
                      const isCurrent = currentStepIdx === idx && c.stage !== 'closed';

                      return (
                        <div key={step.key} className="flex flex-col items-center flex-1 relative">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold z-10 transition-colors ${
                              isDone
                                ? 'bg-[#252750] text-white'
                                : isCurrent
                                ? 'bg-[#D0AE29] text-[#252750] ring-4 ring-[#D0AE29]/20'
                                : 'bg-slate-200 text-[#5B607A]'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-[9px] mt-1 text-center truncate max-w-[50px] ${
                              isCurrent
                                ? 'font-bold text-[#252750]'
                                : 'text-[#5B607A]'
                            }`}
                          >
                            {lang === 'ar' ? step.labelAr : step.labelEn}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Case Details Drawer / Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[85vh] flex flex-col text-[#252750] shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-[#D9DBE6] rounded-full mx-auto mt-3 mb-1" />

            <div className="px-5 py-3 border-b border-[#D9DBE6] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#252750] bg-[#E7E8F2] px-2 py-0.5 rounded-md" dir="ltr">
                  {selectedCase.id}
                </span>
                <h3 className="text-sm font-bold text-[#252750] mt-1">
                  {lang === 'ar' ? selectedCase.summaryAr || selectedCase.summary : selectedCase.summary}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1.5 rounded-full hover:bg-[#F5F6FA] text-[#5B607A]"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-start">
              {/* Status details */}
              <div className="bg-[#F5F6FA] p-3.5 rounded-2xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#5B607A]">المرحلة الحالية:</span>
                  <span className="font-bold text-[#252750]">
                    {selectedCase.stage}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5B607A]">القناة:</span>
                  <span className="font-semibold text-[#252750] uppercase" dir="ltr">
                    {selectedCase.channel}
                  </span>
                </div>
                {selectedCase.slotDetails && (
                  <div className="pt-2 border-t border-[#D9DBE6] space-y-1">
                    <span className="text-[#5B607A] block font-semibold">تفاصيل الموعد:</span>
                    <div className="font-bold text-[#252750]">
                      {selectedCase.slotDetails.dayAr} الساعة {selectedCase.slotDetails.time}
                    </div>
                  </div>
                )}
              </div>

              {/* Patient Rating for closed case */}
              {selectedCase.stage === 'closed' && (
                <div className="p-4 bg-white border border-[#D9DBE6] rounded-2xl text-center space-y-2">
                  <h4 className="text-xs font-bold text-[#252750]">{t('rate_service_title')}</h4>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => demoStore.rateCase(selectedCase.id, star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (selectedCase.rating && star <= selectedCase.rating)
                              ? 'fill-[#D0AE29] text-[#D0AE29]'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {selectedCase.rating && (
                    <span className="text-xs text-[#1E7A55] font-semibold block">
                      تم تسجيل تقييمك بنجاح ({selectedCase.rating} من ٥)
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#D9DBE6] bg-white">
              <button
                onClick={() => {
                  setSelectedCase(null);
                  onOpenChat();
                }}
                className="w-full py-3 bg-[#252750] hover:bg-[#3B3F7A] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#D0AE29]" />
                <span>فتح المحادثة ومتابعة الطلب</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
