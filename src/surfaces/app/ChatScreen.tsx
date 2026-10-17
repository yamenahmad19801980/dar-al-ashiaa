import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  Paperclip,
  Clock,
  Sparkles,
  PhoneCall,
  Info,
  ChevronRight,
  Square,
  Image,
  FileText,
} from 'lucide-react';
import { useT } from '../../i18n';
import { demoStore } from '../../store/demoStore';
import { MessageBubble } from '../../components/shared/MessageBubble';
import { BookingSheet } from './BookingSheet';
import { IssueSheet } from './IssueSheet';
import { ReferralSheet } from './ReferralSheet';

interface ChatScreenProps {
  onOpenRequests: () => void;
  onOpenResults: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  onOpenRequests,
  onOpenResults,
}) => {
  const { lang, t, isRtl } = useT();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Forms sheets state
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [showIssueSheet, setShowIssueSheet] = useState(false);
  const [showReferralSheet, setShowReferralSheet] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const state = demoStore.getState();
  const currentUserId = state.currentUserId;
  const isDoctor = state.currentUserType === 'doctor';

  // Current patient's messages
  const userMessages = state.messages.filter((m) => m.patientId === currentUserId);

  // Pinned active case
  const activeCase = state.cases.find(
    (c) =>
      c.patientId === currentUserId &&
      c.stage !== 'closed' &&
      c.stage !== 'resolved'
  );

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userMessages.length, state.typingParticipant]);

  // Voice recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    demoStore.sendMessage({
      caseId: activeCase?.id,
      patientId: currentUserId,
      kind: 'text',
      from: isDoctor ? 'doctor' : 'patient',
      textAr: inputText,
      textEn: inputText,
    });

    setInputText('');
  };

  const handleSendVoice = () => {
    setIsRecording(false);
    demoStore.sendMessage({
      caseId: activeCase?.id,
      patientId: currentUserId,
      kind: 'voice',
      from: isDoctor ? 'doctor' : 'patient',
      voiceDuration: `0:${recordDuration < 10 ? `0${recordDuration}` : recordDuration}`,
      textAr: 'رسالة صوتية مسجلة',
      textEn: 'Voice note',
    });
  };

  const handleMenuClick = (actionId: string) => {
    if (actionId === 'book') {
      demoStore.sendMessage({
        caseId: activeCase?.id,
        patientId: currentUserId,
        kind: 'menu_reply',
        from: 'patient',
        textAr: 'حجز أشعة جديدة',
        textEn: 'Book a new scan',
      });
      setShowBookingSheet(true);
    } else if (actionId === 'results') {
      demoStore.sendMessage({
        caseId: activeCase?.id,
        patientId: currentUserId,
        kind: 'menu_reply',
        from: 'patient',
        textAr: 'نتائجي',
        textEn: 'My results',
      });
      onOpenResults();
    } else if (actionId === 'issue') {
      demoStore.sendMessage({
        caseId: activeCase?.id,
        patientId: currentUserId,
        kind: 'menu_reply',
        from: 'patient',
        textAr: 'الإبلاغ عن مشكلة',
        textEn: 'Report an issue',
      });
      setShowIssueSheet(true);
    } else if (actionId === 'prep') {
      demoStore.sendMessage({
        caseId: activeCase?.id,
        patientId: currentUserId,
        kind: 'menu_reply',
        from: 'patient',
        textAr: 'الأسعار والتحضير',
        textEn: 'Prices and preparation',
      });
      demoStore.sendMessage({
        caseId: activeCase?.id,
        patientId: currentUserId,
        kind: 'text',
        from: 'staff',
        staffId: 'st-nour',
        textAr: 'أهلاً بك! يمكنك الاطلاع على كافة خطوات التحضير في قسم الخدمات بالصفحة الرئيسية، أو إخبارنا باسم الفحص لنرسل لك التعليمات والأسعار مباشرة.',
        textEn: 'Hello! You can view detailed preparation steps in Services, or let us know the examination name to send pricing and steps.',
      });
    } else if (actionId === 'support') {
      demoStore.sendMessage({
        caseId: activeCase?.id,
        patientId: currentUserId,
        kind: 'menu_reply',
        from: 'patient',
        textAr: 'التحدث مع فريقنا',
        textEn: 'Talk to our team',
      });
      demoStore.sendMessage({
        caseId: activeCase?.id,
        patientId: currentUserId,
        kind: 'text',
        from: 'staff',
        staffId: 'st-mai',
        textAr: 'مرحباً، معك مي من فريق رعاية المراجعين بدار الأشعة. كيف يمكنني مساعدتك اليوم؟',
        textEn: "Hello, I'm Mai from Patient Care. How can I assist you today?",
      });
    } else if (actionId === 'new_referral') {
      setShowReferralSheet(true);
    } else if (actionId === 'referral_status') {
      onOpenRequests();
    } else if (actionId === 'doctor_relations') {
      demoStore.sendMessage({
        caseId: activeCase?.id,
        patientId: currentUserId,
        kind: 'menu_reply',
        from: 'doctor',
        textAr: 'التحدث مع علاقات الأطباء',
        textEn: 'Talk to doctor relations',
      });
      demoStore.sendMessage({
        caseId: activeCase?.id,
        patientId: currentUserId,
        kind: 'text',
        from: 'staff',
        staffId: 'st-laila',
        textAr: 'مرحباً دكتور، معكِ ليلى من إدارة علاقات الأطباء بدار الأشعة. يسعدنا تقديم أي استفسار أو بروتوكول تحويل تفصيلي.',
        textEn: "Welcome Doctor, I'm Laila from Doctor Relations. Glad to assist with any referrals or protocols.",
      });
    }
  };

  return (
    <div className="flex-1 bg-[#F5F6FA] flex flex-col overflow-hidden text-[#252750]">
      {/* Top App Bar */}
      <div className="bg-white px-4 py-2.5 border-b border-[#D9DBE6] shadow-xs z-10 flex flex-col gap-1.5 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-[#252750] text-[#D0AE29] font-black text-xs flex items-center justify-center">
                DA
              </div>
              <span className="absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-[#1E7A55] ring-2 ring-white" />
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#252750] leading-none mb-1">
                {t('chat_title')}
              </h3>
              <span className="text-[10px] text-[#5B607A] flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-[#1E7A55]" />
                <span>{t('chat_subtitle')}</span>
              </span>
            </div>
          </div>

          <a
            href="tel:+2030000101"
            className="p-2 rounded-xl bg-[#F5F6FA] hover:bg-[#E7E8F2] text-[#252750] transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
          </a>
        </div>

        {/* Pinned Case Pill (Two-Part: Navy ID + Outlined Stage) */}
        {activeCase && (
          <div
            onClick={onOpenRequests}
            className="flex items-center justify-between bg-[#E7E8F2]/60 hover:bg-[#E7E8F2] p-1.5 px-2.5 rounded-xl border border-[#D9DBE6] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-xs">
              {/* Navy ID segment */}
              <span className="bg-[#252750] text-white font-mono font-bold px-2 py-0.5 rounded-md text-[11px]" dir="ltr">
                {activeCase.id}
              </span>
              {/* Outlined Stage segment */}
              <span className="font-semibold text-[#252750] text-[11px]">
                {activeCase.stage === 'slot-offered'
                  ? 'تم اقتراح موعد'
                  : activeCase.stage === 'confirmed'
                  ? 'مؤكد'
                  : activeCase.stage === 'released'
                  ? 'تم الإرسال'
                  : 'قيد المتابعة'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#1F5FAD] flex items-center gap-0.5">
              <span>التفاصيل</span>
              <span>{isRtl ? '←' : '→'}</span>
            </span>
          </div>
        )}
      </div>

      {/* Medical Emergency Disclaimer per spec FR-096 */}
      <div className="bg-[#E7E8F2] px-3 py-1 text-[10px] text-[#5B607A] flex items-center justify-center gap-1.5 text-center border-b border-[#D9DBE6]">
        <Info className="w-3 h-3 text-[#1F5FAD] shrink-0" />
        <span>
          المحادثة لخدمات الحجز والنتائج والاستفسارات. في حالات الطوارئ يرجى الاتصال بالإسعاف ١٢٣.
        </span>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {userMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            currentUserId={currentUserId}
            onMenuClick={handleMenuClick}
          />
        ))}

        {/* Typing indicator */}
        {state.typingParticipant && (
          <div className="flex items-center gap-2 text-xs text-[#5B607A] bg-white border border-[#D9DBE6] px-3 py-1.5 rounded-full w-fit animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#D0AE29]" />
            <span>{state.typingParticipant} يكتب الآن...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Floating Chips above composer */}
      <div className="px-3 py-1.5 flex gap-2 overflow-x-auto no-scrollbar border-t border-[#D9DBE6]/60 bg-white/70 backdrop-blur-xs select-none">
        <button
          onClick={() => setShowBookingSheet(true)}
          className="text-[11px] font-semibold bg-[#252750] text-white hover:bg-[#3B3F7A] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shadow-xs"
        >
          + طلب حجز فحص
        </button>
        <button
          onClick={() => setShowIssueSheet(true)}
          className="text-[11px] font-semibold bg-[#F5F6FA] text-[#5B607A] hover:bg-slate-200 border border-[#D9DBE6] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
        >
          الإبلاغ عن مشكلة
        </button>
        {isDoctor && (
          <button
            onClick={() => setShowReferralSheet(true)}
            className="text-[11px] font-semibold bg-[#D0AE29] text-[#252750] px-2.5 py-1 rounded-full whitespace-nowrap font-bold"
          >
            + تحويل مريض
          </button>
        )}
      </div>

      {/* Bottom Composer */}
      <div className="bg-white p-3 border-t border-[#D9DBE6] relative">
        {/* Attachment menu popover */}
        {showAttachMenu && (
          <div className="absolute bottom-16 start-4 bg-white border border-[#D9DBE6] rounded-2xl p-2 shadow-xl flex gap-2 z-30 animate-in slide-in-from-bottom-2">
            <button
              onClick={() => {
                setShowAttachMenu(false);
                setShowBookingSheet(true);
              }}
              className="p-2.5 hover:bg-[#F5F6FA] rounded-xl flex flex-col items-center text-[10px] text-[#252750] font-semibold"
            >
              <FileText className="w-5 h-5 text-[#1F5FAD] mb-1" />
              <span>طلب حجز</span>
            </button>
            <button
              onClick={() => {
                setShowAttachMenu(false);
                alert('تمت محاكاة إرفاق صورة الروشتة الطبية');
              }}
              className="p-2.5 hover:bg-[#F5F6FA] rounded-xl flex flex-col items-center text-[10px] text-[#252750] font-semibold"
            >
              <Image className="w-5 h-5 text-[#D0AE29] mb-1" />
              <span>إرفاق صورة</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSendText} className="flex items-center gap-2">
          {/* Attach button */}
          <button
            type="button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            aria-label="Attach"
            className="p-2 text-[#5B607A] hover:text-[#252750] hover:bg-[#F5F6FA] rounded-xl transition-colors shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Voice recording state or text input */}
          {isRecording ? (
            <div className="flex-1 flex items-center justify-between bg-[#B3261E]/10 border border-[#B3261E]/30 px-3.5 py-2 rounded-2xl text-xs">
              <div className="flex items-center gap-2 text-[#B3261E] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#B3261E] animate-ping" />
                <span>تسجيل صوتي: 00:{recordDuration < 10 ? `0${recordDuration}` : recordDuration}</span>
              </div>
              <button
                type="button"
                onClick={handleSendVoice}
                className="py-1 px-2.5 bg-[#B3261E] text-white rounded-lg font-bold text-xs"
              >
                إرسال الصوت
              </button>
            </div>
          ) : (
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('chat_composer_placeholder')}
              className="flex-1 bg-[#F5F6FA] border border-[#D9DBE6] rounded-2xl px-4 py-2.5 text-xs text-[#252750] placeholder:text-[#5B607A] focus:outline-none focus:border-[#252750] focus:ring-1 focus:ring-[#252750]"
            />
          )}

          {/* Mic or Send */}
          {inputText.trim() ? (
            <button
              type="submit"
              aria-label="Send"
              className="p-2.5 bg-[#252750] hover:bg-[#3B3F7A] text-white rounded-2xl transition-all shadow-xs active:scale-95 shrink-0"
            >
              <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (isRecording) {
                  handleSendVoice();
                } else {
                  setIsRecording(true);
                }
              }}
              aria-label="Record voice note"
              className={`p-2.5 rounded-2xl transition-all shadow-xs shrink-0 ${
                isRecording ? 'bg-[#B3261E] text-white' : 'bg-[#E7E8F2] text-[#252750] hover:bg-[#D9DBE6]'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Bottom Sheets */}
      {showBookingSheet && (
        <BookingSheet
          onClose={() => setShowBookingSheet(false)}
          onSubmitted={() => setShowBookingSheet(false)}
        />
      )}

      {showIssueSheet && (
        <IssueSheet
          onClose={() => setShowIssueSheet(false)}
          onSubmitted={() => setShowIssueSheet(false)}
        />
      )}

      {showReferralSheet && (
        <ReferralSheet
          onClose={() => setShowReferralSheet(false)}
          onSubmitted={() => setShowReferralSheet(false)}
        />
      )}
    </div>
  );
};
