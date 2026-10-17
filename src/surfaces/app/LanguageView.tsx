import React, { useState } from 'react';
import { useT } from '../../i18n';
import { Check } from 'lucide-react';

interface LanguageViewProps {
  onContinue: () => void;
}

export const LanguageView: React.FC<LanguageViewProps> = ({ onContinue }) => {
  const { lang, setLang } = useT();
  const [selected, setSelected] = useState<'ar' | 'en'>(lang);

  const handleSelect = (choice: 'ar' | 'en') => {
    setSelected(choice);
    setLang(choice);
  };

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col justify-between p-6 text-[#252750]">
      <div className="pt-8">
        {/* Brand emblem */}
        <div className="w-12 h-12 rounded-xl bg-[#252750] border-2 border-[#D0AE29] flex items-center justify-center text-[#D0AE29] font-black text-sm mb-6">
          DA
        </div>

        <h2 className="text-xl font-bold mb-1">
          {selected === 'ar' ? 'اختر لغة التطبيق' : 'Choose your language'}
        </h2>
        <p className="text-xs text-[#5B607A] mb-8">
          {selected === 'ar'
            ? 'يمكنك تغيير لغة العرض في أي وقت من إعدادات الحساب.'
            : 'You can change the display language anytime in Account settings.'}
        </p>

        {/* Language Choice Cards */}
        <div className="space-y-3">
          <button
            onClick={() => handleSelect('ar')}
            className={`w-full p-4 rounded-2xl border text-start flex items-center justify-between transition-all active:scale-[0.99] ${
              selected === 'ar'
                ? 'bg-white border-[#252750] ring-2 ring-[#252750]/15 shadow-sm'
                : 'bg-white/60 border-[#D9DBE6] hover:bg-white'
            }`}
          >
            <div>
              <div className="font-bold text-base text-[#252750]">العربية</div>
              <div className="text-xs text-[#5B607A]">اللغة العربية (الافتراضية)</div>
            </div>
            {selected === 'ar' && (
              <div className="w-6 h-6 rounded-full bg-[#252750] text-[#D0AE29] flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </button>

          <button
            onClick={() => handleSelect('en')}
            className={`w-full p-4 rounded-2xl border text-start flex items-center justify-between transition-all active:scale-[0.99] ${
              selected === 'en'
                ? 'bg-white border-[#252750] ring-2 ring-[#252750]/15 shadow-sm'
                : 'bg-white/60 border-[#D9DBE6] hover:bg-white'
            }`}
          >
            <div>
              <div className="font-bold text-base text-[#252750]">English</div>
              <div className="text-xs text-[#5B607A]">English Language</div>
            </div>
            {selected === 'en' && (
              <div className="w-6 h-6 rounded-full bg-[#252750] text-[#D0AE29] flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="pb-4">
        <button
          onClick={onContinue}
          className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-medium text-sm rounded-xl transition-all shadow-sm active:scale-98"
        >
          {selected === 'ar' ? 'متابعة' : 'Continue'}
        </button>
      </div>
    </div>
  );
};
