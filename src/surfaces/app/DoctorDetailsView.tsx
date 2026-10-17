import React, { useState } from 'react';
import { useT } from '../../i18n';
import { Stethoscope, Upload, Image, CheckCircle } from 'lucide-react';

interface DoctorDetailsViewProps {
  phone: string;
  onSaved: (doctorData: {
    name: string;
    specialty: string;
    clinic: string;
    syndicateNo: string;
  }) => void;
}

export const DoctorDetailsView: React.FC<DoctorDetailsViewProps> = ({
  phone,
  onSaved,
}) => {
  const { t, lang } = useT();

  const [name, setName] = useState('د. طارق سليم'); // Seed scene 5 doctor or customizable
  const [specialty, setSpecialty] = useState('جراحة المخ والأعصاب (Neurology)');
  const [clinic, setClinic] = useState('عيادات سموحة الطبية التخصصية');
  const [syndicateNo, setSyndicateNo] = useState('EGY-MED-22940');
  const [cardUploaded, setCardUploaded] = useState(true);
  const [error, setError] = useState('');

  const specialties = [
    'جراحة العظام والمفاصل (Orthopaedics)',
    'جراحة المخ والأعصاب (Neurology)',
    'النساء والتوليد وعلاج العقم (OB/GYN)',
    'الأمراض الباطنة والجهاز الهضمي (Internal Medicine)',
    'الأورام وجراحة الأورام (Oncology)',
    'المسالك البولية والتناسلية (Urology)',
    'طب الأطفال وحديثي الولادة (Pediatrics)',
    'الجراحة العامة والمناظير (General Surgery)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !syndicateNo.trim()) {
      setError('يرجى استكمال جميع الحقول المطلوبة ورقم قيد النقابة');
      return;
    }
    onSaved({
      name,
      specialty,
      clinic,
      syndicateNo,
    });
  };

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col justify-between p-6 text-[#252750]">
      <div className="overflow-y-auto">
        <div className="w-10 h-10 rounded-xl bg-[#252750] text-[#D0AE29] flex items-center justify-center mb-4">
          <Stethoscope className="w-5 h-5" />
        </div>

        <h2 className="text-xl font-bold mb-1.5">{t('doctor_details_title')}</h2>
        <p className="text-xs text-[#5B607A] leading-relaxed mb-6">
          {t('doctor_details_subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1">
              اسم الطبيب المعالج واللقب الطبي *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="د. ..."
              className="w-full bg-white border border-[#D9DBE6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1">
              {t('specialty_label')} *
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-white border border-[#D9DBE6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750]"
            >
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1">
              {t('clinic_label')} *
            </label>
            <input
              type="text"
              value={clinic}
              onChange={(e) => setClinic(e.target.value)}
              className="w-full bg-white border border-[#D9DBE6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1">
              {t('syndicate_label')} *
            </label>
            <input
              type="text"
              value={syndicateNo}
              onChange={(e) => setSyndicateNo(e.target.value)}
              className="w-full bg-white border border-[#D9DBE6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750]"
              dir="ltr"
              required
            />
          </div>

          {/* Syndicate Card Upload Mock */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1">
              {t('syndicate_card_label')} *
            </label>
            <div
              onClick={() => setCardUploaded(true)}
              className="p-3 bg-white rounded-xl border border-dashed border-[#252750]/40 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-[#D0AE29]" />
                <span className="text-xs text-[#252750]">
                  {cardUploaded ? 'syndicate_card_license.jpg' : 'اضغط لإرفاق صورة الكارنيه'}
                </span>
              </div>
              <span className="text-[11px] text-[#1E7A55] font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>تم الإرفاق</span>
              </span>
            </div>
          </div>

          {error && <p className="text-xs text-[#B3261E]">{error}</p>}
        </form>
      </div>

      <div className="pb-4 pt-4">
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-medium text-sm rounded-xl transition-all shadow-sm active:scale-98"
        >
          {t('btn_submit_doctor')}
        </button>
      </div>
    </div>
  );
};
