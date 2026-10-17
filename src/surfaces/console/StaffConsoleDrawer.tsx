import React, { useState } from 'react';
import {
  X,
  Send,
  Calendar,
  FileCheck2,
  Lock,
  CheckCircle,
  Clock,
  UserCheck,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { demoStore } from '../../store/demoStore';
import { useT } from '../../i18n';
import { MessageBubble } from '../../components/shared/MessageBubble';
import { Staff, Case, PortalReport } from '../../data/types';

interface StaffConsoleDrawerProps {
  onClose: () => void;
}

export const StaffConsoleDrawer: React.FC<StaffConsoleDrawerProps> = ({ onClose }) => {
  const { lang, isRtl } = useT();
  const state = demoStore.getState();

  const [activeStaffId, setActiveStaffId] = useState('st-nour'); // Nour Hamdy
  const [selectedCaseId, setSelectedCaseId] = useState('BK-1042');
  const [inputText, setInputText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showSendResultsModal, setShowSendResultsModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Form states for slot offer
  const [slotDay, setSlotDay] = useState('الأحد ١٢ أكتوبر');
  const [slotTime, setSlotTime] = useState('11:00 AM');
  const [slotBranchId, setSlotBranchId] = useState('br-smouha');

  // Form states for close case
  const [closeOutcome, setCloseOutcome] = useState('Booked');

  const activeStaff = state.staff.find((s) => s.id === activeStaffId) || state.staff[2];
  const selectedCase = state.cases.find((c) => c.id === selectedCaseId) || state.cases[0];
  const casePatient = state.patients.find((p) => p.id === selectedCase?.patientId);

  // Filter messages for current case / patient
  const caseMessages = state.messages.filter(
    (m) => m.patientId === selectedCase?.patientId
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (isInternalNote) {
      demoStore.sendMessage({
        caseId: selectedCase.id,
        patientId: selectedCase.patientId,
        kind: 'internal_note',
        from: 'staff',
        staffId: activeStaff.id,
        textAr: inputText,
        textEn: inputText,
      });
      setIsInternalNote(false);
    } else {
      demoStore.sendMessage({
        caseId: selectedCase.id,
        patientId: selectedCase.patientId,
        kind: 'text',
        from: 'staff',
        staffId: activeStaff.id,
        textAr: inputText,
        textEn: inputText,
      });
    }

    setInputText('');
  };

  const handleOfferSlotSubmit = () => {
    demoStore.offerSlot(selectedCase.id, slotDay, slotTime, slotBranchId);
    setShowSlotModal(false);
  };

  const handleCloseCaseSubmit = () => {
    demoStore.closeCase(selectedCase.id, closeOutcome, true);
    setShowCloseModal(false);
  };

  const handleReleaseReportSubmit = (report: PortalReport) => {
    demoStore.releaseReport(report.id, `${activeStaff.name} (Results Team)`);
    setShowSendResultsModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col text-[#252750]">
        {/* Top Header of Console */}
        <div className="bg-[#252750] text-white px-5 py-3 flex items-center justify-between border-b border-[#D0AE29]/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D0AE29] text-[#252750] font-black text-xs flex items-center justify-center">
              DA
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-2">
                <span>لوحة تحكم الفريق الطبي · Staff Workspace Console</span>
                <span className="text-[10px] bg-[#D0AE29] text-[#252750] px-1.5 py-0.2 rounded font-bold">
                  {activeStaff.role}
                </span>
              </div>
              <div className="text-[10px] text-white/70">
                الموظف الحالي: {activeStaff.name} ({activeStaff.email})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Staff Switcher */}
            <select
              value={activeStaffId}
              onChange={(e) => setActiveStaffId(e.target.value)}
              className="bg-white/10 hover:bg-white/20 text-white text-[11px] rounded-lg px-2 py-1 border border-white/20 focus:outline-none"
            >
              <option value="st-nour" className="text-black">نور حمدي (فريق الحجوزات)</option>
              <option value="st-omar" className="text-black">عمر خالد (فريق النتائج)</option>
              <option value="st-dina" className="text-black">دينا فاروق (مشرفة الفرق)</option>
              <option value="st-laila" className="text-black">ليلى مصطفى (علاقات الأطباء)</option>
              <option value="st-sherif" className="text-black">شريف عادل (مدير المنظومة)</option>
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Console 3-Pane Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Queue List (30%) */}
          <div className="w-72 border-e border-[#D9DBE6] bg-[#F5F6FA] flex flex-col text-start overflow-hidden">
            <div className="p-3 border-b border-[#D9DBE6] bg-white">
              <span className="text-xs font-bold text-[#252750] block mb-1">
                صندوق الحالات والمحادثات
              </span>
              <div className="flex gap-1 text-[11px]">
                <span className="bg-[#252750] text-white px-2 py-0.5 rounded font-bold">
                  المفتوحة ({state.cases.filter((c) => c.stage !== 'closed').length})
                </span>
                <span className="bg-slate-200 text-[#5B607A] px-2 py-0.5 rounded font-medium">
                  الكل ({state.cases.length})
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#D9DBE6]">
              {state.cases.map((c) => {
                const patient = state.patients.find((p) => p.id === c.patientId);
                const isSelected = selectedCaseId === c.id;

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`w-full p-3 text-start transition-colors flex flex-col gap-1 ${
                      isSelected ? 'bg-white shadow-xs border-s-4 border-s-[#252750]' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-[#252750] truncate">
                        {patient ? patient.nameAr : c.id}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#5B607A]" dir="ltr">
                        {c.id}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#5B607A] line-clamp-1">
                      {c.summaryAr || c.summary}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold text-[#D0AE29] bg-[#252750] px-1.5 py-0.5 rounded">
                        {c.stage}
                      </span>
                      <span className="text-[10px] text-[#1E7A55] font-semibold">
                        SLA متوافق
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Pane: Thread & Staff Composer (45%) */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden text-start">
            {/* Thread Header */}
            <div className="px-4 py-2.5 border-b border-[#D9DBE6] flex items-center justify-between bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#252750]">
                    {casePatient ? casePatient.nameAr : 'المريض'}
                  </h4>
                  <span className="font-mono text-[11px] bg-[#E7E8F2] text-[#252750] px-1.5 py-0.2 rounded font-bold" dir="ltr">
                    {selectedCase?.id}
                  </span>
                </div>
                <span className="text-[10px] text-[#5B607A]">
                  المرحلة: {selectedCase?.stage} · المسؤول: {activeStaff.name}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowSlotModal(true)}
                  className="py-1 px-2.5 bg-[#252750] hover:bg-[#3B3F7A] text-white text-[11px] font-bold rounded-lg transition-colors shadow-xs"
                >
                  اقتراح موعد
                </button>
                <button
                  onClick={() => setShowSendResultsModal(true)}
                  className="py-1 px-2.5 bg-[#D0AE29] hover:bg-[#D0AE29]/90 text-[#252750] text-[11px] font-bold rounded-lg transition-colors shadow-xs"
                >
                  إرسال نتيجة
                </button>
                <button
                  onClick={() => setShowCloseModal(true)}
                  className="py-1 px-2.5 bg-slate-200 hover:bg-slate-300 text-[#252750] text-[11px] font-bold rounded-lg transition-colors"
                >
                  إغلاق الطلب
                </button>
              </div>
            </div>

            {/* Thread Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#F5F6FA]">
              {caseMessages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  currentUserId={selectedCase.patientId}
                  isStaffView={true}
                />
              ))}
            </div>

            {/* Staff Composer */}
            <div className="p-3 border-t border-[#D9DBE6] bg-white">
              {/* Quick Canned Macros Bar */}
              <div className="flex items-center gap-1.5 mb-2 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-bold text-[#5B607A]">ردود جاهزة:</span>
                {state.cannedResponses.map((cr) => (
                  <button
                    key={cr.shortcut}
                    type="button"
                    onClick={() => {
                      const text = cr.textAr.replace('{first_name}', casePatient?.nameAr?.split(' ')[0] || '');
                      setInputText(text);
                    }}
                    className="text-[10px] bg-[#E7E8F2] hover:bg-slate-200 text-[#252750] px-2 py-0.5 rounded font-medium whitespace-nowrap"
                  >
                    {cr.titleAr}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInternalNote(!isInternalNote)}
                    className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                      isInternalNote
                        ? 'bg-[#D0AE29] text-[#252750]'
                        : 'bg-slate-100 text-[#5B607A] hover:bg-slate-200'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>ملاحظة داخلية</span>
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      isInternalNote
                        ? 'اكتب ملاحظة داخلية لطاقم العمل فقط...'
                        : `الرد على ${casePatient?.nameAr || 'المريض'}...`
                    }
                    className={`flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none ${
                      isInternalNote
                        ? 'border-[#D0AE29] bg-[#F3E7B8]/40'
                        : 'border-[#D9DBE6] bg-[#F5F6FA]'
                    }`}
                  />

                  <button
                    type="submit"
                    className="py-2 px-3 bg-[#252750] hover:bg-[#3B3F7A] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    إرسال
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Pane: Patient Context & Consents (25%) */}
          <div className="w-64 border-s border-[#D9DBE6] bg-white p-4 text-start overflow-y-auto space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#5B607A] uppercase tracking-wider block mb-2">
                سياق المريض والتحقق
              </span>
              <h5 className="font-bold text-sm text-[#252750]">
                {casePatient ? casePatient.nameAr : 'المريض'}
              </h5>
              <div className="text-xs text-[#5B607A] font-mono mt-0.5" dir="ltr">
                {casePatient?.phone}
              </div>
            </div>

            <div className="bg-[#F5F6FA] p-3 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5B607A]">النوع:</span>
                <span className="font-semibold">{casePatient?.gender === 'F' ? 'أنثى' : 'ذكر'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B607A]">العمر:</span>
                <span className="font-semibold">{casePatient?.age} سنة</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B607A]">الفرع المفضل:</span>
                <span className="font-semibold">{casePatient?.preferredBranch}</span>
              </div>
            </div>

            {/* Consents Gating Status */}
            <div>
              <span className="text-[11px] font-bold text-[#5B607A] block mb-1">
                سجل الموافقات (PDPL Law 151):
              </span>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#1E7A55] font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>معالجة البيانات الصحية: موافق</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#1E7A55] font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>التخزين السحابي الآمن: موافق</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5B607A]">
                  <CheckCircle className={`w-3.5 h-3.5 ${casePatient?.consents.offers ? 'text-[#1E7A55]' : 'text-slate-300'}`} />
                  <span>العروض والأخبار: {casePatient?.consents.offers ? 'موافق' : 'غير مشترك'}</span>
                </div>
              </div>
            </div>

            {/* Pending Doctor Verification Section if case is RF */}
            {selectedCase?.type === 'RF' && (
              <div className="pt-2 border-t border-[#D9DBE6] space-y-2">
                <span className="text-[11px] font-bold text-[#252750] block">
                  اعتماد الطبيب المحول:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => demoStore.verifyDoctor('dr-rania', 'verified')}
                    className="flex-1 py-1.5 bg-[#1E7A55] text-white text-[11px] font-bold rounded-lg shadow-xs"
                  >
                    اعتماد الطبيب
                  </button>
                  <button
                    onClick={() => demoStore.verifyDoctor('dr-rania', 'rejected', 'بيانات غير مطابقة')}
                    className="flex-1 py-1.5 bg-[#B3261E] text-white text-[11px] font-bold rounded-lg"
                  >
                    رفض
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Offer Slot */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full text-start text-[#252750] space-y-3">
            <h4 className="font-bold text-sm">اقتراح موعد فحص للمريض</h4>
            <div>
              <label className="text-xs font-semibold block mb-1">اليوم والتاريخ:</label>
              <input
                type="text"
                value={slotDay}
                onChange={(e) => setSlotDay(e.target.value)}
                className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl p-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">الساعة:</label>
              <input
                type="text"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl p-2 text-xs font-mono"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">الفرع:</label>
              <select
                value={slotBranchId}
                onChange={(e) => setSlotBranchId(e.target.value)}
                className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl p-2 text-xs"
              >
                {state.branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.nameAr}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleOfferSlotSubmit}
                className="flex-1 py-2.5 bg-[#252750] text-white text-xs font-bold rounded-xl"
              >
                إرسال عرض الموعد
              </button>
              <button
                onClick={() => setShowSlotModal(false)}
                className="py-2.5 px-3 bg-slate-100 text-[#5B607A] text-xs font-medium rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Send Results (C-06 with identity check!) */}
      {showSendResultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full text-start text-[#252750] space-y-3">
            <h4 className="font-bold text-sm">إرسال نتيجة فحص معتمدة (C-06)</h4>
            <div className="p-3 bg-[#1E7A55]/10 border border-[#1E7A55]/30 rounded-xl flex items-center gap-2 text-xs text-[#1E7A55] font-bold">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>تم التحقق من مطابقة رقم هاتف المريض مع سجل الزيارة الطبية</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#5B607A] block">
                اختر الفحص المراد إرسال تقريره:
              </span>
              {state.portalReports.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleReleaseReportSubmit(r)}
                  className="p-3 bg-[#F5F6FA] hover:bg-slate-100 rounded-xl border border-[#D9DBE6] cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#252750] block">{r.examAr}</span>
                    <span className="text-[10px] text-[#5B607A]">زيارة رقم: {r.visitNo} · تاريخ: {r.date}</span>
                  </div>
                  <span className="py-1 px-2.5 bg-[#252750] text-white text-[11px] font-bold rounded-lg">
                    اعتماد وإرسال
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-end">
              <button
                onClick={() => setShowSendResultsModal(false)}
                className="py-2 px-4 bg-slate-100 text-[#5B607A] text-xs font-medium rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Close Case (C-07) */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full text-start text-[#252750] space-y-3">
            <h4 className="font-bold text-sm">إغلاق الطلب وتسجيل النتيجة</h4>
            <div>
              <label className="text-xs font-semibold block mb-1">النتيجة النهائية (Outcome):</label>
              <select
                value={closeOutcome}
                onChange={(e) => setCloseOutcome(e.target.value)}
                className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl p-2.5 text-xs font-semibold text-[#252750]"
              >
                <option value="Booked">تم الحجز بنجاح (Booked)</option>
                <option value="Released">تم تسليم النتيجة (Released)</option>
                <option value="Resolved">تم حل المشكلة (Resolved)</option>
                <option value="Patient declined">اعتذر المريض (Declined)</option>
              </select>
            </div>
            <div className="p-2.5 bg-[#E7E8F2] rounded-xl text-[11px] text-[#5B607A]">
              سيتم إرسال بطاقة تقييم الخدمة (١ إلى ٥ نجوم) للمريض تلقائياً فور الإغلاق.
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCloseCaseSubmit}
                className="flex-1 py-2.5 bg-[#252750] text-white text-xs font-bold rounded-xl"
              >
                تأكيد الإغلاق
              </button>
              <button
                onClick={() => setShowCloseModal(false)}
                className="py-2.5 px-3 bg-slate-100 text-[#5B607A] text-xs font-medium rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
