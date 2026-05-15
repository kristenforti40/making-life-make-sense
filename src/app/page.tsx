"use client";

import { useMemo, useState } from "react";

type Suggestion = {
  id: string;
  text: string;
  type: string;
  destination: string;
  confidence: number;
  status: "pending" | "approved" | "edited" | "deleted" | "reclassified";
};

const priorities = ["Send application follow-up", "Review wrong answer journal", "Outline excellence essay"];
const insights = [
  "You have mentioned excellence 12 times, usually beside reputation, quality, and discipline.",
  "Your accuracy appears to drop most on abstract causal reasoning.",
  "The beauty/truth/reputation cluster could become a Substack essay this week.",
];
const modules = [
  ["Memory", "Ask my brain, semantic search, recurring themes, and connections."],
  ["Writing Atelier", "Fragments, drafts, quotes, outlines, and AI essay angles."],
  ["Idea Vault", "Raw, incubating, promising, execute-now, and archived ideas."],
  ["Media Vault", "Podcasts, books, articles, videos, quotes, sermons, and links."],
  ["Daily Log", "Wake time, LSAT, devotional, workouts, mood, energy, focus."],
  ["Devotional", "Verse, prayer list, spiritual themes, and related writing ideas."],
  ["LSAT", "Sessions, accuracy, wrong answer journal, and flaw patterns."],
  ["Fitness", "Runs, workouts, marathon goal, mileage, soreness, and energy."],
  ["Career", "Applications, firms, schools, deadlines, resumes, and prep."],
  ["People", "Contacts, cadence, overdue follow-ups, and prayer connections."],
  ["Calendar", "Mock time blocks and future Google Calendar sync."],
  ["Integrations", "Google, Gmail, Docs, Photos, OpenAI, Plaid, PWA, and voice."],
];

