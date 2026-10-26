export type NavSection =
  | 'dashboard'
  | 'war-room'
  | 'password-lab'
  | 'phishing-lab'
  | 'sqli-lab'
  | 'xss-lab'
  | 'recon-lab'
  | 'crypto-lab'
  | 'learning-paths'
  | 'ai-mentor'
  | 'certificates';

export interface UserProgress {
  xp: number;
  level: number;
  lessonsMastered: number;
  exercisesPassed: number;
  badges: string[];
  completedLabs: Record<string, boolean>;
  solvedQuizzes: Record<string, boolean>;
  incidentsResolved: number;
  userName: string;
}

export interface AttackIncident {
  id: string;
  name: string;
  vector: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'CONTAINED' | 'MITIGATED' | 'FAILED';
  targetAsset: string;
  sourceIp: string;
  timestamp: string;
  description: string;
  rawLogs: string[];
  optimalSteps: string[];
  availableActions: {
    id: string;
    label: string;
    description: string;
    isCorrect: boolean;
    costSeconds: number;
  }[];
}

export interface PhishingEmail {
  id: string;
  senderName: string;
  senderEmail: string;
  replyTo: string;
  subject: string;
  date: string;
  isPhish: boolean;
  spf: 'Pass' | 'SoftFail' | 'Fail' | 'Neutral';
  dkim: 'Pass' | 'Fail' | 'None';
  dmarc: 'Pass' | 'Fail' | 'None';
  originatingIp: string;
  snippet: string;
  bodyHtml: string;
  links: {
    displayText: string;
    actualUrl: string;
    isMalicious: boolean;
  }[];
  redFlags: string[];
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
}

export interface LearningLesson {
  id: string;
  title: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  duration: string;
  summary: string;
  keyConcepts: string[];
  codeSnippet?: string;
  quiz: QuizQuestion;
}

export interface LearningModule {
  id: string;
  title: string;
  track: 'DEFENSIVE' | 'OFFENSIVE' | 'NETWORKING';
  description: string;
  lessons: LearningLesson[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockedAtXp?: number;
  requiredAction?: string;
}
