import React from 'react';
import { X, Bell, FileText, Calendar, Tag, CheckCheck } from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';

interface NotificationsModalProps {
  onClose: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  onClose,
  onNavigateToTab,
}) => {
  const { lang, t } = useT();
  const notifications = demoStore.getState().notifications;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl max-h-[85vh] flex flex-col text-[#252750] shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-[#D9DBE6] rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-[#D9DBE6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#252750] text-[#D0AE29] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#252750]">
                {t('notifications_title')}
              </h3>
              <p className="text-[11px] text-[#5B607A]">
                رسائل وتحديثات سرية لا تكشف أي بيانات صحية حساسة
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

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-2.5 text-start">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#5B607A]">
              {t('notifications_empty')}
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.linkTab) {
                    onClose();
                    onNavigateToTab(n.linkTab);
                  }
                }}
                className="p-3.5 bg-[#F5F6FA] hover:bg-slate-100 rounded-2xl border border-[#D9DBE6] cursor-pointer transition-all active:scale-99"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    {n.type === 'report_ready' ? (
                      <FileText className="w-4 h-4 text-[#1E7A55]" />
                    ) : n.type === 'case_update' ? (
                      <Calendar className="w-4 h-4 text-[#1F5FAD]" />
                    ) : (
                      <Tag className="w-4 h-4 text-[#D0AE29]" />
                    )}
                    <span className="text-xs font-bold text-[#252750]">
                      {lang === 'ar' ? n.titleAr : n.titleEn}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#5B607A] font-medium" dir="ltr">
                    {lang === 'ar' ? n.timeAgoAr : n.timeAgoEn}
                  </span>
                </div>
                <p className="text-[11px] text-[#5B607A] leading-relaxed">
                  {lang === 'ar' ? n.bodyAr : n.bodyEn}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
