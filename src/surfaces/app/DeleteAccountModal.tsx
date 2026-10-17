import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';

interface DeleteAccountModalProps {
  onClose: () => void;
  onDeleted: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  onClose,
  onDeleted,
}) => {
  const { t, lang } = useT();
  const [confirmCode, setConfirmCode] = useState('');
  const [error, setError] = useState('');

  const currentUserId = demoStore.getState().currentUserId;

  const handleDelete = () => {
    if (confirmCode !== '1234' && confirmCode.length < 4) {
      setError('يرجى إدخال رمز التأكيد 1234');
      return;
    }

    demoStore.deleteAccount(currentUserId);
    onDeleted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center text-[#252750]">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-2 rounded-full hover:bg-[#F5F6FA] text-[#5B607A]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#B3261E]/10 text-[#B3261E] flex items-center justify-center mx-auto mb-3">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-[#252750] mb-2">
          {t('delete_account_modal_title')}
        </h3>

        <div className="text-start p-3 bg-[#F5F6FA] rounded-2xl space-y-2 text-xs text-[#5B607A] mb-4">
          <div className="flex items-start gap-1.5 text-[#B3261E] font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>ما يتم حذفه من التطبيق:</span>
          </div>
          <p className="leading-relaxed">
            - سيتم إلغاء حسابك فوراً ومسح سجل محادثاتك على الهاتف وإلغاء اشتراك الإشعارات.
          </p>

          <div className="flex items-start gap-1.5 text-[#252750] font-bold pt-1 border-t border-[#D9DBE6]">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#1F5FAD]" />
            <span>البيانات المحفوظة بموجب القانون:</span>
          </div>
          <p className="leading-relaxed">
            - التزاماً بالتشريعات الطبية المصرية، يحتفظ المركز بنسخ الفحوصات والتقارير المعتمدة في أرشيف السجلات الطبية.
          </p>
        </div>

        <div className="mb-4 text-start">
          <label className="block text-xs font-semibold text-[#252750] mb-1">
            أدخل رمز التأكيد (1234) لإتمام الحذف:
          </label>
          <input
            type="text"
            value={confirmCode}
            onChange={(e) => {
              setConfirmCode(e.target.value);
              if (error) setError('');
            }}
            placeholder="1234"
            className="w-full bg-[#F5F6FA] border border-[#D9DBE6] rounded-xl px-3 py-2 text-center font-mono font-bold tracking-widest text-sm focus:outline-none focus:border-[#B3261E]"
            dir="ltr"
          />
          {error && <p className="text-xs text-[#B3261E] mt-1 text-center">{error}</p>}
        </div>

        <div className="space-y-2">
          <button
            onClick={handleDelete}
            className="w-full py-3 bg-[#B3261E] hover:bg-[#B3261E]/90 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
          >
            {t('delete_account_confirm_btn')}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-transparent hover:bg-slate-100 text-[#5B607A] font-medium text-xs rounded-xl"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
