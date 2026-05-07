'use client';

import { useState } from 'react';
import { useStore, nanoid } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { formatDate } from '@/lib/mock-data';
import type { WritingNote } from '@/lib/types';
import { Plus, Trash2, Save, X, Tag } from 'lucide-react';

function NoteEditor({
  note,
  onSave,
  onCancel,
}: {
  note: Partial<WritingNote>;
  onSave: (n: WritingNote) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(note.title ?? '');
  const [body, setBody] = useState(note.body ?? '');
  const [tagInput, setTagInput] = useState((note.tags ?? []).join(', '));

  function handleSave() {
    if (!title.trim()) return;
    const now = new Date().toISOString().split('T')[0];
    onSave({
      id: note.id ?? nanoid(),
      title: title.trim(),
      body,
      createdAt: note.createdAt ?? now,
      updatedAt: now,
      tags: tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#9a8a78] text-xs uppercase tracking-widest font-medium">
          {note.id ? 'Edit Note' : 'New Note'}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c4855a] hover:bg-[#d4956a] text-[#0e0c0a] text-xs font-semibold rounded-lg transition-colors"
          >
            <Save size={11} strokeWidth={2.5} />
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-2 py-1.5 text-[#9a8a78] hover:text-[#e8dcc8] text-xs rounded-lg transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="text-lg font-semibold text-[#e8dcc8] bg-transparent border-none outline-none placeholder:text-[#5a4e42] p-0"
        style={{ borderRadius: 0, border: 'none', padding: 0 }}
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write something…"
        rows={12}
        className="text-sm text-[#e8dcc8] bg-transparent border-none outline-none resize-none placeholder:text-[#5a4e42] leading-relaxed p-0"
        style={{ borderRadius: 0, border: 'none', padding: 0 }}
      />

      <div className="flex items-center gap-2 pt-2 border-t border-[#1e1b17]">
        <Tag size={12} className="text-[#5a4e42]" />
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Tags (comma separated)"
          className="text-xs text-[#9a8a78] bg-transparent border-none outline-none flex-1 placeholder:text-[#3a342e] p-0"
          style={{ borderRadius: 0, border: 'none', padding: 0 }}
        />
      </div>
    </Card>
  );
}

export default function WritingPage() {
  const { state, dispatch } = useStore();
  const [editing, setEditing] = useState<Partial<WritingNote> | null>(null);

  const sorted = [...state.writingNotes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  function handleSave(note: WritingNote) {
    if (state.writingNotes.find((n) => n.id === note.id)) {
      dispatch({ type: 'UPDATE_WRITING_NOTE', payload: note });
    } else {
      dispatch({ type: 'ADD_WRITING_NOTE', payload: note });
    }
    setEditing(null);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#e8dcc8]">Writing</h1>
          <p className="text-[#9a8a78] text-sm mt-1">Notes, drafts, fragments</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing({})}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#c4855a] hover:bg-[#d4956a] text-[#0e0c0a] text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={14} strokeWidth={2.5} />
            New note
          </button>
        )}
      </div>

      {editing && (
        <div className="mb-4">
          <NoteEditor note={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {sorted.map((note) =>
          editing?.id === note.id ? null : (
            <Card
              key={note.id}
              onClick={() => setEditing(note)}
              className="group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#e8dcc8] font-semibold text-sm truncate">
                    {note.title}
                  </h3>
                  <p className="text-[#9a8a78] text-xs mt-1 line-clamp-2 leading-relaxed">
                    {note.body}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="muted">
                        {tag}
                      </Badge>
                    ))}
                    <span className="text-[11px] text-[#5a4e42]">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'DELETE_WRITING_NOTE', payload: note.id });
                  }}
                  className="shrink-0 text-[#3a342e] group-hover:text-[#5a4e42] hover:!text-[#c47a7a] transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
