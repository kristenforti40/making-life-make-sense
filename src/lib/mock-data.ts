import type { AppState } from './types';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export const MOCK_DATA: AppState = {
  captures: [
    {
      id: 'c1',
      text: 'Research LSAT prep schedules for 170+ scorers',
      date: daysAgo(0),
      category: 'task',
      status: 'inbox',
    },
    {
      id: 'c2',
      text: 'Write essay about memory and place',
      date: daysAgo(1),
      category: 'idea',
      status: 'inbox',
    },
    {
      id: 'c3',
      text: 'Follow up with Marcus about the apartment',
      date: daysAgo(1),
      category: 'reminder',
      status: 'inbox',
    },
    {
      id: 'c4',
      text: 'Read: The Sovereignty of Good by Iris Murdoch',
      date: daysAgo(2),
      category: 'note',
      status: 'in_progress',
    },
    {
      id: 'c5',
      text: 'Look into cold plunge protocols for recovery',
      date: daysAgo(3),
      category: 'idea',
      status: 'inbox',
    },
    {
      id: 'c6',
      text: 'Draft outline for personal statement',
      date: daysAgo(4),
      category: 'task',
      status: 'in_progress',
    },
    {
      id: 'c7',
      text: 'Is parallel structure tested more in LR or RC?',
      date: daysAgo(5),
      category: 'question',
      status: 'done',
    },
  ],

  lsatSessions: [
    {
      id: 'l1',
      date: daysAgo(0),
      minutes: 75,
      section: 'Logical Reasoning',
      notes: 'Focused on flaw questions — getting faster',
    },
    {
      id: 'l2',
      date: daysAgo(1),
      minutes: 90,
      section: 'Reading Comprehension',
      notes: 'Law passage difficulty is still high',
    },
    {
      id: 'l3',
      date: daysAgo(2),
      minutes: 120,
      section: 'Practice Test',
      notes: 'Full PT #71',
      score: 163,
    },
    {
      id: 'l4',
      date: daysAgo(3),
      minutes: 60,
      section: 'Review',
      notes: 'Reviewed PT #71 LR sections',
    },
    {
      id: 'l5',
      date: daysAgo(5),
      minutes: 45,
      section: 'Drill',
      notes: 'Must Be True drills — 85% accuracy',
    },
    {
      id: 'l6',
      date: daysAgo(6),
      minutes: 90,
      section: 'Logical Reasoning',
      notes: 'Assumption family questions',
    },
  ],

  workouts: [
    {
      id: 'w1',
      date: daysAgo(0),
      type: 'Strength',
      duration: 55,
      notes: 'Upper body push day. Hit 185 bench.',
    },
    {
      id: 'w2',
      date: daysAgo(2),
      type: 'Run',
      duration: 35,
      notes: '4.2 miles, easy pace',
    },
    {
      id: 'w3',
      date: daysAgo(3),
      type: 'Strength',
      duration: 60,
      notes: 'Leg day. Squats felt strong.',
    },
    {
      id: 'w4',
      date: daysAgo(5),
      type: 'Yoga',
      duration: 45,
      notes: 'Morning flow. Really needed this.',
    },
    {
      id: 'w5',
      date: daysAgo(6),
      type: 'HIIT',
      duration: 30,
      notes: 'Tabata style, 8 rounds',
    },
  ],

  writingNotes: [
    {
      id: 'n1',
      title: 'On Making Sense of Things',
      body: `There is something almost violent about clarity. To understand something fully is to strip it of the comfortable fog that allowed you to live alongside it without confrontation.\n\nI have been thinking about this in relation to memory—how the act of writing about a place changes your relationship to it forever. The place becomes fixed. The living thing becomes an artifact.`,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
      tags: ['essay', 'memory', 'draft'],
    },
    {
      id: 'n2',
      title: 'Personal Statement — Draft 1',
      body: `The summer I turned twenty-two, I spent three months cataloguing court records for a nonprofit legal clinic in the south side. What I found there wasn't justice or injustice in the clean forms I had imagined—it was procedure, and the way procedure can become its own kind of cruelty.\n\nThat experience is why I want to study law.`,
      createdAt: daysAgo(14),
      updatedAt: daysAgo(2),
      tags: ['lsat', 'personal statement', 'draft'],
    },
    {
      id: 'n3',
      title: 'Book Notes: The Sovereignty of Good',
      body: `Murdoch argues that attention is the fundamental moral act. Not will, not choice—attention. To see the other person clearly, without the distorting lens of the self, is already to be moral.\n\n"Love is the extremely difficult realization that something other than oneself is real."`,
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
      tags: ['book notes', 'philosophy'],
    },
    {
      id: 'n4',
      title: 'Fragment: The Cartography of Loss',
      body: `Every city you have loved becomes a map of losses. The coffee shop that closed. The friend who moved. The version of yourself that walked those streets believing the future was still wholly open.`,
      createdAt: daysAgo(21),
      updatedAt: daysAgo(21),
      tags: ['fragment', 'prose'],
    },
  ],

  people: [
    {
      id: 'p1',
      name: 'Marcus Webb',
      relationship: 'Friend',
      lastContacted: daysAgo(12),
      notes: 'Moving to Chicago next month. Check in about the apartment situation.',
      cadence: 'biweekly',
      emoji: '🤝',
    },
    {
      id: 'p2',
      name: 'Dr. Okonkwo',
      relationship: 'Mentor',
      lastContacted: daysAgo(21),
      notes: 'Law school mentor. Send updated personal statement when ready.',
      cadence: 'monthly',
      emoji: '📚',
    },
    {
      id: 'p3',
      name: 'Jade Torres',
      relationship: 'Friend',
      lastContacted: daysAgo(5),
      notes: 'Working on a novel. Ask about her writing residency application.',
      cadence: 'weekly',
      emoji: '✍️',
    },
    {
      id: 'p4',
      name: 'Mom',
      relationship: 'Family',
      lastContacted: daysAgo(8),
      notes: 'Call more. She mentioned the garden is coming in well.',
      cadence: 'weekly',
      emoji: '🌿',
    },
    {
      id: 'p5',
      name: 'Elliot Park',
      relationship: 'Colleague',
      lastContacted: daysAgo(45),
      notes: 'Worked together at the clinic. Brilliant. Reach out about LSAT study group.',
      cadence: 'monthly',
      emoji: '⚖️',
    },
    {
      id: 'p6',
      name: 'Simone Laurent',
      relationship: 'Friend',
      lastContacted: daysAgo(3),
      notes: 'Visiting next month. Plan something.',
      cadence: 'biweekly',
      emoji: '🌙',
    },
  ],
};

export const CADENCE_DAYS: Record<string, number> = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
  quarterly: 90,
};

export function isOverdue(person: { lastContacted: string; cadence: string }): boolean {
  const days = CADENCE_DAYS[person.cadence] ?? 30;
  const last = new Date(person.lastContacted);
  const now = new Date();
  const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return diff > days;
}

export function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

export function isThisWeek(dateStr: string): boolean {
  const weekStart = getWeekStart();
  return dateStr >= weekStart;
}
