'use client';

import { useStore } from '@/lib/store';
import { isThisWeek } from '@/lib/mock-data';
import { Card, CardHeader } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';

export default function WeeklySummaryCard() {
  const { state } = useStore();

  const weekCaptures = state.captures.filter((c) => isThisWeek(c.date)).length;
  const weekLSATMinutes = state.lsatSessions
    .filter((s) => isThisWeek(s.date))
    .reduce((sum, s) => sum + s.minutes, 0);
  const weekWorkouts = state.workouts.filter((w) => isThisWeek(w.date)).length;
  const openTasks = state.captures.filter(
    (c) => c.status === 'inbox' || c.status === 'in_progress'
  ).length;

  const stats = [
    { label: 'Captures', value: weekCaptures, unit: 'this week' },
    { label: 'LSAT', value: `${Math.round(weekLSATMinutes / 60)}h ${weekLSATMinutes % 60}m`, unit: 'studied' },
    { label: 'Workouts', value: weekWorkouts, unit: 'sessions' },
    { label: 'Open', value: openTasks, unit: 'tasks' },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader
        title="This Week"
        subtitle={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        action={<TrendingUp size={14} className="text-[#5a4e42]" strokeWidth={1.5} />}
      />
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-xl font-semibold text-[#e8dcc8]">{stat.value}</div>
            <div className="text-[11px] text-[#9a8a78] font-medium mt-0.5">{stat.label}</div>
            <div className="text-[10px] text-[#5a4e42]">{stat.unit}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
