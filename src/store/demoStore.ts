import {
  Branch,
  Service,
  Staff,
  Patient,
  Doctor,
  CaseType,
  Case,
  Message,
  PortalReport,
  Promotion,
  FAQItem,
  NotificationItem,
  CannedResponse,
  AuditEntry,
  UserType,
} from '../data/types';
import {
  SEED_BRANCHES,
  SEED_SERVICES,
  SEED_STAFF,
  SEED_PATIENTS,
  SEED_DOCTORS,
  SEED_CASE_TYPES,
  SEED_CASES,
  SEED_MESSAGES,
  SEED_PORTAL_REPORTS,
  SEED_PROMOTIONS,
  SEED_FAQ,
  SEED_NOTIFICATIONS,
  SEED_CANNED,
  SEED_AUDIT,
} from '../data/seed';

export interface DemoState {
  language: 'ar' | 'en';
  currentUserId: string;
  currentUserType: UserType;
  phoneOffline: boolean;
  demoClockOffsetMinutes: number;
  frameMode: 'framed' | 'fullscreen';
  activeTab: 'home' | 'chat' | 'results' | 'requests' | 'account' | 'referrals';
  staffConsolePeekOpen: boolean;

  // Data
  branches: Branch[];
  services: Service[];
  staff: Staff[];
  patients: Patient[];
  doctors: Doctor[];
  caseTypes: CaseType[];
  cases: Case[];
  messages: Message[];
  portalReports: PortalReport[];
  promotions: Promotion[];
  faq: FAQItem[];
  notifications: NotificationItem[];
  cannedResponses: CannedResponse[];
  auditLog: AuditEntry[];
  typingParticipant: string | null;
}

const STORAGE_KEY = 'dea-demo-v1';
const BROADCAST_CHANNEL_NAME = 'dea-demo';

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not available', e);
  }
}

export function getInitialState(): DemoState {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          // Always ensure valid default structures
          branches: parsed.branches || SEED_BRANCHES,
          services: parsed.services || SEED_SERVICES,
          staff: parsed.staff || SEED_STAFF,
          patients: parsed.patients || SEED_PATIENTS,
          doctors: parsed.doctors || SEED_DOCTORS,
          caseTypes: parsed.caseTypes || SEED_CASE_TYPES,
          cases: parsed.cases || SEED_CASES,
          messages: parsed.messages || SEED_MESSAGES,
          portalReports: parsed.portalReports || SEED_PORTAL_REPORTS,
          promotions: parsed.promotions || SEED_PROMOTIONS,
          faq: parsed.faq || SEED_FAQ,
          notifications: parsed.notifications || SEED_NOTIFICATIONS,
          cannedResponses: parsed.cannedResponses || SEED_CANNED,
          auditLog: parsed.auditLog || SEED_AUDIT,
        };
      }
    } catch (e) {
      console.error('Failed to parse stored demo state', e);
    }
  }

  return {
    language: 'ar', // Arabic default as requested
    currentUserId: 'pt-mona',
    currentUserType: 'patient',
    phoneOffline: false,
    demoClockOffsetMinutes: 0,
    frameMode: 'framed',
    activeTab: 'home',
    staffConsolePeekOpen: false,

    branches: SEED_BRANCHES,
    services: SEED_SERVICES,
    staff: SEED_STAFF,
    patients: SEED_PATIENTS,
    doctors: SEED_DOCTORS,
    caseTypes: SEED_CASE_TYPES,
    cases: SEED_CASES,
    messages: SEED_MESSAGES,
    portalReports: SEED_PORTAL_REPORTS,
    promotions: SEED_PROMOTIONS,
    faq: SEED_FAQ,
    notifications: SEED_NOTIFICATIONS,
    cannedResponses: SEED_CANNED,
    auditLog: SEED_AUDIT,
    typingParticipant: null,
  };
}

