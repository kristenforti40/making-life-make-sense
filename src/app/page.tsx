"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";

type Suggestion = {
  id: string;
  text: string;
  type: string;
  destination: string;
  confidence: number;
  status: "pending" | "approved" | "edited" | "deleted" | "reclassified";
};

type Tone = "blue" | "green" | "teal" | "mint" | "tan";

const navGroups = [
  { title: "", items: ["Home", "Review", "Memory"] },
  { title: "Create", items: ["Writing", "Ideas", "Media"] },
  { title: "Practice", items: ["Daily", "Faith", "LSAT", "Fitness"] },
  { title: "People & Plans", items: ["Career", "People", "Calendar", "Integrations"] },
];

const priorities = [
  { title: "Review 5 AI suggestions", area: "Review", tone: "blue" as Tone },
  { title: "Outline excellence essay", area: "Writing", tone: "teal" as Tone },
  { title: "45 minute LR drill", area: "LSAT", tone: "green" as Tone },
];

const modules = [
  ["Capture", "One calm inbox for thoughts, links, photos, notes, workouts, and tasks."],
  ["Review", "AI extracts possible objects. You approve before anything files."],
  ["Memory", "Search across themes, repeats, people, writing, faith, and decisions."],
  ["Writing", "Fragments, outlines, questions, drafts, and essay angles."],
  ["Ideas", "Incubating ideas can stay ideas until they earn execution."],
  ["LSAT", "Study minutes, section type, accuracy, wrong answers, and flaw patterns."],
];

const insights = [
  "Excellence is recurring as a standards theme, not just a productivity theme.",
  "Beauty, truth, and reputation keep connecting to writing and career decisions.",
  "Separate urgent execution from slow-burn incubation. Both belong here.",
];

const dailyStandards = [
  "Quality is built by what you repeat when nobody is checking.",
  "The next clear action is usually kinder than the perfect plan.",
  "Let the system hold the noise so your attention can hold the work.",
  "A good standard should make action cleaner, not heavier.",
  "Capture first. Discern second. Execute only what deserves it.",
];

function classifyCapture(text: string): Suggestion[] {
  const t = text.toLowerCase();
  const suggestions: Suggestion[] = [];
  const add = (type: string, destination: string, body: string, confidence: number) => {
    suggestions.push({ id: `${Date.now()}-${suggestions.length}`, type, destination, text: body, confidence, status: "pending" });
  };
  if (t.includes("follow up") || t.includes("email") || t.includes("call")) add("person follow-up", "People", "Log the follow-up and preserve the relationship context.", 86);
  if (t.includes("lsat") || t.includes("logical reasoning") || t.includes("drill")) add("LSAT log", "LSAT", "Create an LSAT study note and flag any flaw-pattern language.", 91);
  if (t.includes("run") || t.includes("workout") || t.includes("marathon")) add("workout log", "Fitness", "File this as training context with energy and soreness notes.", 84);
  if (t.includes("verse") || t.includes("prayer") || t.includes("god") || t.includes("devotional")) add("devotional entry", "Faith", "Save the faith reflection and connect it to recurring themes.", 88);
  if (t.includes("essay") || t.includes("substack") || t.includes("write") || t.includes("beauty") || t.includes("truth")) add("writing fragment", "Writing", "Preserve this as a writing fragment and suggest an essay angle.", 90);
  if (t.includes("idea") || t.includes("business") || t.includes("product") || t.includes("system")) add("idea", "Ideas", "Store this as an idea without forcing it into a task.", 82);
  if (t.includes("tomorrow") || t.includes("deadline") || t.includes("schedule") || t.includes("block")) add("calendar option", "Calendar", "Suggest a calendar block or reminder for the time-sensitive part.", 78);
  if (!suggestions.length) add("raw thought", "Review", "Keep this in review until the destination is clear.", 64);
  return suggestions;
}

