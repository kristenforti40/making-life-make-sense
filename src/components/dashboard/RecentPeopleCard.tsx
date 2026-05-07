'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Card, CardHeader } from '@/components/ui/Card';
import { daysSince } from '@/lib/mock-data';
import { ArrowRight } from 'lucide-react';

export default function RecentPeopleCard() {
  const { state } = useStore();

  const recent = [...state.people]
    .sort(
      (a, b) =>
        new Date(b.lastContacted).getTime() - new Date(a.lastContacted).getTime()
    )
    .slice(0, 4);

  return (
    <Card>
      <CardHeader
        title="People"
        subtitle="Recently in touch"
        action={
          <Link
            href="/people"
            className="text-[11px] text-[#9a8a78] hover:text-[#c4855a] flex items-center gap-1 transition-colors"
          >
            All <ArrowRight size={11} />
          </Link>
        }
      />
      <div className="flex flex-col gap-3">
        {recent.map((person) => {
          const days = daysSince(person.lastContacted);
          return (
            <div key={person.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2a2420] flex items-center justify-center text-sm shrink-0">
                {person.emoji ?? person.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#e8dcc8] text-sm font-medium truncate">{person.name}</p>
                <p className="text-[#5a4e42] text-[11px]">{person.relationship}</p>
              </div>
              <span className="text-[11px] text-[#9a8a78] shrink-0">
                {days === 0 ? 'today' : days === 1 ? 'yesterday' : `${days}d ago`}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