class DemoStore {
  private state: DemoState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = getInitialState();

    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        if (event.data && typeof event.data === 'object') {
          this.state = { ...this.state, ...event.data };
          this.notifyListeners(false);
        }
      };
    }
  }

  public getState(): DemoState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(broadcast = true) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('LocalStorage save failed', e);
      }
    }

    if (broadcast && broadcastChannel) {
      try {
        broadcastChannel.postMessage(this.state);
      } catch (e) {
        console.warn('Broadcast failed', e);
      }
    }

    this.listeners.forEach((listener) => listener());
  }

  public setLanguage(lang: 'ar' | 'en') {
    this.state = { ...this.state, language: lang };
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
    this.notifyListeners();
  }

  public setFrameMode(mode: 'framed' | 'fullscreen') {
    this.state = { ...this.state, frameMode: mode };
    this.notifyListeners();
  }

  public setActiveTab(tab: DemoState['activeTab']) {
    this.state = { ...this.state, activeTab: tab };
    this.notifyListeners();
  }

  public setStaffConsolePeek(open: boolean) {
    this.state = { ...this.state, staffConsolePeekOpen: open };
    this.notifyListeners();
  }

  public setOffline(offline: boolean) {
    this.state = { ...this.state, phoneOffline: offline };
    this.notifyListeners();
  }

  public advanceClock(minutes: number) {
    this.state = {
      ...this.state,
      demoClockOffsetMinutes: this.state.demoClockOffsetMinutes + minutes,
    };
    this.notifyListeners();
  }

  public resetClock() {
    this.state = { ...this.state, demoClockOffsetMinutes: 0 };
    this.notifyListeners();
  }

  public switchUser(userId: string, userType: UserType) {
    this.state = {
      ...this.state,
      currentUserId: userId,
      currentUserType: userType,
      activeTab: 'home',
    };
    this.notifyListeners();
  }

  public updateConsents(patientId: string, consents: { health: boolean; hosting: boolean; offers: boolean }) {
    const patients = this.state.patients.map((p) => {
      if (p.id === patientId) {
        return {
          ...p,
          consents,
          consentTimestamp: new Date().toISOString(),
        };
      }
      return p;
    });
    this.state = { ...this.state, patients };
    this.notifyListeners();
  }

  public registerPatient(patient: Omit<Patient, 'id'>): string {
    const id = `pt-new-${Date.now().toString().slice(-4)}`;
    const newPatient: Patient = { ...patient, id };
    this.state = {
      ...this.state,
      patients: [newPatient, ...this.state.patients],
      currentUserId: id,
      currentUserType: 'patient',
    };
    this.notifyListeners();
    return id;
  }

  public registerDoctor(doctor: Omit<Doctor, 'id' | 'status'>): string {
    const id = `dr-new-${Date.now().toString().slice(-4)}`;
    const newDoctor: Doctor = { ...doctor, id, status: 'pending' };
    this.state = {
      ...this.state,
      doctors: [newDoctor, ...this.state.doctors],
      currentUserId: id,
      currentUserType: 'doctor',
    };
    this.addAudit('Doctor Registration Submitted', 'تقديم طلب تسجيل طبيب محول', `Doctor ${doctor.name}`);
    this.notifyListeners();
    return id;
  }

  public verifyDoctor(doctorId: string, status: 'verified' | 'rejected', reason?: string) {
    const doctors = this.state.doctors.map((d) => {
      if (d.id === doctorId) {
        return {
          ...d,
          status,
          rejectionReason: reason,
        };
      }
      return d;
    });

    const doc = this.state.doctors.find((d) => d.id === doctorId);
    this.state = { ...this.state, doctors };

    this.addAudit(
      status === 'verified' ? 'Doctor Verified' : 'Doctor Rejected',
      status === 'verified' ? 'اعتماد طبيب محول' : 'رفض طلب طبيب محول',
      `Doctor ${doc?.name || doctorId}`
    );

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: doctorId,
      type: 'case_update',
      titleEn: status === 'verified' ? 'Doctor Account Verified' : 'Registration Update',
      titleAr: status === 'verified' ? 'تم اعتماد حسابك الطبي بنجاح' : 'تحديث بخصوص طلب التسجيل',
      bodyEn: status === 'verified' ? 'You can now create and track patient referrals.' : `Status updated: ${reason || ''}`,
      bodyAr: status === 'verified' ? 'أصبح بإمكانك الآن إرسال ومتابعة تحويلات المرضى ونتائجهم.' : `تم تحديث الطلب: ${reason || ''}`,
      timeAgoEn: 'Just now',
      timeAgoAr: 'الآن',
      dateCategory: 'today',
      isRead: false,
      linkTab: 'home',
    };
    this.state.notifications = [newNotif, ...this.state.notifications];

    this.notifyListeners();
  }

  public addAudit(action: string, actionAr: string, object: string) {
    const entry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      staffName: 'Presenter / Demo Action',
      action,
      actionAr,
      object,
      ip: '192.168.1.10',
    };
    this.state.auditLog = [entry, ...this.state.auditLog];
  }

  public sendMessage(msg: Omit<Message, 'id' | 'timestamp' | 'status'>): string {
    const id = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const initialStatus = this.state.phoneOffline && msg.from === 'patient' ? 'sending' : 'sent';

    const newMsg: Message = {
      ...msg,
      id,
      timestamp,
      status: initialStatus,
    };

    this.state = {
      ...this.state,
      messages: [...this.state.messages, newMsg],
    };
    this.notifyListeners();

    // Auto simulate delivery and reply if online and user sent
    if (!this.state.phoneOffline && (msg.from === 'patient' || msg.from === 'doctor')) {
      setTimeout(() => {
        this.updateMessageStatus(id, 'delivered');
        setTimeout(() => {
          this.updateMessageStatus(id, 'read');
        }, 800);
      }, 600);
    }

    return id;
  }

  public updateMessageStatus(id: string, status: Message['status']) {
    this.state = {
      ...this.state,
      messages: this.state.messages.map((m) => (m.id === id ? { ...m, status } : m)),
    };
    this.notifyListeners();
  }

  public createBooking(formData: {
    serviceId: string;
    bodyArea: string;
    branchId: string;
    day: string;
    time: string;
    notes?: string;
  }): string {
    const caseId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const patient = this.state.patients.find((p) => p.id === this.state.currentUserId) || this.state.patients[0];
    const service = this.state.services.find((s) => s.id === formData.serviceId);
    const branch = this.state.branches.find((b) => b.id === formData.branchId);

    const newCase: Case = {
      id: caseId,
      type: 'BK',
      patientId: patient.id,
      stage: 'new',
      ownerId: null,
      teamId: 'team-bookings',
      channel: 'app',
      priority: 'Normal',
      createdMinAgo: 0,
      createdAt: new Date().toISOString(),
      summary: `${service?.short || 'Scan'}, ${branch?.nameEn || 'Branch'}, ${formData.day}`,
      summaryAr: `${service?.ar || 'فحص أشعة'}، ${branch?.nameAr || 'الفرع'}، ${formData.day}`,
    };

    this.state.cases = [newCase, ...this.state.cases];

    // Post booking card message
    const timestamp = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const msg: Message = {
      id: `msg-${Date.now()}`,
      caseId,
      patientId: patient.id,
      kind: 'form_card',
      from: 'patient',
      form: 'booking',
      formData: {
        service: formData.serviceId,
        serviceNameAr: service?.ar,
        serviceNameEn: service?.en,
        area: formData.bodyArea,
        branch: formData.branchId,
        branchNameAr: branch?.nameAr,
        branchNameEn: branch?.nameEn,
        day: formData.day,
        time: formData.time,
        notes: formData.notes,
      },
      textAr: `طلب حجز جديد: ${service?.ar}`,
      textEn: `New booking request: ${service?.en}`,
      timestamp,
      status: 'sent',
    };
    this.state.messages = [...this.state.messages, msg];

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: patient.id,
      type: 'case_update',
      titleEn: `Booking Request ${caseId} Received`,
      titleAr: `تم استلام طلب الحجز ${caseId}`,
      bodyEn: `We received your request for ${service?.en}. Our team will offer a suitable slot shortly.`,
      bodyAr: `تم استلام طلب فحص ${service?.ar}. سيقوم فريق الحجوزات باقتراح الموعد الأنسب قريباً.`,
      timeAgoEn: 'Just now',
      timeAgoAr: 'الآن',
      dateCategory: 'today',
      isRead: false,
      linkTab: 'chat',
      caseId,
    };
    this.state.notifications = [notif, ...this.state.notifications];

    this.addAudit('Booking Request Created', 'إنشاء طلب حجز أشعة جديد', `Case ${caseId} (${patient.nameAr})`);
    this.notifyListeners();

    // Auto-reply after 2.5s from agent
    setTimeout(() => {
      this.state.typingParticipant = 'Nour Hamdy';
      this.notifyListeners();
      setTimeout(() => {
        this.state.typingParticipant = null;
        this.sendMessage({
          caseId,
          patientId: patient.id,
          kind: 'text',
          from: 'staff',
          staffId: 'st-nour',
          textAr: `مرحباً ${patient.nameAr.split(' ')[0]}، استلمنا طلب الحجز الخاص بكِ (${caseId}). جاري فحص جدول المواعيد بفرع ${branch?.nameAr} وسنرسل لكِ الموعد المناسب خلال لحظات.`,
          textEn: `Hello ${patient.nameEn.split(' ')[0]}, we received your scan booking ${caseId}. Checking available times at ${branch?.nameEn} branch now.`,
        });
      }, 2000);
    }, 1500);

    return caseId;
  }

  public createIssue(formData: {
    category: string;
    branchId: string;
    description: string;
  }): string {
    const caseId = `IS-${Math.floor(100 + Math.random() * 900)}`;
    const patient = this.state.patients.find((p) => p.id === this.state.currentUserId) || this.state.patients[0];
    const branch = this.state.branches.find((b) => b.id === formData.branchId);

    const newCase: Case = {
      id: caseId,
      type: 'IS',
      patientId: patient.id,
      stage: 'acknowledged',
      ownerId: 'st-dina',
      teamId: 'team-care',
      channel: 'app',
      priority: 'High',
      createdMinAgo: 0,
      createdAt: new Date().toISOString(),
      firstResponseAt: new Date().toISOString(),
      category: formData.category,
      summary: `${formData.category}, ${branch?.nameEn || 'Branch'}`,
      summaryAr: `${formData.category}، ${branch?.nameAr || 'الفرع'}`,
    };
    this.state.cases = [newCase, ...this.state.cases];

    const timestamp = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const msg: Message = {
      id: `msg-${Date.now()}`,
      caseId,
      patientId: patient.id,
      kind: 'form_card',
      from: 'patient',
      form: 'issue',
      formData: {
        category: formData.category,
        branch: formData.branchId,
        branchNameAr: branch?.nameAr,
        description: formData.description,
      },
      textAr: `بلاغ عن مشكلة: ${formData.category}`,
      textEn: `Issue reported: ${formData.category}`,
      timestamp,
      status: 'sent',
    };
    this.state.messages = [...this.state.messages, msg];

    this.addAudit('Issue Reported', 'تسجيل شكوى / مشكلة', `Case ${caseId} (${formData.category})`);
    this.notifyListeners();

    return caseId;
  }

  public createReferral(formData: {
    patientName: string;
    phone: string;
    dob: string;
    gender: 'F' | 'M';
    serviceId: string;
    bodyArea: string;
    clinicalIndication: string;
    urgency: 'Routine' | 'Urgent';
    branchId: string;
    consentRecorded: boolean;
    consentMethod: 'Signed form' | 'Verbal';
  }): string {
    const caseId = `RF-${Math.floor(100 + Math.random() * 900)}`;
    const doctor = this.state.doctors.find((d) => d.id === this.state.currentUserId) || this.state.doctors[0];
    const service = this.state.services.find((s) => s.id === formData.serviceId);

    // Create or locate patient
    let patient = this.state.patients.find((p) => p.phone === formData.phone);
    if (!patient) {
      patient = {
        id: `pt-${Date.now().toString().slice(-4)}`,
        nameEn: formData.patientName,
        nameAr: formData.patientName,
        gender: formData.gender,
        age: 35,
        dob: formData.dob || '1990-01-01',
        phone: formData.phone,
        preferredBranch: 'Smouha',
        channel: 'app',
        language: 'ar',
        consents: { health: true, hosting: true, offers: false },
      };
      this.state.patients.push(patient);
    }

    const newCase: Case = {
      id: caseId,
      type: 'RF',
      doctorId: doctor.id,
      patientId: patient.id,
      stage: 'submitted',
      ownerId: 'st-laila',
      teamId: 'team-doctors',
      channel: 'app',
      priority: formData.urgency === 'Urgent' ? 'Urgent' : 'Normal',
      createdMinAgo: 0,
      createdAt: new Date().toISOString(),
      summary: `${service?.short || 'Scan'}, ${formData.patientName}`,
      summaryAr: `${service?.ar || 'فحص'} للمريض: ${formData.patientName}`,
      referralConsent: formData.consentRecorded ? 'recorded' : 'missing',
      referralConsentMethod: formData.consentMethod,
    };

    this.state.cases = [newCase, ...this.state.cases];
    this.addAudit('Doctor Referral Created', 'إرسال تحويل طبي جديد', `Referral ${caseId} from ${doctor.name}`);
    this.notifyListeners();

    return caseId;
  }

  public offerSlot(caseId: string, day: string, time: string, branchId: string) {
    const targetCase = this.state.cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    targetCase.stage = 'slot-offered';
    targetCase.slotDetails = {
      day,
      dayAr: day,
      time,
      branchId,
    };

    const branch = this.state.branches.find((b) => b.id === branchId);
    this.sendMessage({
      caseId,
      patientId: targetCase.patientId,
      kind: 'slot_offer',
      from: 'staff',
      staffId: 'st-nour',
      slotDayAr: day,
      slotDayEn: day,
      slotTime: time,
      slotBranchId: branchId,
      slotStatus: 'pending',
      textAr: `يمكننا استقبالك يوم ${day} الساعة ${time} في فرع ${branch?.nameAr}.`,
      textEn: `We can see you on ${day} at ${time} at our ${branch?.nameEn} branch.`,
    });

    this.addAudit('Slot Offered', 'اقتراح موعد فحص للمريض', `Case ${caseId} (${day} ${time})`);
    this.notifyListeners();
  }

  public confirmSlot(caseId: string) {
    const targetCase = this.state.cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    targetCase.stage = 'confirmed';

    // Update message slot status
    this.state.messages = this.state.messages.map((m) => {
      if (m.caseId === caseId && m.kind === 'slot_offer') {
        return { ...m, slotStatus: 'confirmed' };
      }
      return m;
    });

    const branch = this.state.branches.find((b) => b.id === targetCase.slotDetails?.branchId);

    // Send confirmation system event
    this.sendMessage({
      caseId,
      patientId: targetCase.patientId,
      kind: 'system_event',
      from: 'system',
      textAr: `تم تأكيد موعد الحجز بنجاح: ${targetCase.slotDetails?.dayAr} الساعة ${targetCase.slotDetails?.time} بفرع ${branch?.nameAr || 'سموحة'}. تم جدولة التذكير قبل الفحص بـ ٢٤ ساعة.`,
      textEn: `Appointment confirmed: ${targetCase.slotDetails?.day} at ${targetCase.slotDetails?.time} (${branch?.nameEn}). 24h reminder scheduled.`,
    });

    // Notify patient
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetCase.patientId,
      type: 'case_update',
      titleEn: 'Appointment Confirmed',
      titleAr: 'تم تأكيد موعد فحصك بنجاح',
      bodyEn: `Your appointment is confirmed for ${targetCase.slotDetails?.day} at ${branch?.nameEn}.`,
      bodyAr: `تم تأكيد موعدك بنجاح يوم ${targetCase.slotDetails?.dayAr} بفرع ${branch?.nameAr}.`,
      timeAgoEn: 'Just now',
      timeAgoAr: 'الآن',
      dateCategory: 'today',
      isRead: false,
      linkTab: 'requests',
      caseId,
    };
    this.state.notifications = [notif, ...this.state.notifications];

    this.addAudit('Slot Confirmed by Patient', 'تأكيد الموعد من المريض', `Case ${caseId}`);
    this.notifyListeners();
  }

  public declineSlot(caseId: string) {
    const targetCase = this.state.cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    this.state.messages = this.state.messages.map((m) => {
      if (m.caseId === caseId && m.kind === 'slot_offer') {
        return { ...m, slotStatus: 'declined' };
      }
      return m;
    });

    this.sendMessage({
      caseId,
      patientId: targetCase.patientId,
      kind: 'text',
      from: 'patient',
      textAr: 'هل يمكن اقتراح موعد بديل في وقت مختلف أو فرع آخر؟',
      textEn: 'Could you please suggest an alternative time or branch?',
    });

    this.notifyListeners();
  }

  public releaseReport(reportId: string, releasedBy = 'Nour Hamdy (Results Team)') {
    const report = this.state.portalReports.find((r) => r.id === reportId);
    if (!report) return;

    report.status = 'released';
    report.releasedAt = new Date().toISOString();
    report.releasedBy = releasedBy;
    report.qrPayload = `https://portal.darelashaa.com/v/${report.visitNo}?token=sec_${Date.now().toString().slice(-6)}`;

    // Update or create RS case
    let rsCase = this.state.cases.find((c) => c.patientId === report.patientId && c.type === 'RS');
    if (rsCase) {
      rsCase.stage = 'released';
      rsCase.reportId = report.id;
    } else {
      rsCase = {
        id: `RS-${Math.floor(2000 + Math.random() * 8000)}`,
        type: 'RS',
        patientId: report.patientId,
        stage: 'released',
        ownerId: 'st-omar',
        teamId: 'team-results',
        channel: 'app',
        priority: 'Normal',
        createdMinAgo: 0,
        createdAt: new Date().toISOString(),
        summary: `${report.examEn}, released`,
        summaryAr: `${report.examAr} - تم التسليم`,
        reportId: report.id,
      };
      this.state.cases.push(rsCase);
    }

    // Post results_card message with signature brackets!
    this.sendMessage({
      caseId: rsCase.id,
      patientId: report.patientId,
      kind: 'results_card',
      from: 'system',
      reportId: report.id,
      textAr: `تقريرك جاهز: ${report.examAr}. الرابط صالح حتى ${report.expiryDate}.`,
      textEn: `Your report is ready: ${report.examEn}. Link valid until ${report.expiryDate}.`,
    });

    // Send generic notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: report.patientId,
      type: 'report_ready',
      titleEn: 'New Medical Report Available',
      titleAr: 'تقرير طبي جديد متاح الآن',
      bodyEn: 'You have a new update from Dar El Ashaa. Your results have been released securely.',
      bodyAr: 'لديك تحديث جديد من دار الأشعة. تم اعتماد تقرير الفحص الخاص بك وأصبح متاحاً.',
      timeAgoEn: 'Just now',
      timeAgoAr: 'الآن',
      dateCategory: 'today',
      isRead: false,
      linkTab: 'results',
      reportId: report.id,
    };
    this.state.notifications = [notif, ...this.state.notifications];

    this.addAudit('Results Released to Patient', 'تسليم نتيجة الفحص للمريض', `Report ${report.id} (${report.examAr})`);
    this.notifyListeners();
  }

  public closeCase(caseId: string, outcome: string, sendRatingRequest = true) {
    const targetCase = this.state.cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    targetCase.stage = 'closed';
    targetCase.outcome = outcome;
    targetCase.closedAt = new Date().toISOString();

    if (sendRatingRequest) {
      this.sendMessage({
        caseId,
        patientId: targetCase.patientId,
        kind: 'rating_request',
        from: 'system',
        textAr: 'كيف كانت تجربتك مع دار الأشعة؟ نرجو تقييم الخدمة لمساعدتنا في التطوير المستمر.',
        textEn: 'How was your experience with Dar El Ashaa? Please rate our service.',
      });
    }

    this.addAudit('Case Closed', 'إغلاق طلب الخدمة', `Case ${caseId} (Outcome: ${outcome})`);
    this.notifyListeners();
  }

  public rateCase(caseId: string, rating: number, comment?: string) {
    const targetCase = this.state.cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    targetCase.rating = rating;
    targetCase.ratingComment = comment;

    this.sendMessage({
      caseId,
      patientId: targetCase.patientId,
      kind: 'system_event',
      from: 'system',
      rating,
      textAr: `شكراً لك! تم استلام تقييمك (${rating} من ٥ نجوم). نسعى دائماً لتقديم أفضل رعاية طبية.`,
      textEn: `Thank you! Received your feedback (${rating}/5 stars).`,
    });

    this.addAudit('Patient Rating Submitted', 'تسجيل تقييم المريض', `Case ${caseId}: ${rating}/5`);
    this.notifyListeners();
  }

  public deleteAccount(userId: string) {
    this.state.patients = this.state.patients.filter((p) => p.id !== userId);
    this.state.doctors = this.state.doctors.filter((d) => d.id !== userId);
    this.state.currentUserId = 'pt-guest';
    this.state.currentUserType = 'guest';
    this.addAudit('Account Deletion Requested', 'طلب حذف حساب مستخدم', `User ${userId}`);
    this.notifyListeners();
  }

  public resetDemo() {
    this.state = {
      language: 'ar',
      currentUserId: 'pt-mona',
      currentUserType: 'patient',
      phoneOffline: false,
      demoClockOffsetMinutes: 0,
      frameMode: 'framed',
      activeTab: 'home',
      staffConsolePeekOpen: false,

      branches: SEED_BRANCHES,
      services: SEED_SERVICES,
      staff: SEED_STAFF,
      patients: SEED_PATIENTS,
      doctors: SEED_DOCTORS,
      caseTypes: SEED_CASE_TYPES,
      cases: SEED_CASES,
      messages: SEED_MESSAGES,
      portalReports: SEED_PORTAL_REPORTS,
      promotions: SEED_PROMOTIONS,
      faq: SEED_FAQ,
      notifications: SEED_NOTIFICATIONS,
      cannedResponses: SEED_CANNED,
      auditLog: SEED_AUDIT,
      typingParticipant: null,
    };
    this.notifyListeners();
  }
}

export const demoStore = new DemoStore();
