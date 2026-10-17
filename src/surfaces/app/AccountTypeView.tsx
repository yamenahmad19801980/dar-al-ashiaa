import React, { useState } from 'react';
import { useT } from '../../i18n';
import { User, Stethoscope, Compass, Users } from 'lucide-react';
import { demoStore } from '../../store/demoStore';
import { UserType } from '../../data/types';

interface AccountTypeViewProps {
  onSelectType: (type: UserType) => void;
  onBrowseGuest: () => void;
}

export const AccountTypeView: React.FC<AccountTypeViewProps> = ({
  onSelectType,
  onBrowseGuest,
}) => {
  const { t, lang } = useT();
  const [showDemoPicker, setShowDemoPicker] = useState(false);

  const demoUsers = [
    { id: 'pt-mona', name: 'منى عادل (مريضة - رنين مغناطيسي سموحة)', type: 'patient' as const },
    { id: 'pt-ahmed', name: 'أحمد سمير (مريض - نتيجة معتمدة R-503)', type: 'patient' as const },
    { id: 'pt-salma', name: 'سلمى فتحي (مريضة - فحص ماموجرام)', type: 'patient' as const },
    { id: 'pt-hoda', name: 'هدى محمود (مريضة - بلاغ تأخير تقرير)', type: 'patient' as const },
    { id: 'dr-rania', name: 'د. رانيا فؤاد (طبيبة جراحة عظام - حساب معتمد)', type: 'doctor' as const },
  ];

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col justify-between p-6 text-[#252750] select-none">
      <div className="pt-4">
        <div className="w-10 h-10 rounded-xl bg-[#252750] text-[#D0AE29] font-black text-xs flex items-center justify-center mb-5">
          DA
        </div>

        <h2 className="text-xl font-bold mb-1.5">{t('account_type_title')}</h2>
        <p className="text-xs text-[#5B607A] mb-6">{t('account_type_subtitle')}</p>

        {/* Options */}
        <div className="space-y-3">
          {/* Patient Card */}
          <button
            onClick={() => onSelectType('patient')}
            className="w-full p-4 rounded-2xl bg-white border border-[#D9DBE6] hover:border-[#252750] hover:ring-2 hover:ring-[#252750]/10 text-start transition-all active:scale-99 shadow-xs flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E7E8F2] text-[#252750] flex items-center justify-center shrink-0 mt-0.5">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#252750] mb-0.5">
                {t('account_type_patient')}
              </div>
              <p className="text-[11px] text-[#5B607A] leading-relaxed">
                {t('account_type_patient_desc')}
              </p>
            </div>
          </button>

          {/* Doctor Card */}
          <button
            onClick={() => onSelectType('doctor')}
            className="w-full p-4 rounded-2xl bg-white border border-[#D9DBE6] hover:border-[#252750] hover:ring-2 hover:ring-[#252750]/10 text-start transition-all active:scale-99 shadow-xs flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#D0AE29]/20 text-[#8A6D12] flex items-center justify-center shrink-0 mt-0.5">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#252750] mb-0.5">
                {t('account_type_doctor')}
              </div>
              <p className="text-[11px] text-[#5B607A] leading-relaxed">
                {t('account_type_doctor_desc')}
              </p>
            </div>
          </button>
        </div>

        {/* Browse as Guest */}
        <div className="mt-5 text-center">
          <button
            onClick={onBrowseGuest}
            className="text-xs font-medium text-[#1F5FAD] hover:underline flex items-center justify-center gap-1.5 mx-auto py-2"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t('account_type_guest')}</span>
          </button>
        </div>
      </div>

      {/* Demo Fast Switcher Link */}
      <div className="pb-4">
        <div className="border-t border-[#D9DBE6] pt-4 text-center">
          <button
            onClick={() => setShowDemoPicker(!showDemoPicker)}
            className="text-[11px] text-[#8A6D12] bg-[#F3E7B8] hover:bg-[#F3E7B8]/80 py-1.5 px-3 rounded-lg font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t('account_type_demo_picker')}</span>
          </button>

          {showDemoPicker && (
            <div className="mt-3 p-2 bg-white rounded-xl border border-[#D9DBE6] shadow-md text-start space-y-1">
              <span className="text-[10px] text-[#5B607A] font-medium px-2 block">
                اختر مستخدم تجريبي جاهز لتخطي التسجيل:
              </span>
              {demoUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    demoStore.switchUser(u.id, u.type);
                  }}
                  className="w-full text-start px-2 py-1.5 text-[11px] rounded-lg hover:bg-[#F5F6FA] text-[#252750] font-medium transition-colors"
                >
                  {u.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
