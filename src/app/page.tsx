"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

type View = "Home" | "Review" | "Memory" | "Writing" | "Ideas" | "Media" | "Daily" | "Faith" | "LSAT" | "Fitness" | "Career" | "People" | "Calendar" | "Integrations";
type Status = "pending" | "approved" | "edited" | "deleted" | "reclassified";
type Tone = "pink" | "green" | "teal" | "tan";

type Suggestion = {
  id: string;
  captureId: string;
  text: string;
  type: string;
  destination: string;
  confidence: number;
  status: Status;
};

type CaptureRecord = {
  id: string;
  text: string;
  createdAt: string;
  source: "quick capture";
  status: "review" | "filed";
};

type StoredOS = {
  captures: CaptureRecord[];
  queue: Suggestion[];
  updatedAt: string;
};

const navGroups: { title: string; items: View[] }[] = [
  { title: "", items: ["Home", "Review", "Memory"] },
  { title: "Create", items: ["Writing", "Ideas", "Media"] },
  { title: "Practice", items: ["Daily", "Faith", "LSAT", "Fitness"] },
  { title: "People & Plans", items: ["Career", "People", "Calendar", "Integrations"] },
];

const dailyStandards = [
  "Quality is built by what you repeat when nobody is checking.",
  "The next clear action is usually kinder than the perfect plan.",
  "Let the system hold the noise so your attention can hold the work.",
  "A good standard should make action cleaner, not heavier.",
  "Capture first. Discern second. Execute only what deserves it.",
];

const upcoming = [
  { label: "LSAT", text: "45 minute Logical Reasoning drill", time: "Today" },
  { label: "Writing", text: "Shape the excellence essay outline", time: "Later" },
  { label: "People", text: "Follow up with Sarah", time: "Tomorrow" },
];

