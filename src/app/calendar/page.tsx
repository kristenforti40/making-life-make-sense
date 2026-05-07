import { Card } from '@/components/ui/Card';
import { Calendar, Lock } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#e8dcc8]">Calendar</h1>
        <p className="text-[#9a8a78] text-sm mt-1">Coming soon — Google Calendar integration</p>
      </div>

      <Card className="flex flex-col items-center text-center py-12 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#2a2420] flex items-center justify-center">
          <Calendar size={24} className="text-[#c4855a]" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-[#e8dcc8] font-semibold mb-1">Google Calendar</h2>
          <p className="text-[#9a8a78] text-sm max-w-sm leading-relaxed">
            This section will connect to your Google Calendar via OAuth 2.0, letting you view
            upcoming events, create new ones, and see your schedule alongside your Life OS.
          </p>
        </div>
        <div className="bg-[#1e1b17] border border-[#2a2420] rounded-xl p-4 text-left w-full max-w-sm">
          <p className="text-[11px] text-[#9a8a78] uppercase tracking-widest font-medium mb-3 flex items-center gap-1.5">
            <Lock size={10} /> Planned integration
          </p>
          <ul className="flex flex-col gap-2">
            {[
              'OAuth 2.0 sign-in with Google',
              'Read upcoming events (next 7 days)',
              'Create / edit events',
              'Color-coded event categories',
              'Smart scheduling suggestions',
            ].map((item) => (
              <li key={item} className="text-xs text-[#5a4e42] flex items-start gap-2">
                <span className="text-[#3a342e] mt-0.5">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
