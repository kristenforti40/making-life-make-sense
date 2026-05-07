'use client';

import { useState } from 'react';
import { useStore, nanoid } from '@/lib/store';
import { Card, CardHeader, Badge } from '@/components/ui/Card';
import { formatDate, isOverdue, daysSince, CADENCE_DAYS } from '@/lib/mock-data';
import type { Person, RelationshipType, ContactCadence } from '@/lib/types';
import { Plus, Trash2, Edit2, Check, X, AlertCircle } from 'lucide-react';

const RELATIONSHIP_TYPES: RelationshipType[] = [
  'Friend', 'Family', 'Mentor', 'Colleague', 'Acquaintance', 'Romantic', 'Other',
];
const CADENCES: ContactCadence[] = ['weekly', 'biweekly', 'monthly', 'quarterly'];

const REL_BADGE: Record<RelationshipType, 'peach' | 'sage' | 'amber' | 'rose' | 'default' | 'muted'> = {
  Friend: 'peach',
  Family: 'sage',
  Mentor: 'amber',
  Colleague: 'default',
  Acquaintance: 'muted',
  Romantic: 'rose',
  Other: 'muted',
};

function PersonForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Person>;
  onSave: (p: Person) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [relationship, setRelationship] = useState<RelationshipType>(initial?.relationship ?? 'Friend');
  const [lastContacted, setLastContacted] = useState(
    initial?.lastContacted ?? new Date().toISOString().split('T')[0]
  );
  const [cadence, setCadence] = useState<ContactCadence>(initial?.cadence ?? 'monthly');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [emoji, setEmoji] = useState(initial?.emoji ?? '');

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? nanoid(),
      name: name.trim(),
      relationship,
      lastContacted,
      cadence,
      notes: notes.trim(),
      emoji: emoji.trim() || undefined,
    });
  }

  return (
    <Card className="mb-4">
      <CardHeader title={initial?.id ? 'Edit Person' : 'Add Person'} />
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          </div>
          <div>
            <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">Emoji</label>
            <input type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🌙" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">Relationship</label>
            <select value={relationship} onChange={(e) => setRelationship(e.target.value as RelationshipType)}>
              {RELATIONSHIP_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">Cadence</label>
            <select value={cadence} onChange={(e) => setCadence(e.target.value as ContactCadence)}>
              {CADENCES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">Last Contact</label>
            <input type="date" value={lastContacted} onChange={(e) => setLastContacted(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-[11px] text-[#9a8a78] uppercase tracking-wide font-medium block mb-1.5">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Context, reminders…" rows={2} />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c4855a] hover:bg-[#d4956a] text-[#0e0c0a] text-xs font-semibold rounded-lg transition-colors">
            <Check size={12} /> Save
          </button>
          <button onClick={onCancel} className="flex items-center gap-1.5 px-3 py-1.5 text-[#9a8a78] hover:text-[#e8dcc8] text-xs rounded-lg transition-colors">
            <X size={12} /> Cancel
          </button>
        </div>
      </div>
    </Card>
  );
}

export default function PeoplePage() {
  const { state, dispatch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'overdue'>('all');

  const people = filter === 'overdue'
    ? state.people.filter(isOverdue)
    : state.people;

  const sorted = [...people].sort((a, b) => {
    const aOver = isOverdue(a) ? -1 : 1;
    const bOver = isOverdue(b) ? -1 : 1;
    if (aOver !== bOver) return aOver - bOver;
    return new Date(a.lastContacted).getTime() - new Date(b.lastContacted).getTime();
  });

  function handleSave(p: Person) {
    if (state.people.find((x) => x.id === p.id)) {
      dispatch({ type: 'UPDATE_PERSON', payload: p });
    } else {
      dispatch({ type: 'ADD_PERSON', payload: p });
    }
    setShowForm(false);
    setEditingId(null);
  }

  function markContacted(person: Person) {
    dispatch({
      type: 'UPDATE_PERSON',
      payload: { ...person, lastContacted: new Date().toISOString().split('T')[0] },
    });
  }

  const overdueCount = state.people.filter(isOverdue).length;

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#e8dcc8]">People</h1>
          <p className="text-[#9a8a78] text-sm mt-1">Relationships worth tending</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#c4855a] hover:bg-[#d4956a] text-[#0e0c0a] text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={14} strokeWidth={2.5} />
          Add person
        </button>
      </div>

      {(showForm && !editingId) && (
        <PersonForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {/* Filter */}
      <div className="flex gap-1 mb-5 bg-[#141210] border border-[#1e1b17] rounded-xl p-1 w-fit">
        {(['all', 'overdue'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              filter === f ? 'bg-[#2a2420] text-[#e8dcc8] font-medium' : 'text-[#9a8a78] hover:text-[#e8dcc8]'
            }`}
          >
            {f === 'all' ? 'All' : 'Overdue'}
            <span className="ml-1.5 text-[10px] text-[#5a4e42]">
              {f === 'all' ? state.people.length : overdueCount}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((person) => {
          const overdue = isOverdue(person);
          const days = daysSince(person.lastContacted);
          const overdueDays = days - (CADENCE_DAYS[person.cadence] ?? 30);

          if (editingId === person.id) {
            return (
              <PersonForm
                key={person.id}
                initial={person}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
              />
            );
          }

          return (
            <Card key={person.id} className="group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2a2420] flex items-center justify-center text-lg shrink-0">
                  {person.emoji ?? person.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#e8dcc8] font-semibold text-sm">{person.name}</span>
                    {overdue && (
                      <AlertCircle size={12} className="text-[#c47a7a]" strokeWidth={1.5} />
                    )}
                    <Badge variant={REL_BADGE[person.relationship]}>{person.relationship}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#5a4e42]">
                    <span>Last: {formatDate(person.lastContacted)}</span>
                    <span>·</span>
                    <span>{person.cadence}</span>
                    {overdue && (
                      <>
                        <span>·</span>
                        <span className="text-[#c47a7a]">+{overdueDays}d overdue</span>
                      </>
                    )}
                  </div>
                  {person.notes && (
                    <p className="text-[#9a8a78] text-xs mt-1.5 leading-relaxed line-clamp-2">
                      {person.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => markContacted(person)}
                    title="Mark as contacted today"
                    className="px-2 py-1 text-[11px] text-[#7a9e7e] hover:bg-[#1e2e20] rounded-md transition-colors"
                  >
                    ✓ Contacted
                  </button>
                  <button
                    onClick={() => setEditingId(person.id)}
                    className="p-1.5 text-[#5a4e42] hover:text-[#9a8a78] rounded-md transition-colors"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_PERSON', payload: person.id })}
                    className="p-1.5 text-[#5a4e42] hover:text-[#c47a7a] rounded-md transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
