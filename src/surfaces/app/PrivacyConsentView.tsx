import React, { useState } from 'react';
import { useT } from '../../i18n';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';

interface PrivacyConsentViewProps {
  onAgree: (consents: { health: boolean; hosting: boolean; offers: boolean }) => void;
}

export const PrivacyConsentView: React.FC<PrivacyConsentViewProps> = ({
  onAgree,
}) => {
  const { t, lang } = useT();

  const [healthConsent, setHealthConsent] = useState(true);
  const [hostingConsent, setHostingConsent] = useState(true);
  const [offersConsent, setOffersConsent] = useState(false);

  const canContinue = healthConsent && hostingConsent;

  const handleContinue = () => {
    if (!canContinue) return;
    onAgree({
      health: healthConsent,
      hosting: hostingConsent,
      offers: offersConsent,
    });
  };

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col justify-between p-6 text-[#252750]">
      <div className="overflow-y-auto">
        <div className="w-10 h-10 rounded-xl bg-[#252750] text-[#D0AE29] flex items-center justify-center mb-4">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <h2 className="text-xl font-bold mb-1.5">{t('consent_title')}</h2>
        <p className="text-xs text-[#5B607A] leading-relaxed mb-5">
          {t('consent_subtitle')}
        </p>

        <div className="space-y-3.5">
          {/* 1. Health Information (Required) */}
          <div className="bg-white p-4 rounded-2xl border border-[#D9DBE6] shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-[#252750]">
                    {t('consent_health_title')}
                  </span>
                  <span className="text-[10px] font-semibold text-[#B3261E] bg-[#B3261E]/10 px-1.5 py-0.5 rounded">
                    {t('required')}
                  </span>
                </div>
                <p className="text-[11px] text-[#5B607A] leading-relaxed">
                  {t('consent_health_desc')}
                </p>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setHealthConsent(!healthConsent)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  healthConsent ? 'bg-[#252750]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    healthConsent ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 2. Cloud Hosting Outside Egypt (Required) */}
          <div className="bg-white p-4 rounded-2xl border border-[#D9DBE6] shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-[#252750]">
                    {t('consent_hosting_title')}
                  </span>
                  <span className="text-[10px] font-semibold text-[#B3261E] bg-[#B3261E]/10 px-1.5 py-0.5 rounded">
                    {t('required')}
                  </span>
                </div>
                <p className="text-[11px] text-[#5B607A] leading-relaxed">
                  {t('consent_hosting_desc')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setHostingConsent(!hostingConsent)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hostingConsent ? 'bg-[#252750]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    hostingConsent ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 3. Screenings & Offers (Optional) */}
          <div className="bg-white p-4 rounded-2xl border border-[#D9DBE6] shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-[#252750]">
                    {t('consent_offers_title')}
                  </span>
                  <span className="text-[10px] font-medium text-[#1F5FAD] bg-[#1F5FAD]/10 px-1.5 py-0.5 rounded">
                    اختياري
                  </span>
                </div>
                <p className="text-[11px] text-[#5B607A] leading-relaxed">
                  {t('consent_offers_desc')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOffersConsent(!offersConsent)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  offersConsent ? 'bg-[#D0AE29]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    offersConsent ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Legal Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => alert('وثيقة الخصوصية وسياسة حماية البيانات الشخصية لدار الأشعة متوافقة مع القانون رقم 151 لسنة 2020')}
            className="text-xs text-[#1F5FAD] hover:underline inline-flex items-center gap-1"
          >
            <span>قراءة سياسة الخصوصية الكاملة وشروط الاستخدام</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="pb-4 pt-4">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-medium text-sm rounded-xl transition-all shadow-sm active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('btn_agree_continue')}
        </button>
      </div>
    </div>
  );
};
