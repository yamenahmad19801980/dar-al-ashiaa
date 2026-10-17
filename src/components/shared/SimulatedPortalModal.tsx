import React from 'react';
import { X, ExternalLink, Download, FileCheck2, Info, Building2 } from 'lucide-react';
import { PortalReport } from '../../data/types';
import { useT } from '../../i18n';

interface SimulatedPortalModalProps {
  report: PortalReport;
  onClose: () => void;
}

export const SimulatedPortalModal: React.FC<SimulatedPortalModalProps> = ({
  report,
  onClose,
}) => {
  const { lang, t } = useT();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-[#252750]">
        {/* Top Simulated Portal Banner */}
        <div className="bg-[#252750] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D0AE29] flex items-center justify-center text-[#252750] font-black text-sm">
              DA
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight">
                بوابة المرضى المعتمدة · Dar El Ashaa Portal
              </div>
              <div className="text-[10px] text-white/70">
                منظومة التبادل السحابي لصور وتقارير الأشعة (Cloud Imaging Exchange)
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Alert Strip */}
        <div className="bg-[#F3E7B8] px-4 py-2 text-[11px] text-[#8A6D12] flex items-center gap-2 border-b border-[#D0AE29]/30">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            {lang === 'ar'
              ? 'نموذج محاكاة تجريبي لعرض التقارير الطبية المشفرة. لا يحتوي على بيانات مرضى حقيقية.'
              : 'Simulated patient portal demo. No real medical records or patient data.'}
          </span>
        </div>

        {/* Scrollable Report Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-start">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9DBE6] pb-3">
            <div>
              <span className="text-[11px] text-[#5B607A] block">نوع الفحص الشعاعي:</span>
              <h3 className="text-lg font-bold text-[#252750]">
                {lang === 'ar' ? report.examAr : report.examEn}
              </h3>
            </div>
            <div className="text-end">
              <span className="text-[11px] text-[#5B607A] block">رقم الزيارة الطبية:</span>
              <span className="font-mono text-sm font-bold text-[#252750]" dir="ltr">
                {report.visitNo}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#F5F6FA] p-3 rounded-xl">
            <div>
              <span className="text-[#5B607A] block">تاريخ إجراء الفحص:</span>
              <span className="font-semibold text-[#252750]" dir="ltr">{report.date}</span>
            </div>
            <div>
              <span className="text-[#5B607A] block">الفرع المعتمد:</span>
              <span className="font-semibold text-[#252750]">
                {report.branchId === 'br-smouha' ? 'فرع سموحة' : 'فرع محطة الرمل'}
              </span>
            </div>
            <div>
              <span className="text-[#5B607A] block">الطبيب الاستشاري المعتمد:</span>
              <span className="font-semibold text-[#252750]">أ.د. عبد القادر الديب</span>
            </div>
            <div>
              <span className="text-[#5B607A] block">حالة التقرير:</span>
              <span className="font-bold text-[#1E7A55]">معتمد وموقع إلكترونياً</span>
            </div>
          </div>

          {/* Radiology Imaging Preview Placeholder */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#252750]">
                {lang === 'ar' ? 'معاينة المقاطع والصور (Key DICOM Series)' : 'Key DICOM Series Preview'}
              </span>
              <span className="text-[11px] text-[#5B607A]">٤٢ مقطعاً تشخيصياً</span>
            </div>
            <div className="h-44 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-400 relative overflow-hidden border border-slate-800">
              {/* Radiological grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
              <div className="z-10 text-center p-4">
                <FileCheck2 className="w-10 h-10 text-[#D0AE29] mx-auto mb-2 opacity-80" />
                <div className="text-xs font-medium text-white">
                  {lang === 'ar' ? 'تم تشفير الصور وفق بروتوكول DICOM الطبي' : 'DICOM Encrypted Medical Series'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  1.5T MRI / Multi-slice Sequence · Resolution 2048 x 2048
                </div>
              </div>
            </div>
          </div>

          {/* Report Text Summary */}
          <div className="border border-[#D9DBE6] rounded-2xl p-4 bg-white text-xs space-y-2">
            <h5 className="font-bold text-[#252750] border-b border-[#D9DBE6] pb-1">
              خلاصة التقرير الطبي التشخيصي (Clinical Impression):
            </h5>
            <p className="text-[#5B607A] leading-relaxed">
              - الفقرات القطنية تظهر اصطفافاً طبيعياً مع عدم وجود انزلاق غضروفي ضاغط على الجذور العصبية.
              <br />
              - القناة الشوكية متسعة بصورة طبيعية ولا توجد تغيرات تنكسية حادة.
              <br />
              - يوصى بالمتابعة الإكلينيكية مع استشاري العظام المعالج.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F5F6FA] p-4 border-t border-[#D9DBE6] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              alert(lang === 'ar' ? 'تم تنزيل نسخة PDF من التقرير بنجاح' : 'Report PDF downloaded successfully');
            }}
            className="flex-1 py-2.5 px-4 bg-white hover:bg-slate-50 text-[#252750] border border-[#D9DBE6] font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تحميل التقرير PDF' : 'Download PDF'}</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-[#252750] hover:bg-[#3B3F7A] text-white font-medium text-xs rounded-xl transition-colors shadow-xs"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
