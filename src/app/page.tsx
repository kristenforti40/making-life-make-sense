'use client';

import { useStore } from '@/lib/store';
import { isThisWeek } from '@/lib/mock-data';
import GreetingCard from '@/components/dashboard/GreetingCard';
import WeeklySummaryCard from '@/components/dashboard/WeeklySummaryCard';
import MetricCard from '@/components/dashboard/MetricCard';
import AttentionList from '@/components/dashboard/AttentionList';
import RecentPeopleCard from '@/components/dashboard/RecentPeopleCard';
import OverduePeopleCard from '@/components/dashboard/OverduePeopleCard';
import StreakCard from '@/components/dashboard/StreakCard';
import { Inbox, BookOpen, Flame, Dumbbell, Clock } from 'lucide-react';

export default function HomePage() {
  const { state } = useStore();

  const openCaptures = state.captures.filter(
    (c) => c.status === 'inbox' || c.status === 'in_progress'
  ).length;

  const weekLSATMinutes = state.lsatSessions
    .filter((s) => isThisWeek(s.date))
    .reduce((sum, s) => sum + s.minutes, 0);
  const lsatHours = (weekLSATMinutes / 60).toFixed(1);

  const weekWorkouts = state.workouts.filter((w) => isThisWeek(w.date)).length;
  const weekCaptures = state.captures.filter((c) => isThisWeek(c.date)).length;

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

  const lsatStreak = computeStreak(state.lsatSessions.map((s) => s.date));

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      <GreetingCard />

      {/* Metric row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <WeeklySummaryCard />
        <MetricCard
          label="Inbox"
          value={openCaptures}
          sub="open captures"
          icon={Inbox}
          accent="peach"
        />
        <MetricCard
          label="LSAT hours"
          value={lsatHours}
          sub="this week"
          icon={BookOpen}
          accent="sage"
        />
        <MetricCard
          label="Study streak"
          value={lsatStreak}
          sub="days straight"
          icon={Flame}
          accent="amber"
        />
        <MetricCard
          label="Workouts"
          value={weekWorkouts}
          sub="this week"
          icon={Dumbbell}
          accent="rose"
        />
        <MetricCard
          label="Captures"
          value={weekCaptures}
          sub="this week"
          icon={Clock}
          accent="cream"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: attention + streaks */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AttentionList />
          <StreakCard />
        </div>

        {/* Right column: people */}
        <div className="flex flex-col gap-4">
          <OverduePeopleCard />
          <RecentPeopleCard />
        </div>
      </div>
    </div>
  );
}
