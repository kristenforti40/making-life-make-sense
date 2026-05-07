'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { Database, Shield, Trash2, Download } from 'lucide-react';

export default function SettingsPage() {
  function handleExport() {
    const data = localStorage.getItem('life-os-data');
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-os-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    if (window.confirm('This will delete all your data and restore mock data. Are you sure?')) {
      localStorage.removeItem('life-os-data');
      window.location.reload();
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#e8dcc8]">Settings</h1>
        <p className="text-[#9a8a78] text-sm mt-1">Configuration and data management</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Data storage */}
        <Card>
          <CardHeader
            title="Data Storage"
            subtitle="Currently using browser localStorage"
            action={<Database size={14} className="text-[#5a4e42]" strokeWidth={1.5} />}
          />
          <p className="text-[#9a8a78] text-sm leading-relaxed mb-4">
            All your data lives in your browser. When Supabase is connected, data will sync across
            devices and be persisted to the cloud. You can export a JSON backup at any time.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#2a2420] hover:bg-[#3a342e] text-[#e8dcc8] text-sm rounded-lg transition-colors"
            >
              <Download size={13} />
              Export JSON
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#2e1e1e] hover:bg-[#3e2424] text-[#c47a7a] text-sm rounded-lg transition-colors"
            >
              <Trash2 size={13} />
              Reset to mock data
            </button>
          </div>
        </Card>

        {/* Supabase */}
        <Card>
          <CardHeader
            title="Supabase Integration"
            subtitle="Planned — cloud sync and auth"
            action={<Shield size={14} className="text-[#5a4e42]" strokeWidth={1.5} />}
          />
          <div className="bg-[#1e1b17] border border-[#2a2420] rounded-xl p-4">
            <p className="text-[11px] text-[#9a8a78] uppercase tracking-widest font-medium mb-3">
              Planned features
            </p>
            <ul className="flex flex-col gap-2">
              {[
                'User auth via Supabase Auth (email + magic link)',
                'Real-time sync across devices',
                'Row-level security — your data is private',
                'Supabase Edge Functions for AI features',
                'Automatic daily backups',
              ].map((item) => (
                <li key={item} className="text-xs text-[#5a4e42] flex items-start gap-2">
                  <span className="text-[#3a342e] mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Google integrations */}
        <Card>
          <CardHeader
            title="Google Integrations"
            subtitle="Gmail · Calendar · Docs — coming soon"
          />
          <p className="text-[#9a8a78] text-sm leading-relaxed">
            OAuth 2.0 connections with read/write scopes will be configurable here. You&apos;ll be
            able to connect each service independently with fine-grained permission control.
          </p>
        </Card>
      </div>
    </div>
  );
}
