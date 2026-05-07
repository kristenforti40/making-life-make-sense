'use client';

import { useState } from 'react';
import { useStore, nanoid } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { formatDate } from '@/lib/mock-data';
import { Trash2, CheckCircle2, Circle, Clock, Archive } from 'lucide-react';
import type { CaptureStatus, CaptureCategory } from '@/lib/types';

const CATEGORY_BADGE: Record<CaptureCategory, 'peach' | 'sage' | 'amber' | 'rose' | 'default'> = {
  task: 'peach',
  idea: 'sage',
  note: 'default',
  question: 'amber',
  reminder: 'rose',
};

const STATUS_FILTERS: { label: string; value: CaptureStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Inbox', value: 'inbox' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
  { label: 'Archived', value: 'archived' },
];

export default function InboxPage() {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState<CaptureStatus | 'all'>('inbox');

  const filtered =
    filter === 'all'
      ? state.captures
      : state.captures.filter((c) => c.status === filter);

  function cycleStatus(id: string, current: CaptureStatus) {
    const next: Record<CaptureStatus, CaptureStatus> = {
      inbox: 'in_progress',
      in_progress: 'done',
      done: 'archived',
      archived: 'inbox',
    };
    const capture = state.captures.find((c) => c.id === id);
    if (!capture) return;
    dispatch({ type: 'UPDATE_CAPTURE', payload: { ...capture, status: next[current] } });
  }

  const StatusIcon = ({ status }: { status: CaptureStatus }) => {
    if (status === 'done') return <CheckCircle2 size={15} className="text-[#7a9e7e]" />;
    if (status === 'in_progress') return <Clock size={15} className="text-[#c4a55a]" />;
    if (status === 'archived') return <Archive size={15} className="text-[#5a4e42]" />;
    return <Circle size={15} className="text-[#5a4e42]" />;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#e8dcc8]">Inbox</h1>
        <p className="text-[#9a8a78] text-sm mt-1">Everything you&apos;ve captured</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-[#141210] border border-[#1e1b17] rounded-xl p-1 w-fit">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              filter === f.value
                ? 'bg-[#2a2420] text-[#e8dcc8] font-medium'
                : 'text-[#9a8a78] hover:text-[#e8dcc8]'
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-[10px] text-[#5a4e42]">
              {f.value === 'all'
                ? state.captures.length
                : state.captures.filter((c) => c.status === f.value).length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && (
          <Card>
            <p className="text-[#5a4e42] text-sm text-center py-6">Nothing here.</p>
          </Card>
        )}
        {filtered.map((item) => (
          <Card key={item.id} className="flex items-start gap-3 !p-4">
            <button
              onClick={() => cycleStatus(item.id, item.status)}
              className="mt-0.5 shrink-0 hover:opacity-70 transition-opacity"
            >
              <StatusIcon status={item.status} />
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm leading-snug ${
                  item.status === 'done' || item.status === 'archived'
                    ? 'text-[#5a4e42] line-through'
                    : 'text-[#e8dcc8]'
                }`}
              >
                {item.text}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant={CATEGORY_BADGE[item.category]}>{item.category}</Badge>
                <span className="text-[11px] text-[#5a4e42]">{formatDate(item.date)}</span>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'DELETE_CAPTURE', payload: item.id })}
              className="shrink-0 text-[#5a4e42] hover:text-[#c47a7a] transition-colors mt-0.5"
            >
              <Trash2 size={13} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
