export type CaptureStatus = 'inbox' | 'in_progress' | 'done' | 'archived';
export type CaptureCategory = 'idea' | 'task' | 'note' | 'question' | 'reminder';

export interface Capture {
  id: string;
  text: string;
  date: string; // ISO date string
  category: CaptureCategory;
  status: CaptureStatus;
}

export type LSATSection =
  | 'Logical Reasoning'
  | 'Reading Comprehension'
  | 'Analytical Reasoning'
  | 'Drill'
  | 'Practice Test'
  | 'Review';

export interface LSATSession {
  id: string;
  date: string;
  minutes: number;
  section: LSATSection;
  notes: string;
  score?: number; // for practice tests
}

export type WorkoutType =
  | 'Strength'
  | 'Cardio'
  | 'Yoga'
  | 'HIIT'
  | 'Run'
  | 'Walk'
  | 'Swim'
  | 'Climb'
  | 'Other';

export interface Workout {
  id: string;
  date: string;
  type: WorkoutType;
  duration: number; // minutes
  notes: string;
}

export interface WritingNote {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export type RelationshipType =
  | 'Friend'
  | 'Family'
  | 'Mentor'
  | 'Colleague'
  | 'Acquaintance'
  | 'Romantic'
  | 'Other';

export type ContactCadence = 'weekly' | 'biweekly' | 'monthly' | 'quarterly';

export interface Person {
  id: string;
  name: string;
  relationship: RelationshipType;
  lastContacted: string; // ISO date string
  notes: string;
  cadence: ContactCadence;
  emoji?: string;
}

export interface AppState {
  captures: Capture[];
  lsatSessions: LSATSession[];
  workouts: Workout[];
  writingNotes: WritingNote[];
  people: Person[];
}
