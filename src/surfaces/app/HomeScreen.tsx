import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  FileCheck2,
  MessageSquare,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Phone,
  Stethoscope,
  Share2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Building2,
} from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';
import { Promotion, Service, Branch } from '../../data/types';
import { ServiceDetailModal } from './ServiceDetailModal';
import { BranchesModal } from './BranchesModal';
import { NotificationsModal } from './NotificationsModal';
import { FaqModal } from './FaqModal';
import { PromotionDetailModal } from './PromotionDetailModal';

interface HomeScreenProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenChat: () => void;
  onOpenResults: () => void;
  onOpenRequests: () => void;
  onOpenReferral: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenBooking,
  onOpenChat,
  onOpenResults,
  onOpenRequests,
  onOpenReferral,
}) => {
  const { lang, t, isRtl } = useT();
  const state = demoStore.getState();

  const currentPatient = state.patients.find((p) => p.id === state.currentUserId);
  const currentDoctor = state.doctors.find((d) => d.id === state.currentUserId);
  const isDoctor = state.currentUserType === 'doctor';

  // Modals state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [showBranchesModal, setShowBranchesModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);

  // Active open request banner
  const openCase = state.cases.find(
    (c) =>
      c.patientId === state.currentUserId &&
      c.stage !== 'closed' &&
      c.stage !== 'resolved'
  );

  // Filter promotions by audience (age, gender, userType)
  const userGender = currentPatient?.gender || 'F';
  const userAge = currentPatient?.age || 34;

  const relevantPromotions = state.promotions.filter((p) => {
    if (p.status !== 'live') return false;
    if (isDoctor) {
      return p.audience.userType === 'doctor' || p.audience.userType === 'all';
    }
    if (p.audience.userType === 'doctor') return false;
    if (p.audience.gender && p.audience.gender !== 'any' && p.audience.gender !== userGender) {
      return false;
    }
    if (p.audience.ageMin && userAge < p.audience.ageMin) return false;
    if (p.audience.ageMax && userAge > p.audience.ageMax) return false;
    return true;
  });

  const [promoIndex, setPromoIndex] = useState(0);

  // Greeting
  const userName = isDoctor
    ? currentDoctor?.name || 'د. رانيا فؤاد'
    : currentPatient
    ? lang === 'ar'
      ? currentPatient.nameAr
      : currentPatient.nameEn
    : lang === 'ar'
    ? 'زائرنا الكريم'
    : 'Valued Guest';

  return (
    <div className="flex-1 bg-[#F5F6FA] overflow-y-auto text-[#252750] pb-20 select-none">
      {/* Top Header */}
      <div className="bg-white px-5 pt-3 pb-4 border-b border-[#D9DBE6] shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#252750] text-[#D0AE29] font-black text-xs flex items-center justify-center border border-[#D0AE29]/40">
              DA
            </div>
            <div>
              <span className="text-[11px] text-[#5B607A] block font-medium">
                {t('greeting_evening')}،
              </span>
              <h2 className="text-sm font-bold text-[#252750] truncate max-w-[180px]">
                {userName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications Button */}
            <button
              onClick={() => setShowNotificationsModal(true)}
              aria-label="Notifications"
              className="relative p-2.5 rounded-xl bg-[#F5F6FA] hover:bg-[#E7E8F2] text-[#252750] transition-colors"
            >
              <Bell className="w-4 h-4" />
              {state.notifications.some((n) => !n.isRead) && (
                <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-[#D0AE29] ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>

        {/* Doctor Verification Banner (if pending) */}
        {isDoctor && currentDoctor?.status === 'pending' && (
          <div className="mt-3 p-3 bg-[#A15C00]/10 border border-[#A15C00]/30 rounded-xl text-start">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#A15C00] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#A15C00] block mb-0.5">
                  حساب الطبيب قيد المراجعة النقابية
                </span>
                <p className="text-[11px] text-[#5B607A] leading-relaxed">
                  {t('doctor_pending_banner')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Open Request Banner */}
        {openCase && (
          <div
            onClick={onOpenChat}
            className="mt-3 p-3 bg-[#E7E8F2] hover:bg-[#E7E8F2]/90 border border-[#252750]/15 rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#D0AE29] animate-ping" />
              <div>
                <span className="text-[10px] font-mono font-bold text-[#252750]" dir="ltr">
                  {openCase.id}
                </span>
                <div className="text-xs font-bold text-[#252750]">
                  {openCase.stage === 'slot-offered'
                    ? 'تم اقتراح موعد للفحص - يتطلب تأكيدك'
                    : openCase.stage === 'confirmed'
                    ? 'تم تأكيد موعد فحصك بنجاح'
                    : openCase.stage === 'released'
                    ? 'تقريرك الطبي متاح الآن للاستلام'
                    : 'طلبك قيد المتابعة من الفريق'}
                </div>
              </div>
            </div>
            <button className="text-[11px] font-bold text-[#252750] bg-white px-2.5 py-1 rounded-lg border border-[#D9DBE6]">
              {t('btn_view')}
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-5">
        {/* Quick Action Grid */}
        <div>
          {isDoctor ? (
            <div className="grid grid-cols-2 gap-2.5">
              {/* Doctor Quick Actions */}
              <button
                onClick={onOpenReferral}
                className="p-3.5 bg-[#252750] text-white rounded-2xl text-start shadow-sm active:scale-98 transition-all flex flex-col justify-between h-24"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#D0AE29]">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">{t('doctor_quick_new_referral')}</span>
                  <span className="text-[10px] text-white/70">تحويل مريض بالأشعة</span>
                </div>
              </button>

              <button
                onClick={onOpenRequests}
                className="p-3.5 bg-white border border-[#D9DBE6] text-[#252750] rounded-2xl text-start shadow-xs active:scale-98 transition-all flex flex-col justify-between h-24 hover:bg-slate-50"
              >
                <div className="w-8 h-8 rounded-xl bg-[#E7E8F2] flex items-center justify-center text-[#252750]">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">{t('doctor_quick_my_referrals')}</span>
                  <span className="text-[10px] text-[#5B607A]">متابعة مراحل الفحص</span>
                </div>
              </button>

              <button
                onClick={onOpenResults}
                className="p-3.5 bg-white border border-[#D9DBE6] text-[#252750] rounded-2xl text-start shadow-xs active:scale-98 transition-all flex flex-col justify-between h-24 hover:bg-slate-50"
              >
                <div className="w-8 h-8 rounded-xl bg-[#E7E8F2] flex items-center justify-center text-[#1E7A55]">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">{t('doctor_quick_patient_results')}</span>
                  <span className="text-[10px] text-[#5B607A]">التقارير المعتمدة</span>
                </div>
              </button>

              <button
                onClick={onOpenChat}
                className="p-3.5 bg-white border border-[#D9DBE6] text-[#252750] rounded-2xl text-start shadow-xs active:scale-98 transition-all flex flex-col justify-between h-24 hover:bg-slate-50"
              >
                <div className="w-8 h-8 rounded-xl bg-[#E7E8F2] flex items-center justify-center text-[#1F5FAD]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">{t('doctor_quick_doctor_relations')}</span>
                  <span className="text-[10px] text-[#5B607A]">تواصل مع الفريق الطبي</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {/* Patient Quick Actions (First tile navy filled with gold accent) */}
              <button
                onClick={() => onOpenBooking()}
                className="p-3.5 bg-[#252750] text-white rounded-2xl text-start shadow-sm active:scale-98 transition-all flex flex-col justify-between h-24"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#D0AE29]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">{t('quick_book')}</span>
                  <span className="text-[10px] text-white/70">حجز أسرع بدون انتظار</span>
                </div>
              </button>

              <button
                onClick={onOpenResults}
                className="p-3.5 bg-white border border-[#D9DBE6] text-[#252750] rounded-2xl text-start shadow-xs active:scale-98 transition-all flex flex-col justify-between h-24 hover:bg-slate-50"
              >
                <div className="w-8 h-8 rounded-xl bg-[#E7E8F2] flex items-center justify-center text-[#252750]">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">{t('quick_results')}</span>
                  <span className="text-[10px] text-[#5B607A]">رمز QR ورابط التقرير</span>
                </div>
              </button>

              <button
                onClick={onOpenChat}
                className="p-3.5 bg-white border border-[#D9DBE6] text-[#252750] rounded-2xl text-start shadow-xs active:scale-98 transition-all flex flex-col justify-between h-24 hover:bg-slate-50"
              >
                <div className="w-8 h-8 rounded-xl bg-[#E7E8F2] flex items-center justify-center text-[#1F5FAD]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">{t('quick_chat')}</span>
                  <span className="text-[10px] text-[#5B607A]">رد فوري من الأخصائيين</span>
                </div>
              </button>

              <button
                onClick={() => setShowBranchesModal(true)}
                className="p-3.5 bg-white border border-[#D9DBE6] text-[#252750] rounded-2xl text-start shadow-xs active:scale-98 transition-all flex flex-col justify-between h-24 hover:bg-slate-50"
              >
                <div className="w-8 h-8 rounded-xl bg-[#E7E8F2] flex items-center justify-center text-[#1E7A55]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">{t('quick_branches')}</span>
                  <span className="text-[10px] text-[#5B607A]">٤ فروع بالإسكندرية</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Promotions Carousel (Targeted, swipeable, dots, NO auto-advance per spec) */}
        {relevantPromotions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[#252750]">
                {t('section_promotions')}
              </h3>
              <div className="flex items-center gap-1">
                {relevantPromotions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPromoIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      promoIndex === i ? 'w-4 bg-[#252750]' : 'w-1.5 bg-[#D9DBE6]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div
              onClick={() => setSelectedPromotion(relevantPromotions[promoIndex])}
              className="p-4 bg-gradient-to-br from-[#252750] to-[#3B3F7A] text-white rounded-2xl shadow-sm cursor-pointer relative overflow-hidden transition-all active:scale-[0.99]"
            >
              <div className="absolute top-0 end-0 w-24 h-24 bg-[#D0AE29]/20 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#D0AE29] bg-[#D0AE29]/20 px-2 py-0.5 rounded-md">
                  حملة مميزة
                </span>
                <span className="text-[10px] text-white/70" dir="ltr">
                  {relevantPromotions[promoIndex].end}
                </span>
              </div>
              <h4 className="text-sm font-bold leading-snug mb-1">
                {lang === 'ar'
                  ? relevantPromotions[promoIndex].titleAr
                  : relevantPromotions[promoIndex].titleEn}
              </h4>
              <p className="text-[11px] text-white/80 line-clamp-2 leading-relaxed mb-3">
                {lang === 'ar'
                  ? relevantPromotions[promoIndex].bodyAr
                  : relevantPromotions[promoIndex].bodyEn}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#D0AE29]">
                <span>تفاصيل الحملة والحجز</span>
                <span>{isRtl ? '←' : '→'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid (10 services) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-[#252750]">
              {t('section_services')}
            </h3>
            <span className="text-[11px] text-[#5B607A]">١٠ خدمات متخصصة</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {state.services.map((svc) => (
              <button
                key={svc.id}
                onClick={() => setSelectedService(svc)}
                className="p-3 bg-white border border-[#D9DBE6] rounded-2xl text-start hover:border-[#252750] transition-colors shadow-xs active:scale-98"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#8A6D12] bg-[#F3E7B8] px-1.5 py-0.5 rounded">
                    {svc.short}
                  </span>
                  <span className="text-[10px] text-[#5B607A]" dir="ltr">
                    {lang === 'ar' ? svc.durationAr : svc.durationEn}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#252750] leading-snug mb-1">
                  {lang === 'ar' ? svc.ar : svc.en}
                </div>
                <span className="text-[10px] text-[#1F5FAD] font-medium flex items-center gap-0.5">
                  <span>التحضير والتفاصيل</span>
                  <span>›</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Branches Preview Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#D9DBE6] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#252750]">
              {t('section_branches')}
            </h3>
            <button
              onClick={() => setShowBranchesModal(true)}
              className="text-[11px] text-[#1F5FAD] font-semibold hover:underline"
            >
              {t('showAll')}
            </button>
          </div>

          <div className="space-y-2">
            {state.branches.slice(0, 2).map((b) => (
              <div
                key={b.id}
                onClick={() => setShowBranchesModal(true)}
                className="p-2.5 bg-[#F5F6FA] rounded-xl flex items-center justify-between text-xs cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div>
                  <span className="font-bold text-[#252750] block">
                    {lang === 'ar' ? b.nameAr : b.nameEn}
                  </span>
                  <span className="text-[10px] text-[#5B607A]">
                    {lang === 'ar' ? b.addressAr : b.addressEn}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#1E7A55] bg-[#1E7A55]/10 px-2 py-0.5 rounded-full shrink-0">
                  {t('openNow')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Preview (3 questions) */}
        <div className="bg-white p-4 rounded-2xl border border-[#D9DBE6] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#252750]">
              {t('section_faq')}
            </h3>
            <button
              onClick={() => setShowFaqModal(true)}
              className="text-[11px] text-[#1F5FAD] font-semibold hover:underline"
            >
              {t('showAll')}
            </button>
          </div>

          <div className="space-y-2">
            {state.faq.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => setShowFaqModal(true)}
                className="p-2.5 bg-[#F5F6FA] rounded-xl text-xs cursor-pointer hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <span className="font-semibold text-[#252750]">
                  {lang === 'ar' ? item.qAr : item.qEn}
                </span>
                <span className="text-[#5B607A]">›</span>
              </div>
            ))}
          </div>
        </div>

        {/* About & Founders (Collapsible) */}
        <div className="bg-white p-4 rounded-2xl border border-[#D9DBE6] shadow-xs">
          <button
            onClick={() => setAboutExpanded(!aboutExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#252750]"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#D0AE29]" />
              <span>{t('section_about')}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#5B607A] transition-transform ${
                aboutExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {aboutExpanded && (
            <div className="mt-3 pt-3 border-t border-[#D9DBE6] text-xs text-[#5B607A] space-y-2.5 leading-relaxed text-start">
              <p>
                تعد مجموعة دار الأشعة من أعرق الصروح الطبية التخصصية في الإسكندرية منذ تأسيسها، وتضم نخبة من كبار أساتذة واستشاريي الأشعة التشخيصية والتداخلية بطاقم طبي يتجاوز ٥٠٠ متخصص لخدمة أكثر من ١٠٠٠ مراجع يومياً عبر أربعة فروع رئيسية.
              </p>
              <div className="bg-[#F5F6FA] p-3 rounded-xl space-y-1">
                <span className="font-bold text-[#252750] block text-[11px]">
                  مجلس الإدارة المؤسس:
                </span>
                <ul className="text-[11px] space-y-0.5 list-disc ps-4 text-[#5B607A]">
                  <li>أ.د. عبد القادر الديب — رئيس مجلس الإدارة</li>
                  <li>أ.د. حسن خميس — العضو المنتدب والرئيس التنفيذي</li>
                  <li>أ.د. إيهاب رضا — نائب رئيس مجلس الإدارة</li>
                  <li>أ.د. طارق رشاد — نائب رئيس مجلس الإدارة</li>
                  <li>أ.د. مدحت الطيبي — عضو مجلس الإدارة</li>
                  <li>أ.د. محمود الشيخ — عضو مجلس الإدارة</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBookThisScan={(svcId) => onOpenBooking(svcId)}
        />
      )}

      {selectedPromotion && (
        <PromotionDetailModal
          promotion={selectedPromotion}
          onClose={() => setSelectedPromotion(null)}
          onBookScan={(svcId) => onOpenBooking(svcId)}
        />
      )}

      {showBranchesModal && (
        <BranchesModal
          onClose={() => setShowBranchesModal(false)}
          onBookAtBranch={() => onOpenBooking()}
        />
      )}

      {showNotificationsModal && (
        <NotificationsModal
          onClose={() => setShowNotificationsModal(false)}
          onNavigateToTab={(tab) => {
            if (tab === 'chat') onOpenChat();
            if (tab === 'results') onOpenResults();
            if (tab === 'requests') onOpenRequests();
          }}
        />
      )}

      {showFaqModal && (
        <FaqModal
          onClose={() => setShowFaqModal(false)}
          onOpenChat={onOpenChat}
        />
      )}
    </div>
  );
};
