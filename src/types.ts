export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  examType: string;
  learningMode: string;
  subjects: string[];
  notes?: string;
  createdAt: string;
  syncedToGoogleSheet?: boolean;
  lastSyncMessage?: string;
}

export interface GoogleSheetConfig {
  webAppUrl: string;
  autoSync: boolean;
  lastTestedAt?: string;
  isConnected?: boolean;
}

export type LearningModeType = 'Physical Classes' | 'Live Online Classes' | 'Recorded Lessons' | 'One-on-One Coaching';

export type ExamCategory = 'WAEC' | 'NECO' | 'JAMB' | 'IGCSE' | 'JUPEB' | 'A-Level';

export interface SubjectItem {
  id: string;
  name: string;
  category: 'Sciences' | 'Commercial' | 'Arts & General';
  iconName: string;
  description: string;
  keyTopics: string[];
}
