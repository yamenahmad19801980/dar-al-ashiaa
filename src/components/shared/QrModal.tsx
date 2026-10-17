import React from 'react';
import { CornerBrackets } from './CornerBrackets';
import { X, QrCode, Sun, ShieldCheck } from 'lucide-react';
import { useT } from '../../i18n';
import { PortalReport } from '../../data/types';

interface QrModalProps {
  report: PortalReport;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ report, onClose }) => {
  const { t, lang } = useT();

  // Draw deterministic QR code pattern using SVG cells
  const seed = (report.id + report.visitNo).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const size = 25;
  const cells: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      // Corner squares standard QR patterns
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= size - 7;
      const isBottomLeft = r >= size - 7 && c < 7;
      if (isTopLeft || isTopRight || isBottomLeft) {
        const tr = isTopLeft ? r : isTopRight ? r : r - (size - 7);
        const tc = isTopLeft ? c : isTopRight ? c - (size - 7) : c;
        if (tr === 0 || tr === 6 || tc === 0 || tc === 6) {
          row.push(true);
        } else if (tr >= 2 && tr <= 4 && tc >= 2 && tc <= 4) {
          row.push(true);
        } else {
          row.push(false);
        }
      } else {
        const bit = ((seed * (r + 1) * (c + 7)) ^ (r * 13 + c * 31)) % 11 < 5;
        row.push(bit);
      }
    }
    cells.push(row);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center text-[#252750]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={t('close')}
          className="absolute top-4 end-4 p-2 rounded-full hover:bg-[#F5F6FA] text-[#5B607A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#1E7A55] bg-[#1E7A55]/10 py-1 px-3 rounded-full w-fit mx-auto mb-3">
          <Sun className="w-3.5 h-3.5 text-[#A15C00]" />
          <span>{t('qr_brightness_hint')}</span>
        </div>

        <h3 className="text-lg font-bold text-[#252750] mb-1">
          {t('qr_modal_title')}
        </h3>
        <p className="text-xs text-[#5B607A] mb-4">
          {lang === 'ar' ? report.examAr : report.examEn}
        </p>

        {/* QR Code Container wrapped with signature gold brackets */}
        <div className="my-2 flex justify-center">
          <CornerBrackets bracketColor="#D0AE29" size={20}>
            <div className="p-4 bg-white rounded-xl shadow-inner border border-[#D9DBE6]">
              <svg width="200" height="200" viewBox="0 0 25 25" className="w-48 h-48">
                {cells.map((row, r) =>
                  row.map((cell, c) =>
                    cell ? (
                      <rect
                        key={`${r}-${c}`}
                        x={c}
                        y={r}
                        width="1"
                        height="1"
                        fill="#252750"
                      />
                    ) : null
                  )
                )}
              </svg>
            </div>
          </CornerBrackets>
        </div>

        {/* Visit Details */}
        <div className="mt-4 p-3 bg-[#F5F6FA] rounded-xl text-xs space-y-1 text-start">
          <div className="flex justify-between items-center text-[#5B607A]">
            <span>رقم الزيارة / Visit No:</span>
            <span className="font-mono font-bold text-[#252750]" dir="ltr">
              {report.visitNo}
            </span>
          </div>
          <div className="flex justify-between items-center text-[#5B607A]">
            <span>صلاحية الرابط / Expiry:</span>
            <span className="font-medium text-[#252750]" dir="ltr">
              {report.expiryDate}
            </span>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-[#5B607A] leading-relaxed">
          {t('qr_modal_desc')}
        </p>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#1E7A55]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t('qr_offline_hint')}</span>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 bg-[#252750] hover:bg-[#3B3F7A] text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
};
