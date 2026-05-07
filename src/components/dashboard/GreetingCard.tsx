'use client';

export default function GreetingCard() {
  const hour = new Date().getHours();
  const timeOfDay =
    hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';

  const taglines: Record<string, string> = {
    morning: 'What will you build today?',
    afternoon: 'Keep the momentum going.',
    evening: 'Reflect and wrap up with intention.',
    night: 'Rest is part of the work.',
  };

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-[#e8dcc8] tracking-tight">
        Good{' '}
        <span className="font-serif-accent text-[#c4855a]">{timeOfDay}</span>
      </h1>
      <p className="text-[#9a8a78] text-sm mt-1">{taglines[timeOfDay]}</p>
    </div>
  );
}
