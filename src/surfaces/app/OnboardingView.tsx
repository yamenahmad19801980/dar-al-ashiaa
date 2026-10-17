import React, { useState } from 'react';
import { useT } from '../../i18n';
import { ShieldCheck, MessageSquare, Layers } from 'lucide-react';

interface OnboardingViewProps {
  onFinish: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onFinish }) => {
  const { t, lang } = useT();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Layers,
      title: t('onboarding_title_1'),
      desc: t('onboarding_desc_1'),
      badge: '٤ فروع بالإسكندرية',
    },
    {
      icon: MessageSquare,
      title: t('onboarding_title_2'),
      desc: t('onboarding_desc_2'),
      badge: 'محادثة تفاعلية فورية',
    },
    {
      icon: ShieldCheck,
      title: t('onboarding_title_3'),
      desc: t('onboarding_desc_3'),
      badge: 'حماية بيانات مشددة',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  const SlideIcon = slides[currentSlide].icon;

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col justify-between p-6 text-[#252750] select-none">
      {/* Top Bar with Skip */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-[#252750] flex items-center justify-center text-[#D0AE29] font-bold text-[10px]">
            DA
          </div>
          <span className="text-xs font-bold text-[#252750]">{t('appName')}</span>
        </div>
        {currentSlide < slides.length - 1 && (
          <button
            onClick={onFinish}
            className="text-xs font-medium text-[#5B607A] hover:text-[#252750] transition-colors py-1 px-2"
          >
            {t('btn_skip')}
          </button>
        )}
      </div>

      {/* Slide Illustration & Text */}
      <div className="my-auto text-center px-2">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-[#252750] to-[#3B3F7A] text-[#D0AE29] flex items-center justify-center shadow-lg relative">
          <SlideIcon className="w-12 h-12" />
          <div className="absolute -bottom-2 px-2.5 py-0.5 bg-[#D0AE29] text-[#252750] text-[10px] font-bold rounded-full shadow-xs">
            {slides[currentSlide].badge}
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#252750] leading-snug mb-3">
          {slides[currentSlide].title}
        </h2>
        <p className="text-xs text-[#5B607A] leading-relaxed max-w-xs mx-auto">
          {slides[currentSlide].desc}
        </p>
      </div>

      {/* Footer Controls: Dots and Buttons */}
      <div className="pb-4 space-y-5">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'w-6 bg-[#252750]' : 'w-1.5 bg-[#D9DBE6]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-medium text-sm rounded-xl transition-all shadow-sm active:scale-98"
        >
          {currentSlide === slides.length - 1 ? t('btn_get_started') : t('btn_next')}
        </button>
      </div>
    </div>
  );
};