function themeVars(mode: "light" | "dark") {
  return {
    "--app-bg": mode === "light" ? "#f6f3ed" : "#111712",
    "--sidebar": mode === "light" ? "#fffdf8" : "#151c17",
    "--surface": mode === "light" ? "rgba(255,255,255,0.84)" : "rgba(27,35,30,0.9)",
    "--surface-strong": mode === "light" ? "#ffffff" : "#202922",
    "--subtle": mode === "light" ? "#faf7f1" : "#19221d",
    "--line-local": mode === "light" ? "#e5ddd1" : "#334138",
    "--text": mode === "light" ? "#171512" : "#dce5dc",
    "--muted-local": mode === "light" ? "#6f675c" : "#a1aca3",
    "--faint": mode === "light" ? "#948b80" : "#76847a",
  } as CSSProperties & Record<string, string>;
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-[var(--line-local)] bg-[var(--surface)] p-4 shadow-sm ${className}`}>{children}</section>;
}

function Badge({ children, tone = "blue" }: { children: ReactNode; tone?: Tone }) {
  const tones = {
    blue: "border-[#004CFF]/25 bg-[#004CFF]/10 text-[#004CFF]",
    green: "border-[#21A85B]/25 bg-[#21A85B]/10 text-[#157a42]",
    teal: "border-[#16C7C1]/25 bg-[#16C7C1]/12 text-[#0b7774]",
    mint: "border-[#76C893]/30 bg-[#76C893]/14 text-[#2d7d4e]",
    tan: "border-[#D6B98C]/40 bg-[#D6B98C]/20 text-[#755d35]",
  };
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${tones[tone]}`}>{children}</span>;
}

