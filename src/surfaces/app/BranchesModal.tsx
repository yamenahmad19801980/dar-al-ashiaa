import React, { useState } from 'react';
import { X, MapPin, Phone, MessageCircle, Navigation, Clock, CheckCircle } from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';

interface BranchesModalProps {
  onClose: () => void;
  onBookAtBranch?: (branchId: string) => void;
}

export const BranchesModal: React.FC<BranchesModalProps> = ({
  onClose,
  onBookAtBranch,
}) => {
  const { lang, t } = useT();
  const branches = demoStore.getState().branches;
  const [selectedBranchId, setSelectedBranchId] = useState(branches[1].id); // Smouha default

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[88vh] flex flex-col text-[#252750] shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-[#D9DBE6] rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-[#D9DBE6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#252750] text-[#D0AE29] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#252750]">
                {t('section_branches')}
              </h3>
              <p className="text-[11px] text-[#5B607A]">
                ٤ فروع مجهزة بأحدث أجهزة التصوير بالإسكندرية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F5F6FA] text-[#5B607A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branch Selector Tabs */}
        <div className="px-5 pt-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-[#D9DBE6]">
          {branches.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranchId(b.id)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedBranchId === b.id
                  ? 'bg-[#252750] text-white shadow-xs'
                  : 'bg-[#F5F6FA] text-[#5B607A] hover:bg-slate-200 border border-[#D9DBE6]'
              }`}
            >
              {lang === 'ar' ? b.nameAr : b.nameEn}
            </button>
          ))}
        </div>

        {/* Branch Details */}
        <div className="p-5 overflow-y-auto space-y-4 text-start">
          {/* Status & Name */}
          <div className="bg-[#F5F6FA] p-4 rounded-2xl border border-[#D9DBE6]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-base font-bold text-[#252750]">
                {lang === 'ar' ? selectedBranch.nameAr : selectedBranch.nameEn}
              </h4>
              <span className="text-[10px] font-bold text-[#1E7A55] bg-[#1E7A55]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>{t('openNow')}</span>
              </span>
            </div>

            <div className="flex items-start gap-2 text-xs text-[#5B607A] mb-2">
              <MapPin className="w-4 h-4 text-[#3B3F7A] shrink-0 mt-0.5" />
              <span>{lang === 'ar' ? selectedBranch.addressAr : selectedBranch.addressEn}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#5B607A]">
              <Clock className="w-4 h-4 text-[#D0AE29] shrink-0" />
              <span>{lang === 'ar' ? selectedBranch.hoursAr : selectedBranch.hoursEn}</span>
            </div>
          </div>

          {/* Interactive Map Mock */}
          <div className="h-36 bg-[#E7E8F2] rounded-2xl relative overflow-hidden border border-[#D9DBE6] flex items-center justify-center">
            {/* Map lines pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#3B3F7A_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            <div className="z-10 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-xl text-center shadow-sm">
              <MapPin className="w-6 h-6 text-[#252750] mx-auto mb-1 fill-[#D0AE29]" />
              <div className="text-xs font-bold text-[#252750]">
                {lang === 'ar' ? selectedBranch.nameAr : selectedBranch.nameEn}
              </div>
              <div className="text-[10px] text-[#5B607A]">
                إحداثيات: {selectedBranch.coordinates.lat.toFixed(4)}, {selectedBranch.coordinates.lng.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Quick Contact Actions Grid */}
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`tel:${selectedBranch.phone}`}
              className="py-2.5 px-2 bg-[#252750] hover:bg-[#3B3F7A] text-white rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>اتصال هاتفي</span>
            </a>

            <a
              href={`https://wa.me/${selectedBranch.whatsapp.replace(/\s+/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-2 bg-[#1E7A55] hover:bg-[#1E7A55]/90 text-white rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </a>

            <button
              onClick={() => {
                alert(`فتح خرائط الهاتف للتوجه إلى ${selectedBranch.nameAr}`);
              }}
              className="py-2.5 px-2 bg-white hover:bg-slate-50 border border-[#D9DBE6] text-[#252750] rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Navigation className="w-4 h-4 text-[#1F5FAD]" />
              <span>الاتجاهات</span>
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        {onBookAtBranch && (
          <div className="p-4 border-t border-[#D9DBE6] bg-white">
            <button
              onClick={() => {
                onClose();
                onBookAtBranch(selectedBranch.id);
              }}
              className="w-full py-3 bg-[#252750] hover:bg-[#3B3F7A] text-white font-bold text-xs rounded-xl transition-all shadow-xs"
            >
              طلب حجز في هذا الفرع
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
