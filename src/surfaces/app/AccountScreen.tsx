import React, { useState } from 'react';
import {
  User,
  Globe,
  Bell,
  ShieldCheck,
  FileText,
  Phone,
  MessageCircle,
  Trash2,
  LogOut,
  ChevronRight,
  ExternalLink,
  Building2,
  Stethoscope,
} from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';
import { DeleteAccountModal } from './DeleteAccountModal';

interface AccountScreenProps {
  onSignOut: () => void;
  onOpenBranches: () => void;
  onOpenFaq: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  onSignOut,
  onOpenBranches,
  onOpenFaq,
}) => {
  const { lang, t, toggleLang, isRtl } = useT();
  const state = demoStore.getState();

  const currentPatient = state.patients.find((p) => p.id === state.currentUserId);
  const currentDoctor = state.doctors.find((d) => d.id === state.currentUserId);
  const isDoctor = state.currentUserType === 'doctor';

  const [messagePreviews, setMessagePreviews] = useState(false);
  const [offersConsent, setOffersConsent] = useState(
    currentPatient?.consents.offers ?? false
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleOffersToggle = () => {
    const next = !offersConsent;
    setOffersConsent(next);
    if (currentPatient) {
      demoStore.updateConsents(currentPatient.id, {
        ...currentPatient.consents,
        offers: next,
      });
    }
  };

  const displayName = isDoctor
    ? currentDoctor?.name || 'د. رانيا فؤاد'
    : currentPatient
    ? lang === 'ar'
      ? currentPatient.nameAr
      : currentPatient.nameEn
    : 'زائر';

  const displayPhone = isDoctor
    ? currentDoctor?.phone || '+20 10 9999 1101'
    : currentPatient?.phone || '+20 10 0000 4521';

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col overflow-y-auto text-[#252750] pb-24 select-none text-start">
      {/* Profile Header */}
      <div className="bg-white p-5 border-b border-[#D9DBE6] shadow-xs">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-[#252750] text-[#D0AE29] font-black text-lg flex items-center justify-center border-2 border-[#D0AE29]">
            {isDoctor ? 'DR' : 'PT'}
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h2 className="text-base font-bold text-[#252750]">{displayName}</h2>
              {isDoctor && (
                <span className="text-[10px] font-bold text-[#1E7A55] bg-[#1E7A55]/10 px-1.5 py-0.5 rounded">
                  {currentDoctor?.status === 'verified' ? 'طبيب معتمد' : 'قيد المراجعة'}
                </span>
              )}
            </div>
            <span className="text-xs text-[#5B607A] font-mono block" dir="ltr">
              {displayPhone}
            </span>
          </div>
        </div>

        {/* Demographics row for patient */}
        {!isDoctor && currentPatient && (
          <div className="grid grid-cols-3 gap-2 bg-[#F5F6FA] p-2.5 rounded-xl text-center text-xs text-[#5B607A]">
            <div>
              <span className="text-[10px] block">النوع:</span>
              <span className="font-semibold text-[#252750]">
                {currentPatient.gender === 'F' ? 'أنثى' : 'ذكر'}
              </span>
            </div>
            <div>
              <span className="text-[10px] block">العمر:</span>
              <span className="font-semibold text-[#252750]">
                {currentPatient.age} سنة
              </span>
            </div>
            <div>
              <span className="text-[10px] block">الفرع المفضل:</span>
              <span className="font-semibold text-[#252750]">
                {currentPatient.preferredBranch}
              </span>
            </div>
          </div>
        )}

        {isDoctor && currentDoctor && (
          <div className="bg-[#F5F6FA] p-2.5 rounded-xl text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#5B607A]">التخصص:</span>
              <span className="font-semibold text-[#252750]">{currentDoctor.specialtyAr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5B607A]">رقم القيد بالنقابة:</span>
              <span className="font-mono font-bold text-[#252750]" dir="ltr">{currentDoctor.syndicateNo}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Settings: Language & Notifications */}
        <div className="bg-white rounded-2xl border border-[#D9DBE6] p-4 shadow-xs space-y-3">
          <span className="text-[11px] font-bold text-[#5B607A] uppercase tracking-wider block">
            {t('account_settings_section')}
          </span>

          {/* Language Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5 text-xs text-[#252750] font-semibold">
              <Globe className="w-4 h-4 text-[#1F5FAD]" />
              <span>لغة التطبيق / App Language</span>
            </div>
            <button
              onClick={toggleLang}
              className="py-1 px-3 bg-[#E7E8F2] hover:bg-slate-200 text-[#252750] text-xs font-bold rounded-lg transition-colors"
            >
              {lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}
            </button>
          </div>

          {/* Notification Previews */}
          <div className="flex items-center justify-between py-1 border-t border-[#D9DBE6]/60">
            <div>
              <span className="text-xs font-semibold text-[#252750] block">
                معاينة محتوى الرسائل على شاشة القفل
              </span>
              <span className="text-[10px] text-[#5B607A]">
                مغلق افتراضياً لحماية خصوصية بياناتك الطبية
              </span>
            </div>
            <button
              onClick={() => setMessagePreviews(!messagePreviews)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                messagePreviews ? 'bg-[#252750]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${
                  messagePreviews ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Offers Consent */}
          <div className="flex items-center justify-between py-1 border-t border-[#D9DBE6]/60">
            <div>
              <span className="text-xs font-semibold text-[#252750] block">
                استلام عروض وحملات الفحص الدوري
              </span>
              <span className="text-[10px] text-[#5B607A]">
                عبر الإشعارات أو الواتساب
              </span>
            </div>
            <button
              onClick={handleOffersToggle}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                offersConsent ? 'bg-[#D0AE29]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${
                  offersConsent ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Privacy & PDPL Compliance */}
        <div className="bg-white rounded-2xl border border-[#D9DBE6] p-4 shadow-xs space-y-2.5">
          <span className="text-[11px] font-bold text-[#5B607A] uppercase tracking-wider block">
            {t('account_privacy_section')}
          </span>

          <div className="p-3 bg-[#E7E8F2]/60 rounded-xl space-y-1.5 text-xs text-[#5B607A]">
            <div className="flex items-center gap-1.5 font-bold text-[#1E7A55]">
              <ShieldCheck className="w-4 h-4 text-[#1E7A55]" />
              <span>موافقات مسجلة وموثقة قانونياً (PDPL Law 151)</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              الإصدار المعتمد: <span className="font-mono font-bold text-[#252750]">v1.0-draft</span>
              <br />
              تاريخ التسجيل: ٢٠٢٦/١٠/٠٧
            </p>
          </div>

          <button
            onClick={() => alert('يمكنك تقديم طلب رسمي بالحصول على نسخة كاملة من بياناتك لضابط الامتثال وحماية البيانات (DPO).')}
            className="w-full py-2.5 text-start text-xs font-semibold text-[#1F5FAD] hover:underline flex items-center justify-between"
          >
            <span>طلب نسخة رسمية من بياناتي الشخصية</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Support & Centers */}
        <div className="bg-white rounded-2xl border border-[#D9DBE6] p-4 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-[#5B607A] uppercase tracking-wider block">
            {t('account_support_section')}
          </span>

          <button
            onClick={onOpenBranches}
            className="w-full py-2 flex items-center justify-between text-xs font-semibold text-[#252750] hover:bg-slate-50 rounded-lg px-1 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#D0AE29]" />
              <span>فروع دار الأشعة وأرقام الهواتف</span>
            </div>
            <span>›</span>
          </button>

          <button
            onClick={onOpenFaq}
            className="w-full py-2 flex items-center justify-between text-xs font-semibold text-[#252750] hover:bg-slate-50 rounded-lg px-1 transition-colors border-t border-[#D9DBE6]/60"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1F5FAD]" />
              <span>الأسئلة الشائعة حول الفحوصات</span>
            </div>
            <span>›</span>
          </button>
        </div>

        {/* Danger zone & Sign out */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-3 bg-white hover:bg-red-50 text-[#B3261E] border border-red-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('btn_delete_account')}</span>
          </button>

          <button
            onClick={onSignOut}
            className="w-full py-3 bg-[#E7E8F2] hover:bg-slate-200 text-[#252750] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('btn_sign_out')}</span>
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onDeleted={() => {
            setShowDeleteModal(false);
            onSignOut();
          }}
        />
      )}
    </div>
  );
};