export default function HomePage() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [capture, setCapture] = useState("Substack idea: excellence is quality control over time. Follow up with Sarah and schedule a 45 minute LSAT drill tomorrow.");
  const [queue, setQueue] = useState<Suggestion[]>(() => classifyCapture(capture));
  const pending = useMemo(() => queue.filter((item) => item.status === "pending").length, [queue]);
  const dailyStandard = dailyStandards[new Date().getDay() % dailyStandards.length];

  function submitCapture() {
    if (!capture.trim()) return;
    setQueue((current) => [...classifyCapture(capture), ...current]);
    setCapture("");
  }

  function setStatus(id: string, status: Suggestion["status"]) {
    setQueue((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  return (
    <main style={themeVars(mode)} className="min-h-screen bg-[var(--app-bg)] text-[var(--text)] transition-colors">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-[var(--line-local)] bg-[var(--sidebar)] px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-4 lg:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#004CFF] text-sm font-black tracking-[-0.08em] text-white">KF</div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#004CFF]">Kristen Forti</p>
                <p className="text-sm font-semibold text-[var(--text)]">Excellent OS</p>
              </div>
            </div>
            <button
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
              title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
              className="grid h-7 w-7 place-items-center rounded-full border border-[var(--line-local)] bg-[var(--surface-strong)] text-[10px] font-bold text-[var(--muted-local)]"
            >
              {mode === "light" ? "D" : "L"}
            </button>
          </div>

          <nav className="mt-4 hidden gap-4 lg:grid">
            {navGroups.map((group) => (
              <div key={group.title || "primary"}>
                {group.title ? <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">{group.title}</p> : null}
                <div className="grid gap-0.5">
                  {group.items.map((item) => (
                    <a key={item} href="#" className={`rounded-lg px-2.5 py-1.5 text-sm ${item === "Home" ? "bg-[#004CFF] text-white" : "text-[var(--muted-local)] hover:bg-[var(--subtle)] hover:text-[var(--text)]"}`}>{item}</a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <section className="flex-1">
          <form onSubmit={(event) => { event.preventDefault(); submitCapture(); }} className="sticky top-0 z-10 border-b border-[var(--line-local)] bg-[var(--sidebar)]/92 px-4 py-3 backdrop-blur lg:px-6">
            <div className="mx-auto flex max-w-6xl gap-2 sm:items-center">
              <input value={capture} onChange={(event) => setCapture(event.target.value)} className="min-h-10 flex-1 rounded-lg border border-[var(--line-local)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--faint)]" aria-label="Capture" placeholder="" />
              <button className="rounded-lg bg-[#004CFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#003fd4]">Add</button>
            </div>
          </form>

          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
            <header className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Good morning, Kristen.</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-local)]">Start with what needs attention, then move into writing, memory, and the deeper vaults when you are ready.</p>
              </div>
              <Card className="bg-[var(--surface-strong)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#004CFF]">Daily Standard</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-local)]">{dailyStandard}</p>
              </Card>
            </header>

            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--faint)]">Review Queue</p><p className="mt-2 text-3xl font-semibold">{pending}</p><p className="text-sm text-[var(--muted-local)]">Suggestions waiting</p></Card>
              <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--faint)]">LSAT</p><p className="mt-2 text-3xl font-semibold">55m</p><p className="text-sm text-[var(--muted-local)]">Latest LR session</p></Card>
              <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--faint)]">Running</p><p className="mt-2 text-3xl font-semibold">7.3</p><p className="text-sm text-[var(--muted-local)]">Miles this week</p></Card>
              <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--faint)]">Streak</p><p className="mt-2 text-3xl font-semibold">4</p><p className="text-sm text-[var(--muted-local)]">Study days</p></Card>
              <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--faint)]">Writing</p><p className="mt-2 text-3xl font-semibold">3</p><p className="text-sm text-[var(--muted-local)]">Fragments ready</p></Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)]">
              <div className="space-y-6">
                <Card>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#004CFF]">Start Here</p><h2 className="text-lg font-semibold">Today needs your attention</h2></div>
                    <Badge tone="blue">3 priorities</Badge>
                  </div>
                  <div className="grid gap-3">
                    {priorities.map((priority) => (
                      <div key={priority.title} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--line-local)] bg-[var(--subtle)] p-3">
                        <div><p className="font-semibold">{priority.title}</p><p className="text-sm text-[var(--muted-local)]">{priority.area}</p></div>
                        <Badge tone={priority.tone}>{priority.area}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#004CFF]">Review</p><h2 className="text-lg font-semibold">AI suggestions, not auto-filing</h2></div>
                    <Badge tone="blue">Approve first</Badge>
                  </div>
                  <div className="grid gap-3">
                    {queue.slice(0, 5).map((item) => (
                      <div key={item.id} className="rounded-lg border border-[var(--line-local)] bg-[var(--subtle)] p-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div><Badge tone={item.status === "approved" ? "green" : "tan"}>{item.type}</Badge><p className="mt-2 font-semibold">{item.text}</p><p className="text-sm text-[var(--muted-local)]">Destination: {item.destination} - Confidence {item.confidence}%</p></div>
                          <Badge tone={item.status === "approved" ? "green" : item.status === "deleted" ? "tan" : "blue"}>{item.status}</Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button type="button" className="rounded-md bg-[#004CFF] px-3 py-2 text-xs font-semibold text-white" onClick={() => setStatus(item.id, "approved")}>Approve</button>
                          <button type="button" className="rounded-md bg-[#21A85B] px-3 py-2 text-xs font-semibold text-white" onClick={() => setStatus(item.id, "edited")}>Edit</button>
                          <button type="button" className="rounded-md border border-[var(--line-local)] bg-[var(--surface-strong)] px-3 py-2 text-xs font-semibold text-[var(--muted-local)]" onClick={() => setStatus(item.id, "deleted")}>Delete</button>
                          <button type="button" className="rounded-md border border-[#004CFF]/25 bg-[#004CFF]/10 px-3 py-2 text-xs font-semibold text-[#004CFF]" onClick={() => setStatus(item.id, "reclassified")}>Reclassify</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <aside className="space-y-6">
                <Card>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#004CFF]">Daily Brief</p>
                  <div className="mt-3 space-y-3">{insights.map((insight) => <p key={insight} className="rounded-lg border border-[var(--line-local)] bg-[var(--surface-strong)] p-3 text-sm leading-6 text-[var(--muted-local)]">{insight}</p>)}</div>
                </Card>
                <Card>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#21A85B]">System Map</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted-local)]">Temporary map for the MVP. Later these become live views with real counts, destinations, and actions.</p>
                  <div className="mt-3 grid gap-3">
                    {modules.map(([title, body], index) => <div key={title} className="rounded-lg border border-[var(--line-local)] bg-[var(--subtle)] p-3"><div className="flex items-center justify-between"><h3 className="font-semibold">{title}</h3><span className="text-xs font-semibold text-[var(--faint)]">0{index + 1}</span></div><p className="mt-1 text-sm leading-5 text-[var(--muted-local)]">{body}</p></div>)}
                  </div>
                </Card>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
