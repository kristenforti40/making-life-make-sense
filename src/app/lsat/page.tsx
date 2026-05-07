'use client';

import { useState } from 'react';
import { useStore, nanoid } from '@/lib/store';
import { Card, CardHeader, Badge } from '@/components/ui/Card';
import { formatDate, isThisWeek } from '@/lib/mock-data';
import type { LSATSection } from '@/lib/types';
import { Plus, Trash2, BookOpen, Clock, Trophy } from 'lucide-react';

const SECTIONS: LSATSection[] = [
  'Logical Reasoning',
  'Reading Comprehension',
  'Analytical Reasoning',
  'Drill',
  'Practice Test',
  'Review',
];

const SECTION_BADGE: Record<LSATSection, 'peach' | 'sage' | 'amber' | 'rose' | 'default' | 'muted'> = {
  'Logical Reasoning': 'peach',
  'Reading Comprehension': 'sage',
  'Analytical Reasoning': 'amber',
  Drill: 'default',
  'Practice Test': 'rose',
  Review: 'muted',
};

export default function LSATPage() {
  const { state, dispatch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [minutes, setMinutes] = useState('60');
  const [section, setSection] = useState<LSATSection>('Logical Reasoning');
  const [notes, setNotes] = useState('');
  const [score, setScore] = useState('');

  const sorted = [...state.lsatSessions].sort((a, b) =>
    a.date > b.date ? -1 : 1
  );

  const weekMinutes = state.lsatSessions
    .filter((s) => isThisWeek(s.date))
    .reduce((sum, s) => sum + s.minutes, 0);

  const totalMinutes = state.lsatSessions.reduce((sum, s) => sum + s.minutes, 0);
  const practiceTests = state.lsatSessions.filter((s) => s.section === 'Practice Test');
  const avgScore =
    practiceTests.filter((s) => s.score).length > 0
      ? Math.round(
          practiceTests.filter((s) => s.score).reduce((sum, s) => sum + (s.score ?? 0), 0) /
            practiceTests.filter((s) => s.score).length
        )
      : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mins = parseInt(minutes);
    if (!mins || mins <= 0) return;
    dispatch({
      type: 'ADD_LSAT_SESSION',
      payload: {
        id: nanoid(),
        date,
        minutes: mins,
        section,
        notes: notes.trim(),
        score: score ? parseInt(score) : undefined,
      },
    });
    setNotes('');
    setScore('');
    setMinutes('60');
    setShowForm(false);
  }

  const weekHours = Math.floor(weekMinutes / 60);
  const weekMins = weekMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#e8dcc8]">LSAT Prep</h1>
          <p className="text-[#9a8a78] text-sm mt-1">Track your study sessions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#c4855a] hover:bg-[#d4956a] text-[#0e0c0a] text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={14} strokeWidth={2.5} />
          Log session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={13} className="text-[#c4855a]" strokeWidth={1.5} />
            <span className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium">This Week</span>
          </div>
          <div className="text-2xl font-semibold text-[#e8dcc8]">
            {weekHours}h {weekMins}m
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={13} className="text-[#7a9e7e]" strokeWidth={1.5} />
            <span className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium">Total</span>
          </div>
          <div className="text-2xl font-semibold text-[#e8dcc8]">{totalHours}h</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={13} className="text-[#c4a55a]" strokeWidth={1.5} />
            <span className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium">Avg PT Score</span>
          </div>
          <div className="text-2xl font-semibold text-[#e8dcc8]">
            {avgScore ?? '—'}
          </div>
        </Card>
      </div>

      {/* Log form */}
      {showForm && (
        <Card className="mb-5">
          <CardHeader title="Log Study Session" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">
                  Date
                </label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">
                  Minutes
                </label>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  min="1"
                  placeholder="60"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">
                  Section
                </label>
                <select value={section} onChange={(e) => setSection(e.target.value as LSATSection)}>
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {section === 'Practice Test' && (
                <div>
                  <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">
                    Score (optional)
                  </label>
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    min="120"
                    max="180"
                    placeholder="163"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you work on?"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#c4855a] hover:bg-[#d4956a] text-[#0e0c0a] text-sm font-semibold rounded-lg transition-colors"
              >
                Save session
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-[#9a8a78] hover:text-[#e8dcc8] text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Sessions list */}
      <div className="flex flex-col gap-2">
        {sorted.map((session) => (
          <Card key={session.id} className="flex items-start gap-3 !p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={SECTION_BADGE[session.section]}>{session.section}</Badge>
                {session.score && (
                  <span className="text-[11px] text-[#c4a55a] font-semibold">
                    Score: {session.score}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#e8dcc8] text-sm font-semibold">
                  {session.minutes}m
                </span>
                <span className="text-[#5a4e42] text-[11px]">{formatDate(session.date)}</span>
              </div>
              {session.notes && (
                <p className="text-[#9a8a78] text-xs mt-1 leading-relaxed">{session.notes}</p>
              )}
            </div>
            <button
              onClick={() => dispatch({ type: 'DELETE_LSAT_SESSION', payload: session.id })}
              className="shrink-0 text-[#5a4e42] hover:text-[#c47a7a] transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
