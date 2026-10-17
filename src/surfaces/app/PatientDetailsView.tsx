import React, { useState } from 'react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';

interface PatientDetailsViewProps {
  phone: string;
  onSaved: (patientData: {
    name: string;
    gender: 'F' | 'M';
    dob: string;
    preferredBranch: string;
  }) => void;
}

export const PatientDetailsView: React.FC<PatientDetailsViewProps> = ({
  phone,
  onSaved,
}) => {
  const { t, lang } = useT();
  const branches = demoStore.getState().branches;

  const [name, setName] = useState('نادية كمال'); // Default sample or empty
  const [gender, setGender] = useState<'F' | 'M'>('F');
  const [dob, setDob] = useState('1980-04-15');
  const [preferredBranch, setPreferredBranch] = useState('br-smouha');
  const [error, setError] = useState('');

  // Calculate age
  const birthYear = new Date(dob).getFullYear();
  const currentYear = 2026;
  const age = Math.max(18, currentYear - birthYear);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى إدخال الاسم الكامل');
      return;
    }
    onSaved({
      name,
      gender,
      dob,
      preferredBranch,
    });
  };

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col justify-between p-6 text-[#252750]">
      <div className="overflow-y-auto">
        <h2 className="text-xl font-bold mb-1.5">{t('patient_details_title')}</h2>
        <p className="text-xs text-[#5B607A] leading-relaxed mb-6">
          {t('patient_details_subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              {t('fullname_label')} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="مثال: نادية كمال محمد"
              className="w-full bg-white border border-[#D9DBE6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750] focus:ring-2 focus:ring-[#252750]/15"
              required
            />
          </div>

          {/* Gender Segmented Control */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              {t('gender_label')} *
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#E7E8F2]/60 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setGender('F')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  gender === 'F'
                    ? 'bg-white text-[#252750] shadow-xs'
                    : 'text-[#5B607A] hover:text-[#252750]'
                }`}
              >
                {t('gender_female')}
              </button>
              <button
                type="button"
                onClick={() => setGender('M')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  gender === 'M'
                    ? 'bg-white text-[#252750] shadow-xs'
                    : 'text-[#5B607A] hover:text-[#252750]'
                }`}
              >
                {t('gender_male')}
              </button>
            </div>
          </div>

          {/* Date of Birth & Age Display */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#252750]">
                {t('dob_label')} *
              </label>
              <span className="text-[11px] font-bold text-[#D0AE29] bg-[#252750] px-2 py-0.5 rounded-md">
                العمر: {age} سنة
              </span>
            </div>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-white border border-[#D9DBE6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750]"
              required
            />
          </div>

          {/* Preferred Branch */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              {t('preferred_branch_label')}
            </label>
            <select
              value={preferredBranch}
              onChange={(e) => setPreferredBranch(e.target.value)}
              className="w-full bg-white border border-[#D9DBE6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750]"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {lang === 'ar' ? b.nameAr : b.nameEn}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-[#B3261E]">{error}</p>}
        </form>
      </div>

      <div className="pb-4 pt-4">
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-medium text-sm rounded-xl transition-all shadow-sm active:scale-98"
        >
          {t('btn_continue')}
        </button>
      </div>
    </div>
  );
};
