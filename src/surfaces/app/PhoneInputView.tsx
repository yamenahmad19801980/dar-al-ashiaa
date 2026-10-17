import React, { useState } from 'react';
import { useT } from '../../i18n';
import { ArrowRight, Phone, ShieldCheck } from 'lucide-react';

interface PhoneInputViewProps {
  onCodeSent: (phone: string) => void;
  onBack: () => void;
}

export const PhoneInputView: React.FC<PhoneInputViewProps> = ({
  onCodeSent,
  onBack,
}) => {
  const { t, lang, isRtl } = useT();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePhone = (num: string): boolean => {
    // Clean spaces
    const clean = num.replace(/\s+/g, '').replace(/^\+20/, '');
    // Must be 10 or 11 digits starting with 010, 011, 012, 015 or 10, 11, 12, 15
    const regex = /^(010|011|012|015)[0-9]{8}$/;
    const regexWithoutZero = /^(10|11|12|15)[0-9]{8}$/;
    return regex.test(clean) || regexWithoutZero.test(clean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError(t('phone_error'));
      return;
    }

    const clean = phoneNumber.replace(/\s+/g, '');
    const valid = validatePhone(clean);

    if (!valid && clean !== '1234567890' && clean.length < 10) {
      setError(t('phone_error'));
      return;
    }

    setError('');
    setIsLoading(true);

    const formatted = clean.startsWith('0') ? `+20 ${clean.slice(1, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}` : `+20 ${clean}`;

    setTimeout(() => {
      setIsLoading(false);
      onCodeSent(formatted);
    }, 600);
  };

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col justify-between p-6 text-[#252750]">
      <div>
        <button
          onClick={onBack}
          aria-label={t('back')}
          className="mb-4 p-2 rounded-xl hover:bg-white text-[#5B607A] transition-colors inline-flex items-center gap-1 text-xs"
        >
          <span className={isRtl ? 'rotate-180' : ''}>←</span>
          <span>{t('back')}</span>
        </button>

        <h2 className="text-xl font-bold mb-1.5">{t('phone_title')}</h2>
        <p className="text-xs text-[#5B607A] leading-relaxed mb-6">
          {t('phone_subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              رقم الهاتف (جمهورية مصر العربية)
            </label>

            {/* Input with fixed +20 prefix */}
            <div className="flex items-center bg-white border border-[#D9DBE6] rounded-2xl px-3.5 py-3 focus-within:border-[#252750] focus-within:ring-2 focus-within:ring-[#252750]/15 shadow-xs" dir="ltr">
              <span className="font-semibold text-xs text-[#252750] pe-3 border-e border-[#D9DBE6] flex items-center gap-1">
                <span>🇪🇬</span>
                <span>+20</span>
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (error) setError('');
                }}
                placeholder="010 1234 5678"
                className="w-full ps-3 text-sm font-medium tracking-wider text-[#252750] focus:outline-none placeholder:text-slate-300"
                autoFocus
              />
            </div>

            {error && (
              <p className="mt-2 text-xs text-[#B3261E] leading-relaxed">
                {error}
              </p>
            )}
          </div>

          <div className="p-3 bg-[#E7E8F2]/60 rounded-xl flex items-start gap-2 text-[11px] text-[#5B607A]">
            <ShieldCheck className="w-4 h-4 text-[#1E7A55] shrink-0 mt-0.5" />
            <span>
              لا نقوم بمشاركة رقم هاتفك، ويتم استخدامه فقط للتحقق وإرسال إشعارات جاهزية التقارير.
            </span>
          </div>
        </form>
      </div>

      <div className="pb-4 space-y-3">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-medium text-sm rounded-xl transition-all shadow-sm active:scale-98 disabled:opacity-50"
        >
          {isLoading ? 'جاري الإرسال...' : t('btn_send_code')}
        </button>

        <p className="text-[10px] text-center text-[#5B607A] leading-relaxed">
          {t('terms_note')}
        </p>
      </div>
    </div>
  );
};
