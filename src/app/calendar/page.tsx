"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Circle, Clock, LayoutGrid, ListChecks, Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

type Tone = "pink" | "mint" | "aqua" | "butter" | "rose" | "ink";
type ViewMode = "month" | "week" | "day" | "year";
type LayoutMode = "poster" | "planner" | "agenda";
type CalendarEvent = { id: string; title: string; day: number; endDay?: number; time: string; area: string; tone: Tone; status?: "done" | "planned" | "review" };

const toneStyles: Record<Tone, { chip: string; dot: string; wash: string; text: string }> = {
  pink: { chip: "border-[#eab4c9] bg-[#fff0f6] text-[#b83272]", dot: "bg-[#d94f8c]", wash: "bg-[#fff0f6]", text: "text-[#b83272]" },
  mint: { chip: "border-[#b8dfc5] bg-[#eefbf1] text-[#1a7d46]", dot: "bg-[#21a85b]", wash: "bg-[#effaf2]", text: "text-[#157a42]" },
  aqua: { chip: "border-[#ace7e4] bg-[#effdfc] text-[#087673]", dot: "bg-[#16c7c1]", wash: "bg-[#effdfc]", text: "text-[#087673]" },
  butter: { chip: "border-[#ead9a8] bg-[#fff9df] text-[#806625]", dot: "bg-[#d6b98c]", wash: "bg-[#fff8df]", text: "text-[#806625]" },
  rose: { chip: "border-[#efbecb] bg-[#fff2f4] text-[#9d3351]", dot: "bg-[#f4b7c6]", wash: "bg-[#fff2f4]", text: "text-[#9d3351]" },
  ink: { chip: "border-[#d8d2c7] bg-[#f8f4ec] text-[#50483d]", dot: "bg-[#746c60]", wash: "bg-[#f8f4ec]", text: "text-[#50483d]" },
};

const events: CalendarEvent[] = [
  { id: "review", title: "Review yesterday", day: 4, time: "9:00", area: "Review", tone: "pink", status: "planned" },
  { id: "lsat", title: "LSAT: 1 RC + 10 LR", day: 5, endDay: 6, time: "11:00", area: "LSAT", tone: "mint", status: "planned" },
  { id: "write", title: "Writing sprint", day: 7, time: "2:00", area: "Writing", tone: "aqua" },
  { id: "run", title: "Run + stretch", day: 8, time: "6:00", area: "Fitness", tone: "butter", status: "done" },
  { id: "career", title: "Career follow-up", day: 11, time: "10:30", area: "Career", tone: "rose" },
  { id: "pack", title: "Pack list", day: 13, time: "4:00", area: "Life", tone: "butter" },
  { id: "substack", title: "Substack outline", day: 15, endDay: 16, time: "1:00", area: "Writing", tone: "pink" },
  { id: "daily", title: "Bible + supplements", day: 17, time: "8:30", area: "Daily", tone: "mint", status: "done" },
  { id: "ai-review", title: "AI review block", day: 17, time: "10:00", area: "Review", tone: "aqua", status: "review" },
  { id: "ride", title: "Ride", day: 18, time: "5:30", area: "Fitness", tone: "butter" },
  { id: "apps", title: "Application notes", day: 20, time: "3:00", area: "Career", tone: "rose" },
  { id: "reset", title: "Weekly reset", day: 24, time: "7:00", area: "Plan", tone: "aqua" },
];

const moodMonths = [
  { month: "Jan", days: 18 }, { month: "Feb", days: 21 }, { month: "Mar", days: 24 }, { month: "Apr", days: 20 },
  { month: "May", days: 17 }, { month: "Jun", days: 22 }, { month: "Jul", days: 25 }, { month: "Aug", days: 19 },
  { month: "Sep", days: 23 }, { month: "Oct", days: 21 }, { month: "Nov", days: 12 }, { month: "Dec", days: 8 },
];

function Chip({ children, tone = "pink" }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold ${toneStyles[tone].chip}`}>{children}</span>;
}

function ControlButton({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition hover:-translate-y-0.5 ${
        active ? "border-[#d94f8c] bg-[#d94f8c] text-white shadow-sm" : "border-[#eadfd0] bg-white/72 text-[#73675b] hover:text-[#201a16]"
      }`}
    >
      {children}
    </button>
  );
}

