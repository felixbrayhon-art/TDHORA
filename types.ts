
export type AppView = 'HUB' | 'TIMER' | 'FLASHCARDS' | 'AI_DIRECT' | 'MATERIALS' | 'QUIZ_PLAYER' | 'TDH_QUESTOES' | 'STUDY_PLAN' | 'PROFILE' | 'COMMUNITY' | 'FOCUS_MODE';
export type StudyProfile = 'VESTIBULAR' | 'CONCURSO';
export type HubCategory = 'ESTUDO' | 'ORGANIZACAO' | 'RELAXE';

export enum TimerMode {
  POMODORO = 'POMODORO',
  EMERGENCY = 'EMERGENCY',
  BREAK = 'BREAK'
}

export interface FishRank {
  days: number;
  label: string;
  id: 'PALHACO' | 'CIRURGIAO' | 'CAVALO' | 'ARRAIA' | 'ESPADA' | 'TUBARAO' | 'INICIANTE';
  description: string;
}

export const FISH_RANKS: FishRank[] = [
  { days: 0, label: 'Alevino', id: 'INICIANTE', description: 'O começo da jornada nas águas profundas.' },
  { days: 30, label: 'Peixe Palhaço', id: 'PALHACO', description: 'Iniciante - O primeiro mergulho no foco.' },
  { days: 60, label: 'Peixe Cirurgião', id: 'CIRURGIAO', description: 'Navegador - Já sabe filtrar o conteúdo importante.' },
  { days: 90, label: 'Cavalo-marinho', id: 'CAVALO', description: 'Resiliente - Mantém o ritmo mesmo em mar agitado.' },
  { days: 180, label: 'Arraia', id: 'ARRAIA', description: 'Estrategista - Estuda com suavidade e precisão.' },
  { days: 270, label: 'Peixe-Espada', id: 'ESPADA', description: 'Guerreiro - Foco total e ataque certeiro às questões.' },
  { days: 365, label: 'Tubarão Rei', id: 'TUBARAO', description: 'Mestre / Aprovado - O predador absoluto dos editais.' }
];

export const getFishRank = (days: number): FishRank => {
  return [...FISH_RANKS].reverse().find(r => days >= r.days) || FISH_RANKS[0];
};

export interface FocusSettings {
  waterReminder: boolean;
  waterInterval: number; // em minutos
  medicationReminder: boolean;
  medicationTime: string; // HH:mm
  workTransition: boolean;
  workStartTime: string; // HH:mm
  prepTime: number; // minutos antes do trabalho
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic: string;
}

export interface UserStats {
  name: string;
  avatarColor: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  totalDaysStudied: number;
  lastStudyDate?: string;
  studyProfile?: StudyProfile;
}

export interface Activity {
  id: string;
  userName: string;
  avatarColor: string;
  subject: string;
  duration: number;
  type: 'POMODORO' | 'EMERGENCY' | 'QUIZ' | 'STATUS';
  timestamp: number;
  bubbles: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
  commentary?: string;
}

export interface Notebook {
  id: string;
  name: string;
  questions: QuizQuestion[];
  summary?: string;
  createdAt: number;
}

export interface QuizFolder {
  id: string;
  name: string;
  notebooks: Notebook[];
  topic: string;
  createdAt: number;
}

export interface QuizAttempt {
  folderId: string;
  notebookId: string;
  date: number;
  score: number;
  total: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  durationMinutes: number;
  date: number;
}

export interface StudySubject {
  id: string;
  name: string;
  weight: number; 
  color: string;
  targetMinutes: number; 
  completedMinutesTotal: number;
}

export interface StudyPlan {
  subjects: StudySubject[];
  dailyGoalMinutes: number;
  sessions: StudySession[];
}

export interface DailyHistory {
  [date: string]: number;
}
