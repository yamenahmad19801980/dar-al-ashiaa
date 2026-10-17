import React, { useState } from 'react';
import { CornerBrackets } from './CornerBrackets';
import { FileText, QrCode, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PortalReport } from '../../data/types';
import { useT } from '../../i18n';
import { QrModal } from './QrModal';
import { SimulatedPortalModal } from './SimulatedPortalModal';

interface ResultsCardProps {
  report: PortalReport;
  branchName?: string;
  patientName?: string;
  animate?: boolean;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  report,
  branchName,
  patientName,
  animate = true,
}) => {
  const { t, lang } = useT();
  const [showQr, setShowQr] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

  return (
    <>
      <div className="my-2 max-w-sm w-full">
        <CornerBrackets bracketColor="#D0AE29" animate={animate} size={16}>
          <div className="bg-white rounded-2xl p-4 border border-[#D9DBE6] shadow-sm text-start text-[#252750]">
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E7A55]">
                <CheckCircle2 className="w-4 h-4 text-[#1E7A55]" />
                <span>{t('stage_released')}</span>
              </div>
              <span className="text-[11px] text-[#5B607A] font-mono" dir="ltr">
                {report.visitNo}
              </span>
            </div>

            <h4 className="text-base font-bold text-[#252750] leading-snug">
              {t('results_card_title')}
            </h4>

            {patientName && (
              <div className="mt-1 text-xs text-[#5B607A]">
                <span>المريض: </span>
                <span className="font-semibold text-[#252750]">{patientName}</span>
              </div>
            )}

            <div className="mt-2 p-2.5 bg-[#F5F6FA] rounded-xl text-xs space-y-1">
              <div className="font-semibold text-[#252750]">
                {lang === 'ar' ? report.examAr : report.examEn}
              </div>
              <div className="text-[#5B607A] text-[11px] flex items-center justify-between">
                <span>{branchName || (lang === 'ar' ? 'فرع سموحة' : 'Smouha Branch')}</span>
                <span dir="ltr">{report.date}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowPortal(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#252750] hover:bg-[#3B3F7A] text-white text-xs font-medium rounded-xl transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('btn_view_report')}</span>
              </button>

              <button
                onClick={() => setShowQr(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#D0AE29] hover:bg-[#D0AE29]/90 text-[#252750] text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{t('btn_show_qr')}</span>
              </button>
            </div>

            {/* Expiry note */}
            <div className="mt-2.5 pt-2 border-t border-[#D9DBE6]/60 flex items-center justify-between text-[10px] text-[#5B607A]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#1E7A55]" />
                <span>مشفر وآمن</span>
              </span>
              <span dir="ltr">
                {t('results_card_expiry', { date: report.expiryDate })}
              </span>
            </div>
          </div>
        </CornerBrackets>
      </div>

      {showQr && <QrModal report={report} onClose={() => setShowQr(false)} />}
      {showPortal && <SimulatedPortalModal report={report} onClose={() => setShowPortal(false)} />}
    </>
  );
};
