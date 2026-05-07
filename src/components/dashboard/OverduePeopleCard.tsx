'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Card, CardHeader } from '@/components/ui/Card';
import { isOverdue, daysSince, CADENCE_DAYS } from '@/lib/mock-data';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function OverduePeopleCard() {
  const { state } = useStore();

  const overdue = state.people.filter(isOverdue).sort((a, b) => {
    const dA = daysSince(a.lastContacted) - (CADENCE_DAYS[a.cadence] ?? 30);
    const dB = daysSince(b.lastContacted) - (CADENCE_DAYS[b.cadence] ?? 30);
    return dB - dA;
  });

  if (overdue.length === 0) {
    return (
      <Card>
        <CardHeader title="Follow-ups" subtitle="No overdue contacts" />
        <p className="text-[#5a4e42] text-sm text-center py-3">
          You&apos;re all caught up.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Overdue Follow-ups"
        subtitle={`${overdue.length} contact${overdue.length > 1 ? 's' : ''} waiting`}
        action={
          <Link
            href="/people"
            className="text-[11px] text-[#9a8a78] hover:text-[#c4855a] flex items-center gap-1 transition-colors"
          >
            All <ArrowRight size={11} />
          </Link>
        }
      />
      <div className="flex flex-col gap-2">
        {overdue.slice(0, 5).map((person) => {
          const days = daysSince(person.lastContacted);
          const overdueDays = days - (CADENCE_DAYS[person.cadence] ?? 30);
          return (
            <div
              key={person.id}
              className="flex items-center gap-3 py-2 border-b border-[#1e1b17] last:border-0"
            >
              <AlertCircle size={12} className="text-[#c47a7a] shrink-0" strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-[#e8dcc8] text-sm font-medium truncate">
                  {person.emoji} {person.name}
                </p>
                <p className="text-[#5a4e42] text-[11px]">
                  {person.cadence} · last {days}d ago
                </p>
              </div>
              <span className="text-[11px] text-[#c47a7a] font-medium shrink-0">
                +{overdueDays}d
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