function classifyCapture(text: string): Suggestion[] {
  const t = text.toLowerCase();
  const suggestions: Suggestion[] = [];
  const add = (type: string, destination: string, body: string, confidence: number) => {
    suggestions.push({ id: `${Date.now()}-${suggestions.length}`, type, destination, text: body, confidence, status: "pending" });
  };
  if (t.includes("follow up") || t.includes("email") || t.includes("call")) add("person_follow_up", "People", "Log the follow-up and preserve the relationship context.", 86);
  if (t.includes("lsat") || t.includes("logical reasoning") || t.includes("drill")) add("lsat_log", "LSAT", "Create an LSAT study note and flag any flaw-pattern language.", 91);
  if (t.includes("run") || t.includes("workout") || t.includes("marathon")) add("workout_log", "Fitness", "File this as training context with energy and soreness notes.", 84);
  if (t.includes("verse") || t.includes("prayer") || t.includes("god") || t.includes("devotional")) add("devotional_entry", "Devotional", "Save the faith reflection and connect it to recurring themes.", 88);
  if (t.includes("essay") || t.includes("substack") || t.includes("write") || t.includes("beauty") || t.includes("truth")) add("writing_fragment", "Writing Atelier", "Preserve this as a writing fragment and suggest an essay angle.", 90);
  if (t.includes("idea") || t.includes("business") || t.includes("product") || t.includes("system")) add("idea", "Idea Vault", "Store this as an idea without forcing it into a task.", 82);
  if (t.includes("tomorrow") || t.includes("deadline") || t.includes("schedule") || t.includes("block")) add("calendar_event", "Calendar", "Suggest a calendar block or reminder for the time-sensitive part.", 78);
  if (!suggestions.length) {
    add("idea", "Idea Vault", "Keep as a raw idea for later review.", 66);
    add("task", "Review Later", "Ask whether this belongs in writing, projects, or daily reflection.", 54);
  }
  return suggestions;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-[var(--line)] bg-white/85 p-4 shadow-sm ${className}`}>{children}</section>;
}

function Badge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "turquoise" | "rose" | "burgundy" | "tan" }) {
  const tones = {
    blue: "border-[#004CFF]/25 bg-[#004CFF]/10 text-[#004CFF]",
    green: "border-[#21A85B]/25 bg-[#21A85B]/10 text-[#14743d]",
    turquoise: "border-[#16C7C1]/25 bg-[#16C7C1]/10 text-[#0b7774]",
    rose: "border-[#F4B7C6]/45 bg-[#F4B7C6]/28 text-[#8b3150]",
    burgundy: "border-[#7B0F2E]/25 bg-[#7B0F2E]/10 text-[#7B0F2E]",
    tan: "border-[#D6B98C]/40 bg-[#D6B98C]/20 text-[#6f5730]",
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export default function HomePage() {
  const [capture, setCapture] = useState("Substack idea: excellence is quality control over time. Follow up with Sarah and schedule a 45 minute LSAT drill tomorrow.");
  const [queue, setQueue] = useState<Suggestion[]>(() => classifyCapture(capture));
  const pending = useMemo(() => queue.filter((item) => item.status === "pending").length, [queue]);

  function submitCapture() {
    if (!capture.trim()) return;
    setQueue((current) => [...classifyCapture(capture), ...current]);
    setCapture("");
  }

  function setStatus(id: string, status: Suggestion["status"]) {
    setQueue((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-[var(--line)] pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-[#004CFF] text-lg font-black tracking-[-0.08em] text-white">KF</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#004CFF]">Kristen Forti</p>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">Kristen's Excellent OS</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Home", "Capture", "Review", "Memory", "Writing", "Ideas", "LSAT", "Career"].map((item) => <Badge key={item} tone="blue">{item}</Badge>)}
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="border-[#004CFF]/25 bg-white">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#004CFF]">Universal Capture</p>
              <h2 className="mt-2 text-2xl font-semibold">Dump first. Sort later.</h2>
              <textarea className="field mt-4 min-h-36" value={capture} onChange={(event) => setCapture(event.target.value)} placeholder="Dump a thought, task, devotional note, LSAT pattern, workout, media link, or writing fragment." />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button onClick={submitCapture} className="rounded-md border border-[#004CFF] bg-[#004CFF] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#003fd4]">Submit to AI review</button>
                <span className="text-sm text-[var(--muted)]">Mock AI extracts suggestions. Nothing files without approval.</span>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Review queue</p><p className="mt-2 text-3xl font-semibold">{pending}</p><p className="text-sm text-[var(--muted)]">AI suggestions pending</p></Card>
              <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">LSAT</p><p className="mt-2 text-3xl font-semibold">55m</p><p className="text-sm text-[var(--muted)]">Latest LR session</p></Card>
              <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Mileage</p><p className="mt-2 text-3xl font-semibold">7.3</p><p className="text-sm text-[var(--muted)]">Weekly running</p></Card>
              <Card><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Writing</p><p className="mt-2 text-3xl font-semibold">3</p><p className="text-sm text-[var(--muted)]">Fragments ready</p></Card>
            </div>

            <Card>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7B0F2E]">Today's top 3 priorities</p>
              <div className="mt-3 grid gap-3">
                {priorities.map((priority) => <div key={priority} className="flex items-center justify-between gap-3 rounded-md border border-[var(--line)] bg-[#FAF7F1] p-3"><span className="font-semibold">{priority}</span><Badge tone="burgundy">execute</Badge></div>)}
              </div>
            </Card>

            <Card>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#004CFF]">AI Review Queue</p>
              <div className="mt-3 grid gap-3">
                {queue.map((item) => (
                  <div key={item.id} className="rounded-md border border-[var(--line)] bg-[#FAF7F1] p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div><Badge tone={item.status === "approved" ? "green" : "tan"}>{item.type}</Badge><p className="mt-2 font-semibold">{item.text}</p><p className="text-sm text-[var(--muted)]">Destination: {item.destination} - Confidence {item.confidence}%</p></div>
                      <Badge tone={item.status === "approved" ? "green" : "blue"}>{item.status}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="rounded-md bg-[#004CFF] px-3 py-2 text-xs font-semibold text-white" onClick={() => setStatus(item.id, "approved")}>Approve</button>
                      <button className="rounded-md bg-[#21A85B] px-3 py-2 text-xs font-semibold text-white" onClick={() => setStatus(item.id, "edited")}>Edit</button>
                      <button className="rounded-md bg-[#7B0F2E] px-3 py-2 text-xs font-semibold text-white" onClick={() => setStatus(item.id, "deleted")}>Delete</button>
                      <button className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-xs font-semibold" onClick={() => setStatus(item.id, "reclassified")}>Reclassify</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#16C7C1]">AI Insights</p>
              <div className="mt-3 space-y-3">{insights.map((insight) => <p key={insight} className="rounded-md border border-[var(--line)] bg-white p-3 text-sm leading-6 text-[var(--muted)]">{insight}</p>)}</div>
            </Card>
            <Card>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#21A85B]">Memory patterns</p>
              <div className="mt-3 grid gap-2"><Badge tone="blue">Excellence 12x</Badge><Badge tone="turquoise">Beauty and truth 7x</Badge><Badge tone="rose">Disciplined warmth 5x</Badge></div>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              {modules.map(([title, body]) => <Card key={title}><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">{title}</h3><Badge tone="tan">mock</Badge></div><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p></Card>)}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
