'use client';

import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Flame } from 'lucide-react';

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort((a, b) => (a > b ? -1 : 1));
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const d of sorted) {
    const date = new Date(d + 'T00:00:00');
    const diff = Math.floor(
      (cursor.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff <= 1) {
      streak++;
      cursor = date;
    } else {
      break;
    }
  }
  return streak;
}

export default function StreakCard() {
  const { state } = useStore();

  const lsatStreak = computeStreak(state.lsatSessions.map((s) => s.date));
  const workoutStreak = computeStreak(state.workouts.map((w) => w.date));

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Flame size={14} className="text-[#c4855a]" strokeWidth={1.5} />
        <h3 className="text-[#e8dcc8] text-sm font-semibold">Streaks</h3>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#9a8a78] text-xs">LSAT Study</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-semibold text-[#e8dcc8]">{lsatStreak}</span>
            <span className="text-[11px] text-[#5a4e42]">days</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#9a8a78] text-xs">Workouts</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-semibold text-[#e8dcc8]">{workoutStreak}</span>
            <span className="text-[11px] text-[#5a4e42]">days</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
