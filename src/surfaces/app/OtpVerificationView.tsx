import React, { useState, useEffect, useRef } from 'react';
import { useT } from '../../i18n';
import { MessageSquareText, ShieldAlert } from 'lucide-react';

interface OtpVerificationViewProps {
  phone: string;
  onVerified: () => void;
  onChangePhone: () => void;
}

export const OtpVerificationView: React.FC<OtpVerificationViewProps> = ({
  phone,
  onVerified,
  onChangePhone,
}) => {
  const { t, lang, isRtl } = useT();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [secondsLeft]);

  // Auto focus first digit
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);
    setError('');

    // Advance focus
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If complete, verify
    if (newDigits.every((d) => d !== '')) {
      setTimeout(() => {
        onVerified();
      }, 300);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setSecondsLeft(60);
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleAutoFill = () => {
    setDigits(['5', '8', '2', '9', '1', '4']);
    setTimeout(() => {
      onVerified();
    }, 400);
  };

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col justify-between p-6 text-[#252750]">
      <div>
        <button
          onClick={onChangePhone}
          aria-label={t('back')}
          className="mb-4 p-2 rounded-xl hover:bg-white text-[#5B607A] transition-colors inline-flex items-center gap-1 text-xs"
        >
          <span className={isRtl ? 'rotate-180' : ''}>←</span>
          <span>{t('otp_change_phone')}</span>
        </button>

        <h2 className="text-xl font-bold mb-1.5">{t('otp_title')}</h2>
        <p className="text-xs text-[#5B607A] leading-relaxed mb-1">
          {t('otp_subtitle')}
        </p>
        <span className="text-xs font-bold text-[#252750] font-mono block mb-6" dir="ltr">
          {phone}
        </span>

        {/* 6 Digit Boxes (Strictly LTR) */}
        <div className="flex items-center justify-between gap-2 max-w-xs mx-auto mb-4" dir="ltr">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 text-center text-lg font-bold font-mono bg-white border border-[#D9DBE6] rounded-xl focus:border-[#252750] focus:ring-2 focus:ring-[#252750]/20 focus:outline-none transition-all shadow-xs"
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-[#B3261E] text-center mb-3">
            {error}
          </p>
        )}

        {/* Simulated SMS Auto-Fill helper */}
        <div className="text-center my-3">
          <button
            onClick={handleAutoFill}
            className="text-[11px] text-[#1F5FAD] hover:bg-[#1F5FAD]/10 px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors border border-[#1F5FAD]/30"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>محاكاة: استلام الرمز عبر الرسائل (582914)</span>
          </button>
        </div>
      </div>

      <div className="pb-4 space-y-4">
        {/* Resend Timer */}
        <div className="text-center text-xs text-[#5B607A]">
          {secondsLeft > 0 ? (
            <span>
              {t('otp_resend_in')}{' '}
              <span className="font-mono font-bold text-[#252750]" dir="ltr">
                00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
              </span>
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="font-bold text-[#252750] hover:underline"
            >
              {t('otp_resend_now')}
            </button>
          )}
        </div>

        <button
          onClick={() => {
            if (digits.every((d) => d !== '')) {
              onVerified();
            } else {
              handleAutoFill();
            }
          }}
          className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-medium text-sm rounded-xl transition-all shadow-sm active:scale-98"
        >
          {t('confirm')}
        </button>
      </div>
    </div>
  );
};
