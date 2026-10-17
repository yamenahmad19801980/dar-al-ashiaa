import React from 'react';
import { X, Clock, MapPin, CheckCircle2, Calendar } from 'lucide-react';
import { Service } from '../../data/types';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';

interface ServiceDetailModalProps {
  service: Service;
  onClose: () => void;
  onBookThisScan: (serviceId: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookThisScan,
}) => {
  const { lang, t } = useT();
  const branches = demoStore.getState().branches;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[85vh] flex flex-col text-[#252750] shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-[#D9DBE6] rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-[#D9DBE6] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#8A6D12] bg-[#F3E7B8] px-2 py-0.5 rounded-md uppercase tracking-wider">
              {service.short}
            </span>
            <h3 className="text-base font-bold text-[#252750] mt-1">
              {lang === 'ar' ? service.ar : service.en}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F5F6FA] text-[#5B607A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-start">
          <p className="text-xs text-[#5B607A] leading-relaxed">
            {lang === 'ar' ? service.descriptionAr : service.descriptionEn}
          </p>

          <div className="flex items-center gap-4 text-xs bg-[#F5F6FA] p-3 rounded-2xl">
            <div className="flex items-center gap-1.5 text-[#252750]">
              <Clock className="w-4 h-4 text-[#D0AE29]" />
              <span className="font-semibold">
                {lang === 'ar' ? service.durationAr : service.durationEn}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#5B607A]">
              <MapPin className="w-4 h-4 text-[#3B3F7A]" />
              <span>متاح في فروع الإسكندرية</span>
            </div>
          </div>

          {/* Numbered Preparation Steps */}
          <div>
            <h4 className="text-xs font-bold text-[#252750] mb-2">
              تعليمات التحضير المطلوبة قبل الفحص:
            </h4>
            <div className="space-y-2">
              {(lang === 'ar' ? service.prepAr : service.prepEn).map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 bg-white border border-[#D9DBE6] rounded-xl text-xs text-[#252750]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#252750] text-[#D0AE29] font-bold text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available branches tags */}
          <div>
            <h4 className="text-xs font-bold text-[#252750] mb-1.5">
              الفروع المجهزة بهذا الفحص:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {service.branches.map((bId) => {
                const br = branches.find((b) => b.id === bId);
                return (
                  <span
                    key={bId}
                    className="text-[11px] bg-[#E7E8F2] text-[#252750] font-medium px-2.5 py-1 rounded-lg"
                  >
                    {br ? (lang === 'ar' ? br.nameAr : br.nameEn) : bId}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button: Book this scan */}
        <div className="p-4 border-t border-[#D9DBE6] bg-white">
          <button
            onClick={() => {
              onClose();
              onBookThisScan(service.id);
            }}
            className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#D0AE29]" />
            <span>احجز هذا الفحص الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
