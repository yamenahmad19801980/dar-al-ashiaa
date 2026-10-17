import React from 'react';
import { Home, MessageSquare, FileCheck2, Clock, User, Share2 } from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore, DemoState } from '../../store/demoStore';

interface BottomTabBarProps {
  activeTab: DemoState['activeTab'];
  onSelectTab: (tab: DemoState['activeTab']) => void;
  userType: 'patient' | 'doctor' | 'guest';
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  userType,
}) => {
  const { t } = useT();

  interface TabItem {
    id: DemoState['activeTab'];
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: boolean;
  }

  const patientTabs: TabItem[] = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'chat', label: t('nav_chat'), icon: MessageSquare, badge: true },
    { id: 'results', label: t('nav_results'), icon: FileCheck2 },
    { id: 'requests', label: t('nav_requests'), icon: Clock },
    { id: 'account', label: t('nav_account'), icon: User },
  ];

  const doctorTabs: TabItem[] = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'chat', label: t('nav_chat'), icon: MessageSquare },
    { id: 'referrals', label: t('nav_referrals'), icon: Share2 },
    { id: 'results', label: t('nav_results'), icon: FileCheck2 },
    { id: 'account', label: t('nav_account'), icon: User },
  ];

  const tabs = userType === 'doctor' ? doctorTabs : patientTabs;

  return (
    <nav className="h-16 bg-white/95 backdrop-blur-md border-t border-[#D9DBE6] flex items-center justify-around px-2 z-30 select-none shadow-xs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 min-h-[48px] transition-colors ${
              isActive ? 'text-[#252750] font-bold' : 'text-[#5B607A] hover:text-[#252750]'
            }`}
          >
            {/* Signature Gold Active Indicator on top edge */}
            {isActive && (
              <div className="absolute top-0 w-8 h-1 bg-[#D0AE29] rounded-b-full shadow-xs" />
            )}

            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#252750]' : ''}`} />
              {tab.badge && (
                <span className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-[#D0AE29]" />
              )}
            </div>

            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
