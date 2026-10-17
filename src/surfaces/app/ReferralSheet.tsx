import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Upload, CheckCircle } from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';

interface ReferralSheetProps {
  onClose: () => void;
  onSubmitted: (caseId: string) => void;
}

export const ReferralSheet: React.FC<ReferralSheetProps> = ({
  onClose,
  onSubmitted,
}) => {
  const { t, lang } = useT();
  const services = demoStore.getState().services;
  const branches = demoStore.getState().branches;

  const [patientName, setPatientName] = useState('كريم حسن محمود');
  const [phone, setPhone] = useState('+20 10 0000 4706');
  const [dob, setDob] = useState('1986-09-30');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [serviceId, setServiceId] = useState('svc-mri');
  const [bodyArea, setBodyArea] = useState('الركبة اليمنى (Right knee)');
  const [clinicalIndication, setClinicalIndication] = useState('Suspected medial meniscus tear and ACL strain');
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent'>('Routine');
  const [branchId, setBranchId] = useState('br-smouha');
  const [consentRecorded, setConsentRecorded] = useState(true);
  const [consentMethod, setConsentMethod] = useState<'Signed form' | 'Verbal'>('Signed form');
  const [hasFormPhoto, setHasFormPhoto] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim() || !clinicalIndication.trim()) {
      setError('يرجى استكمال البيانات الإكلينيكية المطلوبة للمريض');
      return;
    }

    const caseId = demoStore.createReferral({
      patientName,
      phone,
      dob,
      gender,
      serviceId,
      bodyArea,
      clinicalIndication,
      urgency,
      branchId,
      consentRecorded,
      consentMethod,
    });

    onSubmitted(caseId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[92vh] flex flex-col text-[#252750] shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-[#D9DBE6] rounded-full mx-auto mt-3 mb-1" />

        <div className="px-5 py-3 border-b border-[#D9DBE6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#1E7A55]" />
            <div>
              <h3 className="text-base font-bold text-[#252750]">
                {t('referral_form_title')}
              </h3>
              <p className="text-[11px] text-[#5B607A]">
                إحالة مريض مباشرة إلى دار الأشعة مع توثيق الموافقة
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

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-start">
          {/* Patient Info */}
          <div className="bg-[#F5F6FA] p-3 rounded-2xl space-y-3">
            <span className="text-[11px] font-bold text-[#252750] block">
              بيانات المريض المحول:
            </span>
            <div>
              <label className="block text-[11px] font-medium text-[#5B607A] mb-1">
                {t('referral_patient_name')} *
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-white border border-[#D9DBE6] rounded-xl px-3 py-2 text-xs font-semibold text-[#252750] focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-[#5B607A] mb-1">
                  {t('referral_patient_phone')} *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#D9DBE6] rounded-xl px-3 py-2 text-xs font-semibold text-[#252750] focus:outline-none"
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#5B607A] mb-1">
                  النوع
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                  className="w-full bg-white border border-[#D9DBE6] rounded-xl px-2 py-2 text-xs font-semibold text-[#252750] focus:outline-none"
                >
                  <option value="M">ذكر (Male)</option>
                  <option value="F">أنثى (Female)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exam Details */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1">
              الفحص المطلوب *
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#252750] focus:outline-none"
            >
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {lang === 'ar' ? svc.ar : svc.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1">
              عضو الفحص أو البروتوكول (Body Area)
            </label>
            <input
              type="text"
              value={bodyArea}
              onChange={(e) => setBodyArea(e.target.value)}
              className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl px-3.5 py-2 text-xs font-medium text-[#252750] focus:outline-none"
            />
          </div>

          {/* Clinical Indication */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1">
              {t('referral_indication')} *
            </label>
            <textarea
              rows={2}
              value={clinicalIndication}
              onChange={(e) => setClinicalIndication(e.target.value)}
              className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl p-2.5 text-xs font-medium text-[#252750] focus:outline-none"
              required
            />
          </div>

          {/* Urgency & Branch */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#252750] mb-1">
                {t('referral_urgency')}
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'Routine' | 'Urgent')}
                className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl p-2.5 text-xs font-semibold text-[#252750]"
              >
                <option value="Routine">{t('urgency_routine')}</option>
                <option value="Urgent">{t('urgency_urgent')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#252750] mb-1">
                الفرع المفضل
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl p-2.5 text-xs font-semibold text-[#252750]"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {lang === 'ar' ? b.nameAr : b.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Consent Gating Section */}
          <div className="bg-[#E7E8F2]/60 p-3.5 rounded-2xl space-y-2 border border-[#D9DBE6]">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentRecorded}
                onChange={(e) => setConsentRecorded(e.target.checked)}
                className="mt-0.5 rounded text-[#252750] focus:ring-[#252750]"
              />
              <span className="text-xs font-bold text-[#252750] leading-snug">
                {t('referral_consent_check')}
              </span>
            </label>

            {consentRecorded && (
              <div className="pt-2 ps-6 space-y-1">
                <span className="text-[11px] text-[#5B607A] block">
                  {t('referral_consent_method_label')}:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConsentMethod('Signed form')}
                    className={`py-1 px-2.5 text-[11px] rounded-lg font-semibold border ${
                      consentMethod === 'Signed form'
                        ? 'bg-[#252750] text-white border-[#252750]'
                        : 'bg-white text-[#5B607A] border-[#D9DBE6]'
                    }`}
                  >
                    {t('consent_signed_form')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsentMethod('Verbal')}
                    className={`py-1 px-2.5 text-[11px] rounded-lg font-semibold border ${
                      consentMethod === 'Verbal'
                        ? 'bg-[#252750] text-white border-[#252750]'
                        : 'bg-white text-[#5B607A] border-[#D9DBE6]'
                    }`}
                  >
                    {t('consent_verbal')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-[#B3261E]">{error}</p>}

          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-98"
            >
              {t('btn_send_referral')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
