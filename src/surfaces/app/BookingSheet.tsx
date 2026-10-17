import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Upload, FileText, CheckCircle } from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';

interface BookingSheetProps {
  initialServiceId?: string;
  onClose: () => void;
  onSubmitted: (caseId: string) => void;
}

export const BookingSheet: React.FC<BookingSheetProps> = ({
  initialServiceId,
  onClose,
  onSubmitted,
}) => {
  const { t, lang } = useT();
  const services = demoStore.getState().services;
  const branches = demoStore.getState().branches;

  const [serviceId, setServiceId] = useState(initialServiceId || services[0]?.id || 'svc-mri');
  const [bodyArea, setBodyArea] = useState('');
  const [branchId, setBranchId] = useState('br-smouha');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [notes, setNotes] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  // Generate next 7 days chips
  const daysList = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayNameAr = d.toLocaleDateString('ar-EG', { weekday: 'short' });
    const dayNameEn = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const monthAr = d.toLocaleDateString('ar-EG', { month: 'short' });
    const monthEn = d.toLocaleDateString('en-US', { month: 'short' });
    return {
      labelAr: `${dayNameAr} ${dayNum} ${monthAr}`,
      labelEn: `${dayNameEn} ${dayNum} ${monthEn}`,
      value: `${dayNameEn} ${dayNum}`,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenDay = lang === 'ar' ? daysList[selectedDayIndex].labelAr : daysList[selectedDayIndex].labelEn;
    const timeText =
      selectedTimeSlot === 'morning'
        ? t('time_morning')
        : selectedTimeSlot === 'afternoon'
        ? t('time_afternoon')
        : t('time_evening');

    const caseId = demoStore.createBooking({
      serviceId,
      bodyArea: bodyArea || (lang === 'ar' ? 'فحص تشخيصي' : 'Diagnostic scan'),
      branchId,
      day: chosenDay,
      time: timeText,
      notes: notes || undefined,
    });

    onSubmitted(caseId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[90vh] flex flex-col text-[#252750] shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Handle bar */}
        <div className="w-12 h-1.5 bg-[#D9DBE6] rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-[#D9DBE6] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#252750]">
              {t('booking_form_title')}
            </h3>
            <p className="text-[11px] text-[#5B607A]">
              {t('booking_form_desc')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F5F6FA] text-[#5B607A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-start">
          {/* Scan Type */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              {t('scan_type_label')} *
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750]"
            >
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {lang === 'ar' ? svc.ar : svc.en}
                </option>
              ))}
            </select>
          </div>

          {/* Body Area */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              {t('body_area_label')}
            </label>
            <input
              type="text"
              value={bodyArea}
              onChange={(e) => setBodyArea(e.target.value)}
              placeholder="مثال: الفقرات القطنية، الركبة اليمنى، الصدر..."
              className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750]"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              الفرع المطلوب *
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750]"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {lang === 'ar' ? b.nameAr : b.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* 7 Days Date Chips */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              {t('preferred_day_label')} *
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
              {daysList.map((day, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    selectedDayIndex === idx
                      ? 'bg-[#252750] text-white shadow-xs'
                      : 'bg-[#F5F6FA] text-[#5B607A] hover:bg-slate-200/70 border border-[#D9DBE6]'
                  }`}
                >
                  {lang === 'ar' ? day.labelAr : day.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Time Segmented */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              {t('preferred_time_label')} *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTimeSlot('morning')}
                className={`py-2 px-1 text-center rounded-xl text-[11px] font-semibold border transition-all ${
                  selectedTimeSlot === 'morning'
                    ? 'bg-[#E7E8F2] border-[#252750] text-[#252750] font-bold'
                    : 'bg-[#F5F6FA] border-[#D9DBE6] text-[#5B607A]'
                }`}
              >
                {lang === 'ar' ? 'صباحاً (٩-١)' : 'Morning (9-1)'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedTimeSlot('afternoon')}
                className={`py-2 px-1 text-center rounded-xl text-[11px] font-semibold border transition-all ${
                  selectedTimeSlot === 'afternoon'
                    ? 'bg-[#E7E8F2] border-[#252750] text-[#252750] font-bold'
                    : 'bg-[#F5F6FA] border-[#D9DBE6] text-[#5B607A]'
                }`}
              >
                {lang === 'ar' ? 'ظهراً (١-٥)' : 'Afternoon (1-5)'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedTimeSlot('evening')}
                className={`py-2 px-1 text-center rounded-xl text-[11px] font-semibold border transition-all ${
                  selectedTimeSlot === 'evening'
                    ? 'bg-[#E7E8F2] border-[#252750] text-[#252750] font-bold'
                    : 'bg-[#F5F6FA] border-[#D9DBE6] text-[#5B607A]'
                }`}
              >
                {lang === 'ar' ? 'مساءً (٥-١٠)' : 'Evening (5-10)'}
              </button>
            </div>
          </div>

          {/* Prescription Photo Attachment */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              {t('prescription_photo_label')}
            </label>
            <div
              onClick={() => setHasPhoto(!hasPhoto)}
              className="p-3 bg-[#F5F6FA] rounded-xl border border-dashed border-[#D9DBE6] flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-[#5B607A]">
                <Upload className="w-4 h-4 text-[#D0AE29]" />
                <span>{hasPhoto ? 'prescription_scan.jpg' : 'اضغط لإرفاق صورة الروشتة أو التحويل'}</span>
              </div>
              {hasPhoto && (
                <span className="text-[11px] text-[#1E7A55] font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>مرفق</span>
                </span>
              )}
            </div>
          </div>

          {/* Medical Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              {t('notes_label')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="هل يوجد حمل، حساسية صبغة، أو عمليات سابقة..."
              className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl p-2.5 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#252750] hover:bg-[#3B3F7A] text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-98"
            >
              {t('btn_send_booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