function eventForDay(day: number) {
  return events.filter((event) => event.day === day || event.endDay === day);
}

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("poster");
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const activeDate = useMemo(() => new Date(today.getFullYear(), today.getMonth() + monthOffset, 1), [monthOffset, today]);
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();
  const monthName = activeDate.toLocaleString("default", { month: "long" });
  const monthShort = activeDate.toLocaleString("default", { month: "short" }).toUpperCase();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const selectedDay = today.getMonth() === month && today.getFullYear() === year ? today.getDate() : 17;
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - startDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
  const weekDays = Array.from({ length: 7 }, (_, index) => Math.min(daysInMonth, Math.max(1, selectedDay - 3 + index)));
  const dayAgenda = eventForDay(selectedDay).length ? eventForDay(selectedDay) : events.slice(0, 4);
  const pageTint = layoutMode === "poster" ? "from-[#fff7ef] via-[#f8f4ec] to-[#e8f8f5]" : layoutMode === "planner" ? "from-[#eefbf7] via-[#fbf8f1] to-[#fff0f6]" : "from-[#fbf8ff] via-[#fffaf3] to-[#eefbf1]";

  return (
    <div className={`min-h-[calc(100vh-3rem)] rounded-[34px] border border-[#e8dccd] bg-gradient-to-br ${pageTint} p-4 shadow-[0_24px_70px_rgba(74,55,34,0.10)] sm:p-6`}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Chip tone="butter"><CalendarDays className="h-3.5 w-3.5" />Calendar</Chip>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#201a16] sm:text-5xl">Make time visible.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#73675b]">A softer, more playful calendar shell with month, week, day, and year views. Google Calendar sync can plug into this structure later.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous month" onClick={() => setMonthOffset((value) => value - 1)} className="grid h-11 w-11 place-items-center rounded-full border border-[#e8dccd] bg-white/78 text-[#73675b] shadow-sm"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" aria-label="Next month" onClick={() => setMonthOffset((value) => value + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-[#e8dccd] bg-white/78 text-[#73675b] shadow-sm"><ChevronRight className="h-4 w-4" /></button>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-[#d94f8c] text-white shadow-lg shadow-pink-200/80"><Plus className="h-4 w-4" /></button>
        </div>
      </header>

      <section className="mt-6 overflow-hidden rounded-[32px] border border-[#e8dccd] bg-white/62 shadow-sm backdrop-blur">
        <div className="border-b border-[#e8dccd] bg-white/54 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-[22px] bg-[#f9c9dc] text-sm font-black text-[#b83272]">{monthShort.slice(0, 3)}</div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9b9084]">My calendar</p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#201a16]">{monthName} {year}</h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <ControlButton active={viewMode === "month"} onClick={() => setViewMode("month")}><LayoutGrid className="h-3.5 w-3.5" />Month</ControlButton>
              <ControlButton active={viewMode === "week"} onClick={() => setViewMode("week")}><CalendarDays className="h-3.5 w-3.5" />Week</ControlButton>
              <ControlButton active={viewMode === "day"} onClick={() => setViewMode("day")}><ListChecks className="h-3.5 w-3.5" />Day</ControlButton>
              <ControlButton active={viewMode === "year"} onClick={() => setViewMode("year")}><Circle className="h-3.5 w-3.5" />Year</ControlButton>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["poster", "planner", "agenda"] as LayoutMode[]).map((layout) => (
              <button key={layout} type="button" onClick={() => setLayoutMode(layout)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${layoutMode === layout ? "border-[#16c7c1] bg-[#effdfc] text-[#087673]" : "border-[#e8dccd] bg-white/60 text-[#73675b]"}`}>
                {layout}
              </button>
            ))}
          </div>
        </div>

        {viewMode === "month" ? (
          <div className="grid lg:grid-cols-[180px_1fr]">
            <div className="relative hidden min-h-[620px] overflow-hidden bg-[#9fd8d2] lg:block">
              <div className="absolute -left-8 top-24 rotate-[-90deg] text-7xl font-black tracking-tight text-white/90">{monthShort}</div>
              <div className="absolute bottom-8 left-7 right-7 rounded-[30px] bg-white/32 p-4 text-sm font-semibold leading-5 text-[#315a57] backdrop-blur">
                Review blocks, writing time, LSAT, workouts, daily data, and real life.
              </div>
              <div className="absolute right-8 top-10 h-24 w-24 rounded-full bg-white/25" />
              <div className="absolute bottom-44 left-10 h-14 w-32 rounded-full bg-[#6fc8bd]/55" />
            </div>
            <div className="p-3 sm:p-5">
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#9b9084] sm:text-[11px]">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day}>{day}</div>)}
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-2">
                {cells.map((day, index) => {
                  const dayEvents = day ? eventForDay(day).slice(0, 3) : [];
                  const isToday = day === selectedDay;
                  return (
                    <button key={`${day ?? "empty"}-${index}`} type="button" className={`min-h-24 rounded-[18px] border p-1.5 text-left transition hover:-translate-y-0.5 sm:min-h-28 sm:p-2 ${day ? "border-[#e8dccd] bg-white/72 shadow-sm" : "border-transparent bg-white/22"} ${isToday ? "ring-2 ring-[#d94f8c]" : ""}`}>
                      <span className={`text-xs font-semibold sm:text-sm ${isToday ? "grid h-7 w-7 place-items-center rounded-full bg-[#d94f8c] text-white" : "text-[#201a16]"}`}>{day}</span>
                      <div className="mt-2 space-y-1">
                        {dayEvents.map((event) => <div key={event.id} className={`truncate rounded-full border px-2 py-1 text-[9px] font-semibold sm:text-[10px] ${toneStyles[event.tone].chip}`}>{event.title}</div>)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {viewMode === "week" ? (
          <div className="grid gap-3 p-4 md:grid-cols-7">
            {weekDays.map((day, index) => {
              const dayEvents = eventForDay(day);
              return (
                <div key={`${day}-${index}`} className="min-h-80 rounded-[26px] border border-[#e8dccd] bg-white/72 p-3 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b9084]">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index]}</p>
                  <p className={`mt-2 text-3xl font-semibold ${day === selectedDay ? "text-[#d94f8c]" : "text-[#201a16]"}`}>{day}</p>
                  <div className="mt-4 space-y-2">
                    {(dayEvents.length ? dayEvents : events.slice(index, index + 1)).map((event) => <div key={`${day}-${event.id}`} className={`rounded-[18px] border p-3 text-left ${toneStyles[event.tone].chip}`}>
                      <p className="text-sm font-semibold leading-4">{event.title}</p>
                      <p className="mt-1 text-[11px] opacity-75">{event.time} - {event.area}</p>
                    </div>)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {viewMode === "day" ? (
          <div className="grid gap-6 p-4 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="rounded-[32px] border border-[#e8dccd] bg-white/72 p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9b9084]">Selected day</p>
              <p className="mt-3 text-7xl font-semibold tracking-tight text-[#d94f8c]">{selectedDay}</p>
              <p className="mt-2 text-xl font-semibold text-[#201a16]">{monthName} {year}</p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <Chip tone="pink">review</Chip>
                <Chip tone="mint">lsat</Chip>
                <Chip tone="aqua">writing</Chip>
                <Chip tone="butter">body</Chip>
              </div>
            </div>
            <div className="space-y-3">
              {dayAgenda.map((event, index) => (
                <div key={event.id} className="grid grid-cols-[72px_1fr] gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-[#9b9084]">{event.time}</span>
                    <span className={`mt-2 h-full min-h-20 w-1 rounded-full ${toneStyles[event.tone].dot}`} />
                  </div>
                  <div className={`rounded-[26px] border p-5 shadow-sm ${toneStyles[event.tone].chip}`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg font-semibold leading-6">{event.title}</p>
                      <Clock className="h-4 w-4 opacity-70" />
                    </div>
                    <p className="mt-2 text-sm opacity-75">{event.area} - {event.status ?? (index === 0 ? "planned" : "open")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {viewMode === "year" ? (
          <div className="grid gap-5 p-4 md:grid-cols-2 xl:grid-cols-3">
            {moodMonths.map((monthItem, monthIndex) => (
              <div key={monthItem.month} className="rounded-[28px] border border-[#e8dccd] bg-white/70 p-4 shadow-sm">
                <h3 className="text-2xl font-semibold text-[#201a16]">{monthItem.month}</h3>
                <div className="mt-4 grid grid-cols-7 gap-1.5">
                  {Array.from({ length: monthItem.days }, (_, index) => {
                    const tones: Tone[] = ["mint", "pink", "aqua", "butter", "rose", "ink"];
                    const tone = tones[(index + monthIndex) % tones.length];
                    return <span key={index} title={`${monthItem.month} ${index + 1}`} className={`grid h-7 w-7 place-items-center rounded-full text-[9px] font-semibold ${toneStyles[tone].chip}`}>{index % 5 === 0 ? index + 1 : ""}</span>;
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-[26px] border border-[#e8dccd] bg-white/60 p-4">
          <Chip tone="pink"><Sparkles className="h-3.5 w-3.5" />AI Suggestion</Chip>
          <p className="mt-3 text-sm leading-6 text-[#73675b]">Schedule a 15-minute review before planning tomorrow.</p>
        </div>
        <div className="rounded-[26px] border border-[#e8dccd] bg-white/60 p-4">
          <Chip tone="mint">Google Calendar</Chip>
          <p className="mt-3 text-sm leading-6 text-[#73675b]">Future sync target: approved plan blocks become real events.</p>
        </div>
        <div className="rounded-[26px] border border-[#e8dccd] bg-white/60 p-4">
          <Chip tone="aqua">Views</Chip>
          <p className="mt-3 text-sm leading-6 text-[#73675b]">Month for shape, week for load, day for execution, year for patterns.</p>
        </div>
      </div>
    </div>
  );
}
