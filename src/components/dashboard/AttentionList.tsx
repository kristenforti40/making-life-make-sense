'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Card, CardHeader, Badge } from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';

const CATEGORY_BADGE: Record<string, 'peach' | 'sage' | 'amber' | 'rose' | 'default'> = {
  task: 'peach',
  idea: 'sage',
  note: 'default',
  question: 'amber',
  reminder: 'rose',
};

export default function AttentionList() {
  const { state } = useStore();
  const inbox = state.captures
    .filter((c) => c.status === 'inbox' || c.status === 'in_progress')
    .slice(0, 6);

  return (
    <Card>
      <CardHeader
        title="Attention"
        subtitle={`${inbox.length} items need you`}
        action={
          <Link
            href="/inbox"
            className="text-[11px] text-[#9a8a78] hover:text-[#c4855a] flex items-center gap-1 transition-colors"
          >
            All <ArrowRight size={11} />
          </Link>
        }
      />
      <div className="flex flex-col gap-2">
        {inbox.length === 0 && (
          <p className="text-[#5a4e42] text-sm py-4 text-center">All clear.</p>
        )}
        {inbox.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 py-2 border-b border-[#1e1b17] last:border-0"
          >
            <div className="mt-0.5">
              <Badge variant={CATEGORY_BADGE[item.category] ?? 'default'}>
                {item.category}
              </Badge>
            </div>
            <p className="text-[#e8dcc8] text-sm leading-snug flex-1">{item.text}</p>
            {item.status === 'in_progress' && (
              <span className="shrink-0 text-[10px] text-[#c4a55a] font-medium">active</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
