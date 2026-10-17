export type ChannelType = 'app' | 'whatsapp';

export type UserType = 'patient' | 'doctor' | 'guest';

export type DoctorStatus = 'pending' | 'verified' | 'rejected';

export type CaseTypeCode = 'BK' | 'RS' | 'IS' | 'GN' | 'RF';

export type CaseStage =
  | 'new'
  | 'details-collected'
  | 'slot-offered'
  | 'confirmed'
  | 'closed'
  | 'identity-verified'
  | 'report-located'
  | 'released'
  | 'acknowledged'
  | 'investigating'
  | 'resolved'
  | 'answered'
  | 'submitted'
  | 'patient-contacted'
  | 'booked'
  | 'scan-done'
  | 'report-sent';

export type SLAStatus = 'on-track' | 'at-risk' | 'overdue' | 'met';

export interface Branch {
  id: string;
  nameEn: string;
  nameAr: string;
  addressEn: string;
  addressAr: string;
  hoursEn: string;
  hoursAr: string;
  phone: string;
  whatsapp: string;
  isOpenNow: boolean;
  coordinates: { lat: number; lng: number };
}

export interface Service {
  id: string;
  en: string;
  ar: string;
  short: string;
  descriptionEn: string;
  descriptionAr: string;
  prepEn: string[];
  prepAr: string[];
  durationEn: string;
  durationAr: string;
  branches: string[];
}

export interface Team {
  id: string;
  name: string;
  nameAr: string;
  supervisorId: string;
  routing: 'round-robin' | 'least-busy' | 'manual';
  capacityPerAgent: number;
}

export type StaffRole =
  | 'Administrator'
  | 'Supervisor'
  | 'Agent'
  | 'Doctor Relations Officer'
  | 'Content Manager'
  | 'Compliance Officer';

export interface Staff {
  id: string;
  name: string;
  nameAr: string;
  role: StaffRole;
  teams: string[];
  status: 'Online' | 'Away' | 'Offline';
  email: string;
  activeCasesCount: number;
}

export interface Patient {
  id: string;
  nameEn: string;
  nameAr: string;
  gender: 'F' | 'M';
  age: number;
  phone: string;
  dob: string;
  preferredBranch: string;
  channel: ChannelType;
  language: 'ar' | 'en';
  consents: {
    health: boolean;
    hosting: boolean;
    offers: boolean;
  };
  consentVersion?: string;
  consentTimestamp?: string;
}

export interface Doctor {
  id: string;
  name: string;
  nameAr: string;
  specialtyEn: string;
  specialtyAr: string;
  clinicEn: string;
  clinicAr: string;
  syndicateNo: string;
  cardImage?: string;
  status: DoctorStatus;
  rejectionReason?: string;
  phone?: string;
}

export interface CaseStageDef {
  key: CaseStage;
  en: string;
  ar: string;
}

export interface CaseType {
  code: CaseTypeCode;
  en: string;
  ar: string;
  teamId: string;
  stages: CaseStageDef[];
  outcomes: string[];
  slaFirstResponseMin: number;
  slaResolveMin: number;
}

export interface Case {
  id: string;
  type: CaseTypeCode;
  patientId: string;
  doctorId?: string;
  stage: CaseStage;
  ownerId: string | null;
  teamId: string;
  channel: ChannelType;
  priority: 'Normal' | 'High' | 'Urgent';
  createdMinAgo: number;
  createdAt: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  summary: string;
  summaryAr?: string;
  category?: string;
  outcome?: string;
  rating?: number;
  ratingComment?: string;
  reportId?: string;
  slotDetails?: {
    day: string;
    dayAr: string;
    time: string;
    branchId: string;
  };
  referralConsent?: 'recorded' | 'missing';
  referralConsentMethod?: 'Signed form' | 'Verbal';
}

export type MessageKind =
  | 'text'
  | 'image'
  | 'document'
  | 'voice'
  | 'menu'
  | 'menu_reply'
  | 'form_card'
  | 'slot_offer'
  | 'results_card'
  | 'rating_request'
  | 'system_event'
  | 'internal_note';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  caseId?: string;
  patientId: string;
  kind: MessageKind;
  from: 'patient' | 'doctor' | 'staff' | 'system';
  staffId?: string;
  textEn?: string;
  textAr?: string;
  timestamp: string;
  status: MessageStatus;
  // Specific payload fields
  form?: 'booking' | 'issue' | 'referral';
  formData?: Record<string, any>;
  slotDayEn?: string;
  slotDayAr?: string;
  slotTime?: string;
  slotBranchId?: string;
  slotStatus?: 'pending' | 'confirmed' | 'declined';
  reportId?: string;
  rating?: number;
  voiceDuration?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface PortalReport {
  id: string;
  patientId: string;
  examEn: string;
  examAr: string;
  branchId: string;
  date: string;
  visitNo: string;
  status: 'pending' | 'available' | 'released' | 'expired';
  expiryDate: string;
  referralId?: string;
  releasedAt?: string;
  releasedBy?: string;
  qrPayload?: string;
  openedAt?: string;
}

export interface Promotion {
  id: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  audience: {
    userType: 'patient' | 'doctor' | 'all';
    gender?: 'F' | 'M' | 'any';
    ageMin?: number;
    ageMax?: number;
  };
  placement: ('home' | 'chat' | 'notification')[];
  start: string;
  end: string;
  status: 'live' | 'scheduled' | 'draft' | 'ended' | 'pending_approval';
  cta: {
    kind: 'book' | 'call' | 'whatsapp' | 'link';
    serviceId?: string;
    branchId?: string;
    url?: string;
  };
  imageUrl?: string;
  impressions: number;
  taps: number;
}

export interface FAQItem {
  id: string;
  qEn: string;
  qAr: string;
  aEn: string;
  aAr: string;
  category: 'general' | 'mri' | 'prep' | 'results';
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'message' | 'report_ready' | 'case_update' | 'offer';
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  timeAgoEn: string;
  timeAgoAr: string;
  dateCategory: 'today' | 'yesterday' | 'earlier';
  isRead: boolean;
  linkTab?: string;
  reportId?: string;
  caseId?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  staffName: string;
  action: string;
  actionAr: string;
  object: string;
  beforeVal?: string;
  afterVal?: string;
  ip: string;
}

export interface CannedResponse {
  shortcut: string;
  titleEn: string;
  titleAr: string;
  textEn: string;
  textAr: string;
}
