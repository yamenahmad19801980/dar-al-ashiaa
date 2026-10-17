import React, { useState } from 'react';
import { X, AlertCircle, Upload, CheckCircle } from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';

interface IssueSheetProps {
  onClose: () => void;
  onSubmitted: (caseId: string) => void;
}

export const IssueSheet: React.FC<IssueSheetProps> = ({
  onClose,
  onSubmitted,
}) => {
  const { t, lang } = useT();
  const branches = demoStore.getState().branches;

  const categories = [
    { id: 'Report delay', ar: 'تأخير التقرير', en: 'Report delay' },
    { id: 'Appointment', ar: 'مشكلة بالموعد', en: 'Appointment' },
    { id: 'Billing', ar: 'الفواتير والتأمين', en: 'Billing' },
    { id: 'Staff or service', ar: 'ملاحظة على الخدمة', en: 'Staff or service' },
    { id: 'App problem', ar: 'مشكلة بالتطبيق', en: 'App problem' },
    { id: 'Other', ar: 'أخرى', en: 'Other' },
  ];

  const [category, setCategory] = useState(categories[0].id);
  const [branchId, setBranchId] = useState('br-smouha');
  const [description, setDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('يرجى توضيح المشكلة لمساعدتك بأسرع شكل ممكن');
      return;
    }

    const caseId = demoStore.createIssue({
      category,
      branchId,
      description,
    });

    onSubmitted(caseId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[90vh] flex flex-col text-[#252750] shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-[#D9DBE6] rounded-full mx-auto mt-3 mb-1" />

        <div className="px-5 py-3 border-b border-[#D9DBE6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#A15C00]" />
            <div>
              <h3 className="text-base font-bold text-[#252750]">
                {t('issue_form_title')}
              </h3>
              <p className="text-[11px] text-[#5B607A]">
                نلتزم بالرد والتحقيق في الشكوى خلال ساعة واحدة
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
          {/* Category Chips */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-2">
              {t('issue_category_label')} *
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                    category === cat.id
                      ? 'bg-[#252750] text-white border-[#252750] shadow-xs'
                      : 'bg-[#F5F6FA] text-[#5B607A] border-[#D9DBE6] hover:bg-slate-200/60'
                  }`}
                >
                  {lang === 'ar' ? cat.ar : cat.en}
                </button>
              ))}
            </div>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              الفرع المتعلق بالشكوى
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

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#252750] mb-1.5">
              {t('issue_desc_label')} *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError('');
              }}
              placeholder="اكتب ما حدث بدقة لنتمكن من المتابعة مع الإدارة الطبية..."
              className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl p-3 text-xs font-medium text-[#252750] focus:outline-none focus:border-[#252750]"
              required
            />
          </div>

          {/* Attach Photo */}
          <div>
            <div
              onClick={() => setHasPhoto(!hasPhoto)}
              className="p-3 bg-[#F5F6FA] rounded-xl border border-dashed border-[#D9DBE6] flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-[#5B607A]">
                <Upload className="w-4 h-4 text-[#A15C00]" />
                <span>{hasPhoto ? 'issue_receipt_doc.png' : t('issue_photo_label')}</span>
              </div>
              {hasPhoto && (
                <span className="text-[11px] text-[#1E7A55] font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>تم الإرفاق</span>
                </span>
              )}
            </div>
          </div>

          {error && <p className="text-xs text-[#B3261E]">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#A15C00] hover:bg-[#A15C00]/90 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-98"
            >
              {t('btn_send_issue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
