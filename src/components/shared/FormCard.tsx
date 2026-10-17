import React from 'react';
import { ClipboardList, AlertCircle, UserCheck, Calendar, MapPin } from 'lucide-react';
import { useT } from '../../i18n';

interface FormCardProps {
  form: 'booking' | 'issue' | 'referral';
  caseId?: string;
  formData?: Record<string, any>;
  timestamp?: string;
}

export const FormCard: React.FC<FormCardProps> = ({
  form,
  caseId,
  formData = {},
  timestamp,
}) => {
  const { lang, t } = useT();

  return (
    <div className="my-2 max-w-sm w-full bg-white rounded-2xl p-4 border border-[#D9DBE6] shadow-sm text-start text-[#252750]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#D9DBE6]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#252750]">
          {form === 'booking' && <ClipboardList className="w-4 h-4 text-[#1F5FAD]" />}
          {form === 'issue' && <AlertCircle className="w-4 h-4 text-[#A15C00]" />}
          {form === 'referral' && <UserCheck className="w-4 h-4 text-[#1E7A55]" />}
          <span>
            {form === 'booking'
              ? lang === 'ar'
                ? 'طلب حجز فحص أشعة'
                : 'Scan Booking Request'
              : form === 'issue'
              ? lang === 'ar'
                ? 'بلاغ عن مشكلة / شكوى'
                : 'Issue Report'
              : lang === 'ar'
              ? 'تحويل مريض معتمد'
              : 'Doctor Referral'}
          </span>
        </div>
        {caseId && (
          <span className="font-mono text-[11px] font-bold text-[#252750] bg-[#E7E8F2] px-2 py-0.5 rounded-md" dir="ltr">
            {caseId}
          </span>
        )}
      </div>

      {/* Body Details */}
      <div className="bg-[#F5F6FA] p-3 rounded-xl space-y-1.5 text-xs text-[#5B607A]">
        {form === 'booking' && (
          <>
            <div className="flex justify-between items-center text-[#252750]">
              <span className="text-[#5B607A]">الفحص:</span>
              <span className="font-semibold">{formData.serviceNameAr || formData.serviceNameEn || formData.service || 'MRI'}</span>
            </div>
            {formData.area && (
              <div className="flex justify-between items-center">
                <span>العضو:</span>
                <span className="font-medium text-[#252750]">{formData.area}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span>الفرع:</span>
              <span className="font-medium text-[#252750]">{formData.branchNameAr || formData.branchNameEn || 'سموحة'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>الموعد المفضل:</span>
              <span className="font-medium text-[#252750]">{formData.day} ({formData.time})</span>
            </div>
            {formData.notes && (
              <div className="mt-1 pt-1 border-t border-[#D9DBE6] text-[11px]">
                <span className="text-[#5B607A] block">ملاحظات:</span>
                <span className="text-[#252750]">{formData.notes}</span>
              </div>
            )}
          </>
        )}

        {form === 'issue' && (
          <>
            <div className="flex justify-between items-center text-[#252750]">
              <span>التصنيف:</span>
              <span className="font-semibold text-[#A15C00]">{formData.categoryAr || formData.category}</span>
            </div>
            {formData.branchNameAr && (
              <div className="flex justify-between items-center">
                <span>الفرع:</span>
                <span>{formData.branchNameAr}</span>
              </div>
            )}
            <div className="mt-1 pt-1 border-t border-[#D9DBE6] text-[11px]">
              <span className="text-[#5B607A] block">التفاصيل:</span>
              <span className="text-[#252750] leading-relaxed">{formData.description}</span>
            </div>
          </>
        )}

        {form === 'referral' && (
          <>
            <div className="flex justify-between items-center text-[#252750]">
              <span>المريض:</span>
              <span className="font-semibold">{formData.patientName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>الفحص:</span>
              <span className="font-semibold">{formData.service}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>موافقة المريض:</span>
              <span className="font-medium text-[#1E7A55]">مسجلة ومؤكدة</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-2 text-[10px] text-[#5B607A] flex items-center justify-between">
        <span>{lang === 'ar' ? 'تم الإرسال بنجاح' : 'Submitted successfully'}</span>
        <span dir="ltr">{timestamp || 'الآن'}</span>
      </div>
    </div>
  );
};
