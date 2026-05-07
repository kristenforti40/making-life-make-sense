'use client';

import { useState } from 'react';
import { useStore, nanoid } from '@/lib/store';
import { Card, CardHeader, Badge } from '@/components/ui/Card';
import { formatDate, isThisWeek } from '@/lib/mock-data';
import type { WorkoutType } from '@/lib/types';
import { Plus, Trash2, Dumbbell, Flame, Timer } from 'lucide-react';

const WORKOUT_TYPES: WorkoutType[] = [
  'Strength', 'Cardio', 'Yoga', 'HIIT', 'Run', 'Walk', 'Swim', 'Climb', 'Other',
];

const TYPE_BADGE: Record<WorkoutType, 'peach' | 'sage' | 'amber' | 'rose' | 'default' | 'muted'> = {
  Strength: 'peach',
  Cardio: 'sage',
  Yoga: 'sage',
  HIIT: 'rose',
  Run: 'amber',
  Walk: 'muted',
  Swim: 'default',
  Climb: 'amber',
  Other: 'muted',
};

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort((a, b) => (a > b ? -1 : 1));
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const d of sorted) {
    const date = new Date(d + 'T00:00:00');
    const diff = Math.floor((cursor.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 1) { streak++; cursor = date; } else break;
  }
  return streak;
}

export default function WorkoutsPage() {
  const { state, dispatch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<WorkoutType>('Strength');
  const [duration, setDuration] = useState('45');
  const [notes, setNotes] = useState('');

  const sorted = [...state.workouts].sort((a, b) => (a.date > b.date ? -1 : 1));
  const weekWorkouts = state.workouts.filter((w) => isThisWeek(w.date));
  const weekMinutes = weekWorkouts.reduce((sum, w) => sum + w.duration, 0);
  const streak = computeStreak(state.workouts.map((w) => w.date));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dur = parseInt(duration);
    if (!dur || dur <= 0) return;
    dispatch({
      type: 'ADD_WORKOUT',
      payload: { id: nanoid(), date, type, duration: dur, notes: notes.trim() },
    });
    setNotes('');
    setDuration('45');
    setShowForm(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#e8dcc8]">Workouts</h1>
          <p className="text-[#9a8a78] text-sm mt-1">Stay consistent</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#c4855a] hover:bg-[#d4956a] text-[#0e0c0a] text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={14} strokeWidth={2.5} />
          Log workout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell size={13} className="text-[#c4855a]" strokeWidth={1.5} />
            <span className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium">This Week</span>
          </div>
          <div className="text-2xl font-semibold text-[#e8dcc8]">
            {weekWorkouts.length}
            <span className="text-sm text-[#5a4e42] font-normal ml-1">sessions</span>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Timer size={13} className="text-[#7a9e7e]" strokeWidth={1.5} />
            <span className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium">Week Minutes</span>
          </div>
          <div className="text-2xl font-semibold text-[#e8dcc8]">{weekMinutes}m</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Flame size={13} className="text-[#c4a55a]" strokeWidth={1.5} />
            <span className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium">Streak</span>
          </div>
          <div className="text-2xl font-semibold text-[#e8dcc8]">
            {streak}
            <span className="text-sm text-[#5a4e42] font-normal ml-1">days</span>
          </div>
        </Card>
      </div>

      {/* Log form */}
      {showForm && (
        <Card className="mb-5">
          <CardHeader title="Log Workout" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">
                  Date
                </label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">
                  Type
                </label>
                <select value={type} onChange={(e) => setType(e.target.value as WorkoutType)}>
                  {WORKOUT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">
                  Duration (min)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="1"
                  placeholder="45"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did it go?"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#c4855a] hover:bg-[#d4956a] text-[#0e0c0a] text-sm font-semibold rounded-lg transition-colors"
              >
                Save
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

      <div className="flex flex-col gap-2">
        {sorted.map((workout) => (
          <Card key={workout.id} className="flex items-start gap-3 !p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={TYPE_BADGE[workout.type]}>{workout.type}</Badge>
                <span className="text-[#e8dcc8] text-sm font-semibold">{workout.duration}m</span>
                <span className="text-[#5a4e42] text-[11px]">{formatDate(workout.date)}</span>
              </div>
              {workout.notes && (
                <p className="text-[#9a8a78] text-xs leading-relaxed">{workout.notes}</p>
              )}
            </div>
            <button
              onClick={() => dispatch({ type: 'DELETE_WORKOUT', payload: workout.id })}
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
