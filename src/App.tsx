import React, { useState, useEffect } from 'react';
import { I18nProvider, useT } from './i18n';
import { demoStore } from './store/demoStore';
import { PhoneFrame } from './components/shared/PhoneFrame';
import { OfflineBanner } from './surfaces/app/OfflineBanner';
import { BottomTabBar } from './surfaces/app/BottomTabBar';
import { SplashView } from './surfaces/app/SplashView';
import { LanguageView } from './surfaces/app/LanguageView';
import { OnboardingView } from './surfaces/app/OnboardingView';
import { AccountTypeView } from './surfaces/app/AccountTypeView';
import { PhoneInputView } from './surfaces/app/PhoneInputView';
import { OtpVerificationView } from './surfaces/app/OtpVerificationView';
import { PatientDetailsView } from './surfaces/app/PatientDetailsView';
import { DoctorDetailsView } from './surfaces/app/DoctorDetailsView';
import { PrivacyConsentView } from './surfaces/app/PrivacyConsentView';
import { HomeScreen } from './surfaces/app/HomeScreen';
import { ChatScreen } from './surfaces/app/ChatScreen';
import { ResultsScreen } from './surfaces/app/ResultsScreen';
import { RequestsScreen } from './surfaces/app/RequestsScreen';
import { AccountScreen } from './surfaces/app/AccountScreen';
import { BookingSheet } from './surfaces/app/BookingSheet';
import { ReferralSheet } from './surfaces/app/ReferralSheet';
import { BranchesModal } from './surfaces/app/BranchesModal';
import { FaqModal } from './surfaces/app/FaqModal';
import { PresenterToolbar } from './surfaces/demo/PresenterToolbar';
import { StaffConsoleDrawer } from './surfaces/console/StaffConsoleDrawer';
import { UserType } from './data/types';

type EntryStep =
  | 'splash'
  | 'language'
  | 'onboarding'
  | 'account_type'
  | 'phone'
  | 'otp'
  | 'details'
  | 'consent'
  | 'main_app';

