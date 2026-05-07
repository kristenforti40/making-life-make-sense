'use client';

import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useStore, nanoid } from '@/lib/store';
import type { CaptureCategory } from '@/lib/types';

const CATEGORIES: CaptureCategory[] = ['idea', 'task', 'note', 'question', 'reminder'];

export default function CaptureBar() {
  const { dispatch } = useStore();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<CaptureCategory>('task');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    dispatch({
      type: 'ADD_CAPTURE',
      payload: {
        id: nanoid(),
        text: trimmed,
        date: new Date().toISOString().split('T')[0],
        category,
        status: 'inbox',
      },
    });

    setText('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 px-5 py-3 bg-[#141210] border-b border-[#1e1b17]"
    >
      <div className="flex items-center gap-2 text-[#5a4e42]">
        <Sparkles size={14} strokeWidth={1.5} />
      </div>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Capture anything — task, idea, note, question…"
        className="flex-1 bg-transparent border-none outline-none text-sm text-[#e8dcc8] placeholder:text-[#5a4e42] p-0"
        style={{ borderRadius: 0, padding: 0 }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as CaptureCategory)}
        className="text-[11px] text-[#9a8a78] bg-[#1a1714] border border-[#2a2420] rounded-md px-2 py-1 outline-none w-auto"
        style={{ width: 'auto' }}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c4855a] hover:bg-[#d4956a] text-[#0e0c0a] text-xs font-semibold rounded-lg transition-colors duration-150"
      >
        <Plus size={13} strokeWidth={2.5} />
        Add
      </button>
    </form>
  );
}
