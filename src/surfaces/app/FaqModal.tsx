import React, { useState } from 'react';
import { X, HelpCircle, Search, ChevronDown, MessageSquare } from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';

interface FaqModalProps {
  onClose: () => void;
  onOpenChat: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ onClose, onOpenChat }) => {
  const { lang, t } = useT();
  const faqList = demoStore.getState().faq;
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(faqList[0]?.id || null);

  const filtered = faqList.filter((item) => {
    const text = lang === 'ar' ? `${item.qAr} ${item.aAr}` : `${item.qEn} ${item.aEn}`;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[88vh] flex flex-col text-[#252750] shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-[#D9DBE6] rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-[#D9DBE6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#252750] text-[#D0AE29] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#252750]">
                {t('section_faq')}
              </h3>
              <p className="text-[11px] text-[#5B607A]">
                إجابات طبية معتمدة من استشاريي دار الأشعة
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

        {/* Search */}
        <div className="px-5 py-3 border-b border-[#D9DBE6]">
          <div className="flex items-center gap-2 bg-[#F5F6FA] px-3.5 py-2.5 rounded-xl border border-[#D9DBE6]">
            <Search className="w-4 h-4 text-[#5B607A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أمان الأشعة، الرنين المغناطيسي، الصيام..."
              className="w-full bg-transparent text-xs text-[#252750] placeholder:text-[#5B607A] focus:outline-none"
            />
          </div>
        </div>

        {/* Accordion Questions */}
        <div className="p-5 overflow-y-auto space-y-2 text-start flex-1">
          {filtered.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xs text-[#5B607A] mb-3">
                لم نجد نتيجة تطابق بحثك.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenChat();
                }}
                className="py-2.5 px-4 bg-[#252750] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D0AE29]" />
                <span>اسأل فريقنا في المحادثة المباشرة</span>
              </button>
            </div>
          ) : (
            filtered.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="border border-[#D9DBE6] rounded-2xl overflow-hidden bg-white transition-all"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full p-3.5 text-start text-xs font-bold text-[#252750] flex items-center justify-between gap-3 hover:bg-[#F5F6FA]"
                  >
                    <span>{lang === 'ar' ? item.qAr : item.qEn}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5B607A] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#252750]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-1 text-xs text-[#5B607A] leading-relaxed border-t border-[#D9DBE6]/50 bg-[#F5F6FA]/50">
                      {lang === 'ar' ? item.aAr : item.aEn}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still need help CTA */}
        <div className="p-4 border-t border-[#D9DBE6] bg-white flex items-center justify-between">
          <span className="text-xs text-[#5B607A]">لديك استفسار خاص؟</span>
          <button
            onClick={() => {
              onClose();
              onOpenChat();
            }}
            className="py-2 px-3.5 bg-[#252750] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#3B3F7A]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#D0AE29]" />
            <span>تحدث معنا</span>
          </button>
        </div>
      </div>
    </div>
  );
};
