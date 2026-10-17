import React from 'react';
import { WifiOff } from 'lucide-react';
import { useT } from '../../i18n';

export const OfflineBanner: React.FC = () => {
  const { t } = useT();

  return (
    <div className="bg-[#B3261E] text-white px-3 py-1.5 text-xs flex items-center justify-center gap-2 shadow-sm animate-in slide-in-from-top duration-200 z-30">
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span className="font-medium text-[11px] leading-tight">
        {t('offline_banner_text')}
      </span>
    </div>
  );
};