const STORAGE_KEY = "kristens-excellent-os-v0.1";
const starterCapture = "Substack idea: excellence is quality control over time. Follow up with Sarah and schedule a 45 minute LSAT drill tomorrow.";

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function classifyCapture(captureRecord: CaptureRecord): Suggestion[] {
  const { id: captureId, text } = captureRecord;
  const t = text.toLowerCase();
  const suggestions: Suggestion[] = [];
  const add = (type: string, destination: string, body: string, confidence: number) => {
    suggestions.push({ id: makeId("suggestion"), captureId, type, destination, text: body, confidence, status: "pending" });
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

function createCapture(text: string): { captureRecord: CaptureRecord; suggestions: Suggestion[] } {
  const captureRecord: CaptureRecord = {
    id: makeId("capture"),
    text,
    createdAt: new Date().toISOString(),
    source: "quick capture",
    status: "review",
  };
  return { captureRecord, suggestions: classifyCapture(captureRecord) };
}

function themeVars(mode: "light" | "dark") {
  return {
    "--app-bg": mode === "light" ? "#f7f3ec" : "#111712",
    "--sidebar": mode === "light" ? "#fffdf8" : "#151c17",
    "--surface": mode === "light" ? "rgba(255,255,255,0.78)" : "rgba(27,35,30,0.9)",
    "--surface-strong": mode === "light" ? "#ffffff" : "#202922",
    "--subtle": mode === "light" ? "#fbf7ef" : "#19221d",
    "--line-local": mode === "light" ? "#e8ded0" : "#334138",
    "--text": mode === "light" ? "#171512" : "#dce5dc",
    "--muted-local": mode === "light" ? "#70685d" : "#a1aca3",
    "--faint": mode === "light" ? "#9a9186" : "#76847a",
  } as CSSProperties & Record<string, string>;
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-[var(--line-local)] bg-[var(--surface)] p-4 shadow-sm ${className}`}>{children}</section>;
}

function Badge({ children, tone = "pink" }: { children: ReactNode; tone?: Tone }) {
  const tones = {
    pink: "border-[#D94F8C]/25 bg-[#D94F8C]/10 text-[#D94F8C]",
    green: "border-[#21A85B]/25 bg-[#21A85B]/10 text-[#157a42]",
    teal: "border-[#16C7C1]/25 bg-[#16C7C1]/12 text-[#0b7774]",
    tan: "border-[#D6B98C]/40 bg-[#D6B98C]/20 text-[#755d35]",
  };
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${tones[tone]}`}>{children}</span>;
}

function MetricCard({ label, value, sub, tone = "pink" }: { label: string; value: string | number; sub: string; tone?: Tone }) {
  return (
    <Card className="min-h-28">
      <div className="flex h-full flex-col justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--faint)]">{label}</p>
        <div>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-sm text-[var(--muted-local)]">{sub}</p>
        </div>
        <div className={`h-1 w-10 rounded-full ${tone === "pink" ? "bg-[#D94F8C]" : tone === "green" ? "bg-[#21A85B]" : tone === "teal" ? "bg-[#16C7C1]" : "bg-[#D6B98C]"}`} />
      </div>
    </Card>
  );
}

export default function HomePage() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [activeView, setActiveView] = useState<View>("Home");
  const [capture, setCapture] = useState(starterCapture);
  const [captures, setCaptures] = useState<CaptureRecord[]>([]);
  const [queue, setQueue] = useState<Suggestion[]>([]);
  const [hasLoadedStore, setHasLoadedStore] = useState(false);
  const pending = useMemo(() => queue.filter((item) => item.status === "pending").length, [queue]);
  const approved = useMemo(() => queue.filter((item) => item.status === "approved").length, [queue]);
  const dailyStandard = dailyStandards[new Date().getDay() % dailyStandards.length];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StoredOS;
        setCaptures(parsed.captures ?? []);
        setQueue(parsed.queue ?? []);
        setHasLoadedStore(true);
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    const seed = createCapture(starterCapture);
    setCaptures([seed.captureRecord]);
    setQueue(seed.suggestions);
    setHasLoadedStore(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStore) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ captures, queue, updatedAt: new Date().toISOString() } satisfies StoredOS));
  }, [captures, hasLoadedStore, queue]);

  function submitCapture() {
    if (!capture.trim()) return;
    const next = createCapture(capture);
    setCaptures((current) => [next.captureRecord, ...current]);
    setQueue((current) => [...next.suggestions, ...current]);
    setCapture("");
    setActiveView("Review");
  }

  function setStatus(id: string, status: Status) {
    setQueue((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  return (
    <main style={themeVars(mode)} className="min-h-screen bg-[var(--app-bg)] text-[var(--text)] transition-colors">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-[var(--line-local)] bg-[var(--sidebar)] px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-56 lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setActiveView("Home")} className="flex items-center gap-3 text-left">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#D94F8C] text-sm font-black tracking-[-0.08em] text-white">KF</div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D94F8C]">Kristen Forti</p>
                <p className="text-sm font-semibold text-[var(--text)]">Excellent OS</p>
              </div>
            </button>
            <button onClick={() => setMode(mode === "light" ? "dark" : "light")} title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"} className="grid h-7 w-7 place-items-center rounded-full border border-[var(--line-local)] bg-[var(--surface-strong)] text-[10px] font-bold text-[var(--muted-local)]">
              {mode === "light" ? "D" : "L"}
            </button>
          </div>

          <nav className="mt-5 hidden gap-4 lg:grid">
            {navGroups.map((group) => (
              <div key={group.title || "primary"}>
                {group.title ? <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">{group.title}</p> : null}
                <div className="grid gap-0.5">
                  {group.items.map((item) => (
                    <button key={item} onClick={() => setActiveView(item)} className={`rounded-lg px-2.5 py-1.5 text-left text-sm ${activeView === item ? "bg-[#D94F8C] text-white" : "text-[var(--muted-local)] hover:bg-[var(--subtle)] hover:text-[var(--text)]"}`}>{item}</button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <section className="flex-1">
          <form onSubmit={(event) => { event.preventDefault(); submitCapture(); }} className="sticky top-0 z-10 border-b border-[var(--line-local)] bg-[var(--sidebar)]/92 px-4 py-3 backdrop-blur lg:px-6">
            <div className="mx-auto flex max-w-5xl gap-2 sm:items-center">
              <input value={capture} onChange={(event) => setCapture(event.target.value)} className="min-h-10 flex-1 rounded-lg border border-[var(--line-local)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--faint)]" aria-label="Capture" placeholder="Capture a thought, note, task, link, or idea" />
              <button className="rounded-lg bg-[#D94F8C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C63D79]">Add</button>
            </div>
          </form>

          <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
            {activeView === "Home" ? (
              <div className="space-y-5">
                <header className="grid gap-4 lg:grid-cols-[1fr_300px] lg:items-end">
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Good morning, Kristen.</h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-local)]">A quieter overview: capture what arrives, review what is waiting, and see the few things that matter today.</p>
                  </div>
                  <Card className="bg-[var(--surface-strong)]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D94F8C]">Daily Standard</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted-local)]">{dailyStandard}</p>
                  </Card>
                </header>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  <MetricCard label="Review" value={pending} sub="Suggestions waiting" />
                  <MetricCard label="Captures" value={captures.length} sub="Saved locally" tone="tan" />
                  <MetricCard label="LSAT" value="55m" sub="Latest session" tone="green" />
                  <MetricCard label="Streak" value="4" sub="Study days" tone="teal" />
                  <MetricCard label="Running" value="7.3" sub="Miles this week" tone="green" />
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <Card className="bg-[var(--surface-strong)]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge>Start Here</Badge>
                        <h2 className="mt-3 text-xl font-semibold">Review is the next clean step.</h2>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted-local)]">There are {pending} extracted items waiting. Nothing gets filed until you approve it.</p>
                      </div>
                      <button onClick={() => setActiveView("Review")} className="rounded-lg bg-[#D94F8C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C63D79]">Open</button>
                    </div>
                  </Card>

                  <Card>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">Coming Up</p>
                    <div className="mt-3 space-y-3">
                      {upcoming.map((item) => (
                        <div key={item.text} className="flex items-start justify-between gap-3 border-t border-[var(--line-local)] pt-3 first:border-t-0 first:pt-0">
                          <div>
                            <p className="font-semibold">{item.text}</p>
                            <p className="text-sm text-[var(--muted-local)]">{item.label}</p>
                          </div>
                          <span className="text-xs font-semibold text-[var(--faint)]">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <Card>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">Recent Captures</p>
                      <h2 className="mt-1 text-lg font-semibold">What you just put into the system</h2>
                    </div>
                    <Badge tone="tan">Local v0.1</Badge>
                  </div>
                  <div className="mt-4 grid gap-3 lg:grid-cols-3">
                    {captures.slice(0, 3).map((item) => (
                      <div key={item.id} className="rounded-lg border border-[var(--line-local)] bg-[var(--subtle)] p-3">
                        <p className="text-sm leading-6 text-[var(--muted-local)]">{item.text}</p>
                        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--faint)]">Saved to review</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : activeView === "Review" ? (
              <div className="space-y-5">
                <header className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <Badge>Review</Badge>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight">Start here.</h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-local)]">Approve, edit, delete, or reclassify what AI found. This is where chaos becomes usable.</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge>{pending} pending</Badge>
                    <Badge tone="green">{approved} approved</Badge>
                  </div>
                </header>

                <div className="grid gap-3">
                  {queue.map((item) => (
                    <Card key={item.id} className="bg-[var(--surface-strong)]">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <Badge tone={item.status === "approved" ? "green" : "tan"}>{item.type}</Badge>
                          <p className="mt-3 font-semibold">{item.text}</p>
                          <p className="text-sm text-[var(--muted-local)]">Destination: {item.destination} - Confidence {item.confidence}%</p>
                        </div>
                        <Badge tone={item.status === "approved" ? "green" : item.status === "deleted" ? "tan" : "pink"}>{item.status}</Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button type="button" className="rounded-md bg-[#D94F8C] px-3 py-2 text-xs font-semibold text-white" onClick={() => setStatus(item.id, "approved")}>Approve</button>
                        <button type="button" className="rounded-md bg-[#21A85B] px-3 py-2 text-xs font-semibold text-white" onClick={() => setStatus(item.id, "edited")}>Edit</button>
                        <button type="button" className="rounded-md border border-[var(--line-local)] bg-[var(--subtle)] px-3 py-2 text-xs font-semibold text-[var(--muted-local)]" onClick={() => setStatus(item.id, "deleted")}>Delete</button>
                        <button type="button" className="rounded-md border border-[#D94F8C]/25 bg-[#D94F8C]/10 px-3 py-2 text-xs font-semibold text-[#D94F8C]" onClick={() => setStatus(item.id, "reclassified")}>Reclassify</button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="bg-[var(--surface-strong)]">
                <Badge>{activeView}</Badge>
                <h1 className="mt-3 text-2xl font-semibold">This workspace comes next.</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-local)]">For now, Home stays clean and Review is functional. This module will become its own focused view as we add Supabase, Google Docs, Calendar, and real AI extraction.</p>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
