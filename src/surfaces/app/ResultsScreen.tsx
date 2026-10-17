import React, { useState } from 'react';
import { ResultsCard } from '../../components/shared/ResultsCard';
import { FileCheck2, HelpCircle, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';
import { PortalReport } from '../../data/types';

interface ResultsScreenProps {
  onOpenChat: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onOpenChat }) => {
  const { lang, t } = useT();
  const state = demoStore.getState();

  const isDoctor = state.currentUserType === 'doctor';
  const currentUserId = state.currentUserId;

  // Filter reports
  // If patient: reports for this patient
  // If doctor: reports of patients referred by this doctor
  const releasedReports = state.portalReports.filter((r) => {
    if (isDoctor) {
      // Find referrals from this doctor
      const refCase = state.cases.find(
        (c) => c.type === 'RF' && c.doctorId === currentUserId && c.patientId === r.patientId
      );
      return Boolean(refCase);
    }
    return r.patientId === currentUserId;
  });

  const handleCantFindReport = () => {
    // Create RS case
    const caseId = `RS-${Math.floor(2000 + Math.random() * 8000)}`;
    const patient = state.patients.find((p) => p.id === currentUserId) || state.patients[0];

    const newCase = {
      id: caseId,
      type: 'RS' as const,
      patientId: currentUserId,
      stage: 'new' as const,
      ownerId: 'st-omar',
      teamId: 'team-results',
      channel: 'app' as const,
      priority: 'Normal' as const,
      createdMinAgo: 0,
      createdAt: new Date().toISOString(),
      summary: 'Patient requested search for missing report',
      summaryAr: 'طلب مريض بالبحث عن تقرير فحص لم يظهر بالتطبيق',
    };

    state.cases.unshift(newCase);

    demoStore.sendMessage({
      caseId,
      patientId: currentUserId,
      kind: 'text',
      from: 'patient',
      textAr: 'مرحباً، لم أتمكن من العثور على تقريري الأخير في قائمة النتائج، أرجو المساعدة في البحث عنه.',
      textEn: "Hello, I cannot find my recent report in My Results. Please help locate it.",
    });

    demoStore.addAudit('Results Search Request', 'طلب بحث عن نتائج مفقودة', `Case ${caseId}`);
    onOpenChat();
  };

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col overflow-hidden text-[#252750]">
      {/* Header */}
      <div className="bg-white px-5 py-3.5 border-b border-[#D9DBE6] shadow-xs select-none">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#252750]">
              {isDoctor ? t('doctor_quick_patient_results') : t('results_title')}
            </h2>
            <p className="text-[11px] text-[#5B607A]">
              {isDoctor
                ? 'تقارير المرضى المحولين المعتمدة بموجب موافقة المريض'
                : 'تسليم إلكتروني فوري فور اعتماد التقرير من الطبيب الاستشاري'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#E7E8F2] flex items-center justify-center text-[#1E7A55]">
            <FileCheck2 className="w-4 h-4" />
          </div>
        </div>

        {/* Doctor Audit Note */}
        {isDoctor && (
          <div className="mt-2.5 p-2 bg-[#E7E8F2]/60 rounded-xl flex items-center gap-1.5 text-[10px] text-[#5B607A]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1E7A55] shrink-0" />
            <span>{t('doctor_access_logged_note')}</span>
          </div>
        )}
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {releasedReports.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-[#E7E8F2] flex items-center justify-center mx-auto mb-4 text-[#5B607A]">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-[#252750] mb-1">
              لا توجد تقارير متاحة حالياً
            </h4>
            <p className="text-xs text-[#5B607A] max-w-xs mx-auto leading-relaxed mb-6">
              {t('results_empty')}
            </p>
            <button
              onClick={handleCantFindReport}
              className="py-2.5 px-4 bg-[#252750] hover:bg-[#3B3F7A] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-[#D0AE29]" />
              <span>{t('btn_cant_find')}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {releasedReports.map((report) => {
              const patient = state.patients.find((p) => p.id === report.patientId);
              const branch = state.branches.find((b) => b.id === report.branchId);

              // Doctor view: check consent
              const refCase = isDoctor
                ? state.cases.find(
                    (c) => c.type === 'RF' && c.doctorId === currentUserId && c.patientId === report.patientId
                  )
                : null;
              const hasConsent = !isDoctor || refCase?.referralConsent === 'recorded';

              if (!hasConsent) {
                return (
                  <div
                    key={report.id}
                    className="p-4 bg-white rounded-2xl border border-[#D9DBE6] shadow-xs text-start"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-[#A15C00] mb-1">
                      <Lock className="w-4 h-4" />
                      <span>{patient ? (lang === 'ar' ? patient.nameAr : patient.nameEn) : 'المريض'}</span>
                    </div>
                    <p className="text-xs text-[#5B607A]">
                      {t('doctor_consent_missing_warning')}
                    </p>
                  </div>
                );
              }

              return (
                <div key={report.id} className="flex justify-center">
                  <ResultsCard
                    report={report}
                    branchName={branch ? (lang === 'ar' ? branch.nameAr : branch.nameEn) : undefined}
                    patientName={isDoctor && patient ? (lang === 'ar' ? patient.nameAr : patient.nameEn) : undefined}
                  />
                </div>
              );
            })}

            {/* Cant find report footer button */}
            {!isDoctor && (
              <div className="pt-4 text-center">
                <button
                  onClick={handleCantFindReport}
                  className="text-xs text-[#1F5FAD] hover:underline font-medium inline-flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t('btn_cant_find')}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
