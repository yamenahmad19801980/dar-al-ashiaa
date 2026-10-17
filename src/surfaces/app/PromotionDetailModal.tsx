import React from 'react';
import { X, Calendar, Tag, Phone, ExternalLink, CalendarCheck2 } from 'lucide-react';
import { Promotion } from '../../data/types';
import { useT } from '../../i18n';

interface PromotionDetailModalProps {
  promotion: Promotion;
  onClose: () => void;
  onBookScan: (serviceId?: string) => void;
}

export const PromotionDetailModal: React.FC<PromotionDetailModalProps> = ({
  promotion,
  onClose,
  onBookScan,
}) => {
  const { lang, t } = useT();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[85vh] flex flex-col text-[#252750] shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-[#D9DBE6] rounded-full mx-auto mt-3 mb-1" />

        <div className="px-5 py-3 border-b border-[#D9DBE6] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#8A6D12] bg-[#F3E7B8] px-2.5 py-1 rounded-md">
            <Tag className="w-3.5 h-3.5" />
            <span>حملة توعوية معتمدة</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F5F6FA] text-[#5B607A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-start">
          {/* Header Card Graphic */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#252750] to-[#3B3F7A] text-white relative overflow-hidden">
            <div className="absolute top-0 end-0 w-32 h-32 bg-[#D0AE29]/20 rounded-full blur-2xl" />
            <span className="text-[10px] font-semibold text-[#D0AE29] uppercase tracking-wider block mb-1">
              دار الأشعة · الإسكندرية
            </span>
            <h3 className="text-lg font-bold leading-snug">
              {lang === 'ar' ? promotion.titleAr : promotion.titleEn}
            </h3>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-white/80">
              <Calendar className="w-3.5 h-3.5 text-[#D0AE29]" />
              <span>
                سارية حتى {promotion.end} بجميع فروع الإسكندرية
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 text-xs text-[#5B607A] leading-relaxed">
            <p className="text-sm font-semibold text-[#252750]">
              {lang === 'ar' ? promotion.bodyAr : promotion.bodyEn}
            </p>
            <p>
              تأتي هذه المبادرة ضمن التزام دار الأشعة بتقديم أعلى معايير الفحص والتشخيص المبكر للمرضى والمترددين على مراكزنا باستخدام أحدث الأجهزة الرقمية وبإشراف نخبة من أساتذة واستشاريي الأشعة.
            </p>
          </div>

          {/* Target Audience Metadata */}
          <div className="bg-[#F5F6FA] p-3 rounded-xl text-xs space-y-1">
            <span className="text-[#5B607A] block">الفئة المستهدفة:</span>
            <span className="font-semibold text-[#252750]">
              {promotion.audience.userType === 'doctor'
                ? 'الأطباء المحولين واستشاريي الجراحة'
                : promotion.audience.gender === 'F'
                ? `سيدات (${promotion.audience.ageMin} - ${promotion.audience.ageMax} سنة)`
                : 'جميع المرضى والمراجعين'}
            </span>
          </div>
        </div>

        {/* Call to action */}
        <div className="p-4 border-t border-[#D9DBE6] bg-white">
          {promotion.cta.kind === 'book' ? (
            <button
              onClick={() => {
                onClose();
                onBookScan(promotion.cta.serviceId);
              }}
              className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <CalendarCheck2 className="w-4 h-4 text-[#D0AE29]" />
              <span>طلب حجز الفحص المشمول بالحملة</span>
            </button>
          ) : promotion.cta.kind === 'call' ? (
            <a
              href="tel:+2030000102"
              className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#D0AE29]" />
              <span>اتصال بفرع سموحة للحجز المسائي</span>
            </a>
          ) : (
            <button
              onClick={() => {
                onClose();
                alert('تم تسجيل الاهتمام بالحضور');
              }}
              className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-[#D0AE29]" />
              <span>تسجيل الحضور في الندوة الطبية</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