const MainAppContent: React.FC = () => {
  const { lang } = useT();
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [entryStep, setEntryStep] = useState<EntryStep>('main_app');
  const [pendingPhone, setPendingPhone] = useState('+20 10 1234 5678');
  const [pendingUserType, setPendingUserType] = useState<UserType>('patient');
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'results' | 'requests' | 'account' | 'referrals'>('home');

  // Modals from home or account
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  const [showReferralSheet, setShowReferralSheet] = useState(false);
  const [showBranchesModal, setShowBranchesModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showStaffConsole, setShowStaffConsole] = useState(false);

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState(demoStore.getState());
      setActiveTab(demoStore.getState().activeTab);
    });
    return unsub;
  }, []);

  const handleTabChange = (tab: any) => {
    demoStore.setActiveTab(tab);
    setActiveTab(tab);
  };

  const handleStartOnboarding = () => {
    setEntryStep('language');
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F5F6FA] text-[#252750]">
      {/* Top Floating Presenter Simulation Bar */}
      <PresenterToolbar
        onOpenStaffConsole={() => setShowStaffConsole(true)}
      />

      {/* Main Mobile App in Phone Frame */}
      <div className="flex-1 flex flex-col pt-12 sm:pt-14">
        <PhoneFrame>
          {/* Offline Banner if simulated offline */}
          {storeState.phoneOffline && <OfflineBanner />}

          {/* Entry Screens Flow */}
          {entryStep === 'splash' && (
            <SplashView onComplete={() => setEntryStep('language')} />
          )}

          {entryStep === 'language' && (
            <LanguageView onContinue={() => setEntryStep('onboarding')} />
          )}

          {entryStep === 'onboarding' && (
            <OnboardingView onFinish={() => setEntryStep('account_type')} />
          )}

          {entryStep === 'account_type' && (
            <AccountTypeView
              onSelectType={(type) => {
                setPendingUserType(type);
                setEntryStep('phone');
              }}
              onBrowseGuest={() => {
                demoStore.switchUser('pt-guest', 'guest');
                setEntryStep('main_app');
              }}
            />
          )}

          {entryStep === 'phone' && (
            <PhoneInputView
              onBack={() => setEntryStep('account_type')}
              onCodeSent={(phone) => {
                setPendingPhone(phone);
                setEntryStep('otp');
              }}
            />
          )}

          {entryStep === 'otp' && (
            <OtpVerificationView
              phone={pendingPhone}
              onChangePhone={() => setEntryStep('phone')}
              onVerified={() => setEntryStep('details')}
            />
          )}

          {entryStep === 'details' && (
            pendingUserType === 'doctor' ? (
              <DoctorDetailsView
                phone={pendingPhone}
                onSaved={(docData) => {
                  demoStore.registerDoctor({
                    name: docData.name,
                    nameAr: docData.name,
                    specialtyEn: docData.specialty,
                    specialtyAr: docData.specialty,
                    clinicEn: docData.clinic,
                    clinicAr: docData.clinic,
                    syndicateNo: docData.syndicateNo,
                    phone: pendingPhone,
                  });
                  setEntryStep('consent');
                }}
              />
            ) : (
              <PatientDetailsView
                phone={pendingPhone}
                onSaved={(patientData) => {
                  demoStore.registerPatient({
                    nameEn: patientData.name,
                    nameAr: patientData.name,
                    gender: patientData.gender,
                    age: Math.max(18, 2026 - new Date(patientData.dob).getFullYear()),
                    dob: patientData.dob,
                    phone: pendingPhone,
                    preferredBranch: patientData.preferredBranch,
                    channel: 'app',
                    language: lang,
                    consents: { health: true, hosting: true, offers: false },
                  });
                  setEntryStep('consent');
                }}
              />
            )
          )}

          {entryStep === 'consent' && (
            <PrivacyConsentView
              onAgree={(consents) => {
                const currentId = demoStore.getState().currentUserId;
                demoStore.updateConsents(currentId, consents);
                setEntryStep('main_app');
              }}
            />
          )}

          {/* Main App Surfaces */}
          {entryStep === 'main_app' && (
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {activeTab === 'home' && (
                <HomeScreen
                  onOpenBooking={(svcId) => {
                    setBookingServiceId(svcId);
                    setShowBookingSheet(true);
                  }}
                  onOpenChat={() => handleTabChange('chat')}
                  onOpenResults={() => handleTabChange('results')}
                  onOpenRequests={() => handleTabChange('requests')}
                  onOpenReferral={() => setShowReferralSheet(true)}
                />
              )}

              {activeTab === 'chat' && (
                <ChatScreen
                  onOpenRequests={() => handleTabChange('requests')}
                  onOpenResults={() => handleTabChange('results')}
                />
              )}

              {activeTab === 'results' && (
                <ResultsScreen
                  onOpenChat={() => handleTabChange('chat')}
                />
              )}

              {(activeTab === 'requests' || activeTab === 'referrals') && (
                <RequestsScreen
                  onOpenChat={() => handleTabChange('chat')}
                />
              )}

              {activeTab === 'account' && (
                <AccountScreen
                  onSignOut={() => setEntryStep('account_type')}
                  onOpenBranches={() => setShowBranchesModal(true)}
                  onOpenFaq={() => setShowFaqModal(true)}
                />
              )}

              {/* Bottom Tab Bar */}
              <BottomTabBar
                activeTab={activeTab}
                onSelectTab={handleTabChange}
                userType={storeState.currentUserType}
              />
            </div>
          )}
        </PhoneFrame>
      </div>

      {/* Global Bottom Sheets & Modals */}
      {showBookingSheet && (
        <BookingSheet
          initialServiceId={bookingServiceId}
          onClose={() => {
            setShowBookingSheet(false);
            setBookingServiceId(undefined);
          }}
          onSubmitted={() => {
            setShowBookingSheet(false);
            setBookingServiceId(undefined);
            handleTabChange('chat');
          }}
        />
      )}

      {showReferralSheet && (
        <ReferralSheet
          onClose={() => setShowReferralSheet(false)}
          onSubmitted={() => {
            setShowReferralSheet(false);
            handleTabChange('requests');
          }}
        />
      )}

      {showBranchesModal && (
        <BranchesModal
          onClose={() => setShowBranchesModal(false)}
          onBookAtBranch={() => {
            setShowBranchesModal(false);
            setShowBookingSheet(true);
          }}
        />
      )}

      {showFaqModal && (
        <FaqModal
          onClose={() => setShowFaqModal(false)}
          onOpenChat={() => {
            setShowFaqModal(false);
            handleTabChange('chat');
          }}
        />
      )}

      {/* Staff Admin Console Peek Drawer */}
      {showStaffConsole && (
        <StaffConsoleDrawer onClose={() => setShowStaffConsole(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <MainAppContent />
    </I18nProvider>
  );
}
