"use client";

import {
  Archive,
  BookOpen,
  CalendarDays,
  Check,
  Circle,
  Dumbbell,
  Feather,
  FileText,
  FolderOpen,
  Heart,
  Home,
  Inbox,
  Lightbulb,
  Moon,
  PenLine,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

type View = "Home" | "Review" | "Plan" | "Writing" | "Ideas" | "Media" | "Daily" | "Faith" | "Career" | "LSAT" | "Fitness" | "People" | "Calendar" | "Memory" | "Integrations";
type Status = "pending" | "approved" | "edited" | "deleted" | "reclassified";
type Tone = "pink" | "mint" | "aqua" | "butter" | "rose" | "ink";
type NavGroup = "Start" | "Create" | "Practice" | "Becoming" | "World";
type Suggestion = { id: string; captureId: string; text: string; type: string; destination: string; confidence: number; status: Status };
type CaptureRecord = { id: string; text: string; createdAt: string; source: "quick capture"; status: "review" | "filed" };
type StoredOS = { captures: CaptureRecord[]; queue: Suggestion[]; updatedAt: string };
type SyncState = "loading" | "local" | "supabase" | "supabase-error";
type SupabaseError = { phase?: string; message?: string; status?: number; detail?: string };
type NavItem = { view: View; label: string; icon: LucideIcon; tone: Tone; group: NavGroup };

const STORAGE_KEY = "kristens-excellent-os-v0.1";
const DEVICE_KEY = "kristens-excellent-os-device";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const starterCapture = "Tomorrow todo: LSAT 1 RC and 10 LR. Sleep in. Pack skirt, tennis shoes, and sandals. Ride if there is time.";

const toneStyles: Record<Tone, { chip: string; fill: string; strip: string; text: string; soft: string; dot: string }> = {
  pink: { chip: "border-[#eab4c9] bg-[#fff0f6] text-[#b83272]", fill: "bg-[#f9c9dc]", strip: "from-[#f8b8d0] to-[#e45f9a]", text: "text-[#b83272]", soft: "bg-[#fff0f6]", dot: "bg-[#d94f8c]" },
  mint: { chip: "border-[#b8dfc5] bg-[#eefbf1] text-[#1a7d46]", fill: "bg-[#bdecc9]", strip: "from-[#c7efd0] to-[#21a85b]", text: "text-[#157a42]", soft: "bg-[#effaf2]", dot: "bg-[#21a85b]" },
  aqua: { chip: "border-[#ace7e4] bg-[#effdfc] text-[#087673]", fill: "bg-[#bdecea]", strip: "from-[#c8f3f1] to-[#16c7c1]", text: "text-[#087673]", soft: "bg-[#effdfc]", dot: "bg-[#16c7c1]" },
  butter: { chip: "border-[#ead9a8] bg-[#fff9df] text-[#806625]", fill: "bg-[#f3e6a7]", strip: "from-[#fbefb5] to-[#d6b98c]", text: "text-[#806625]", soft: "bg-[#fff8df]", dot: "bg-[#d6b98c]" },
  rose: { chip: "border-[#efbecb] bg-[#fff2f4] text-[#9d3351]", fill: "bg-[#f5c6d0]", strip: "from-[#f7cbd4] to-[#c95b78]", text: "text-[#9d3351]", soft: "bg-[#fff2f4]", dot: "bg-[#f4b7c6]" },
  ink: { chip: "border-[#d8d2c7] bg-[#f8f4ec] text-[#50483d]", fill: "bg-[#e7dfd2]", strip: "from-[#e7dfd2] to-[#a89e90]", text: "text-[#50483d]", soft: "bg-[#f8f4ec]", dot: "bg-[#746c60]" },
};

const navItems: NavItem[] = [
  { view: "Home", label: "Home", icon: Home, tone: "pink", group: "Start" },
  { view: "Review", label: "Review", icon: Inbox, tone: "butter", group: "Start" },
  { view: "Plan", label: "Plan", icon: CalendarDays, tone: "mint", group: "Start" },
  { view: "Writing", label: "Writing", icon: PenLine, tone: "pink", group: "Create" },
  { view: "Ideas", label: "Ideas", icon: Lightbulb, tone: "aqua", group: "Create" },
  { view: "Media", label: "Media", icon: Archive, tone: "butter", group: "Create" },
  { view: "Daily", label: "Daily", icon: Sun, tone: "mint", group: "Practice" },
  { view: "Faith", label: "Faith", icon: Heart, tone: "rose", group: "Practice" },
  { view: "Career", label: "Career", icon: FolderOpen, tone: "pink", group: "Becoming" },
  { view: "LSAT", label: "LSAT", icon: BookOpen, tone: "mint", group: "Becoming" },
  { view: "Fitness", label: "Fitness", icon: Dumbbell, tone: "mint", group: "Becoming" },
  { view: "People", label: "People", icon: Users, tone: "rose", group: "World" },
  { view: "Calendar", label: "Calendar", icon: CalendarDays, tone: "butter", group: "World" },
  { view: "Memory", label: "Memory", icon: Search, tone: "aqua", group: "World" },
  { view: "Integrations", label: "Settings", icon: Settings, tone: "ink", group: "World" },
];

const workspaceCopy: Record<Exclude<View, "Home" | "Review" | "Plan" | "Writing">, { title: string; eyebrow: string; intro: string; icon: LucideIcon; tone: Tone; cards: { label: string; title: string; body: string; tone: Tone }[] }> = {
  Ideas: { title: "Idea Vault", eyebrow: "Incubate", icon: Lightbulb, tone: "aqua", intro: "Ideas can stay ideas until timing, repetition, and leverage make them worth action.", cards: [{ label: "Promising", title: "Personal AI OS", body: "High leverage, actively building.", tone: "pink" }, { label: "Incubating", title: "Business idea repeats", body: "Watch for repetition before promoting.", tone: "aqua" }, { label: "Next", title: "Revisit weekly", body: "A small ritual for deciding what matters.", tone: "mint" }] },
  Media: { title: "Media Vault", eyebrow: "Sources", icon: Archive, tone: "butter", intro: "Books, podcasts, screenshots, links, and notes that feed writing and memory.", cards: [{ label: "Books", title: "Read / to read", body: "Book notes and recommendations will connect to ideas.", tone: "butter" }, { label: "Podcasts", title: "Notes into ideas", body: "Podcast notes can become writing angles.", tone: "aqua" }, { label: "Bookmarks", title: "Links to process", body: "Future agents can organize saved links weekly.", tone: "pink" }] },
  Daily: { title: "Daily Log", eyebrow: "Rhythm", icon: Sun, tone: "mint", intro: "Reflection, morning pages, daily data, Bible, supplements, energy, and focus.", cards: [{ label: "Reflect", title: "Morning pages", body: "A place to write or attach daily reflection.", tone: "pink" }, { label: "Track", title: "Daily data", body: "Sleep, supplements, Bible, miles, yoga, and study can become stats later.", tone: "mint" }, { label: "Review", title: "What got done", body: "This can feed reports without cluttering the home page.", tone: "butter" }] },
  Faith: { title: "Devotional", eyebrow: "Faith", icon: Heart, tone: "rose", intro: "Bible reading, prayer, spiritual themes, and connections to writing and people.", cards: [{ label: "Verse", title: "Today's verse", body: "Daily verse and reflection placeholder.", tone: "rose" }, { label: "Prayer", title: "People I am praying for", body: "Future link to People records.", tone: "aqua" }, { label: "Theme", title: "What God is teaching me", body: "Recurring spiritual themes surface here.", tone: "mint" }] },
  Career: { title: "Career", eyebrow: "Becoming", icon: FolderOpen, tone: "pink", intro: "Applications, law schools, firms, deadlines, documents, networking, and interview prep.", cards: [{ label: "Applications", title: "Status pipeline", body: "Schools, firms, and jobs.", tone: "pink" }, { label: "Docs", title: "Resume and letters", body: "Google Docs should become central here too.", tone: "aqua" }, { label: "Prep", title: "Follow-ups", body: "Capture notes can become prep briefs and email drafts.", tone: "butter" }] },
  LSAT: { title: "LSAT", eyebrow: "Becoming", icon: BookOpen, tone: "mint", intro: "Sessions, accuracy, question types, wrong answer journal, and flaw patterns.", cards: [{ label: "Today", title: "1 RC + 10 LR", body: "A planning target that can become a study log.", tone: "mint" }, { label: "Insight", title: "Abstract causal reasoning", body: "AI insight placeholder.", tone: "pink" }, { label: "Review", title: "Wrong answers", body: "Track patterns without overbuilding the page yet.", tone: "aqua" }] },
  Fitness: { title: "Fitness", eyebrow: "Becoming", icon: Dumbbell, tone: "mint", intro: "Running, workouts, riding, marathon plan, soreness, and energy notes.", cards: [{ label: "Mileage", title: "7.3 miles this week", body: "Mock dashboard value.", tone: "mint" }, { label: "Recovery", title: "Energy and soreness", body: "Lightweight notes inform suggestions.", tone: "butter" }, { label: "Plan", title: "Ride / workout", body: "Approved workouts can become calendar blocks.", tone: "aqua" }] },
  People: { title: "People", eyebrow: "Relationships", icon: Users, tone: "rose", intro: "Contacts, follow-up cadence, notes, prayer connections, and relationship context.", cards: [{ label: "Follow-up", title: "Sarah", body: "Example reminder from starter capture.", tone: "rose" }, { label: "Cadence", title: "Overdue soon", body: "Future reminders come from approved items.", tone: "butter" }, { label: "Context", title: "Relationship notes", body: "Keep the why, not just the task.", tone: "aqua" }] },
  Calendar: { title: "Calendar", eyebrow: "Blocks", icon: CalendarDays, tone: "butter", intro: "For the fun full calendar, open /calendar. Approved plan items can become events later.", cards: [{ label: "Today", title: "Draft plan", body: "Plan items can become calendar data later.", tone: "mint" }, { label: "Review", title: "15 minute AI review", body: "Recurring review ritual.", tone: "pink" }, { label: "Writing", title: "Synthesis block", body: "Approved writing sessions can become events.", tone: "aqua" }] },
  Memory: { title: "Memory", eyebrow: "Core", icon: Search, tone: "aqua", intro: "Internal memory, external memory, life history, themes, and connections.", cards: [{ label: "Internal", title: "How I think", body: "Processing patterns, feelings, beliefs, decisions, and recurring self-knowledge.", tone: "pink" }, { label: "External", title: "How I want it to feel", body: "Dreams, visions, taste, inspiration, and reputation signals.", tone: "aqua" }, { label: "Life", title: "What I have done", body: "Projects, jobs, travels, books, lessons, and verbal dumps.", tone: "butter" }] },
  Integrations: { title: "Integrations", eyebrow: "Connect", icon: Settings, tone: "ink", intro: "Google Docs, Calendar, Photos, bookmarks, and Supabase belong here as the app grows.", cards: [{ label: "Planned", title: "Google Docs", body: "Import selected docs and save drafts back.", tone: "pink" }, { label: "Planned", title: "Google Photos", body: "Extract quotes from screenshots later.", tone: "aqua" }, { label: "Now", title: "Supabase", body: "Capture and review persistence is live.", tone: "mint" }] },
};

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function classifyCapture(captureRecord: CaptureRecord): Suggestion[] {
  const { id: captureId, text } = captureRecord;
  const t = text.toLowerCase();
  const suggestions: Suggestion[] = [];
  const add = (type: string, destination: string, body: string, confidence: number) => suggestions.push({ id: makeId("suggestion"), captureId, type, destination, text: body, confidence, status: "pending" });
  add("raw capture", "Review", text, 100);
  const lines = text.split(/\n|;|,/).map((line) => line.trim()).filter(Boolean);
  const taskLikeLines = lines.filter((line) => /\b(todo|pack|call|email|follow up|buy|schedule|send|finish|pick up|remember|pay)\b/i.test(line));
  if (taskLikeLines.length) add("possible tasks", "Review", taskLikeLines.slice(0, 8).join(" | "), 88);
  if (t.includes("lsat") || t.includes("rc") || t.includes("lr") || t.includes("logical reasoning")) add("LSAT log", "LSAT", "Create an LSAT study note or day-plan block.", 91);
  if (t.includes("sleep") || t.includes("supplement") || t.includes("bible") || t.includes("pages")) add("daily data", "Daily", "File the repeatable daily data without turning it into a forever idea.", 84);
  if (t.includes("run") || t.includes("workout") || t.includes("ride") || t.includes("yoga")) add("workout log", "Fitness", "File this as body/training context.", 84);
  if (t.includes("essay") || t.includes("substack") || t.includes("write")) add("writing material", "Writing", "Preserve this as writing material and suggest an angle.", 90);
  if (t.includes("idea") || t.includes("business") || t.includes("product") || t.includes("system")) add("idea", "Ideas", "Store this as an idea without forcing it into a task.", 82);
  if (t.includes("tomorrow") || t.includes("today") || t.includes("schedule") || t.includes("block")) add("plan option", "Plan", "Suggest a day-plan block for the time-sensitive part.", 78);
  return suggestions;
}

function createCapture(text: string) {
  const captureRecord: CaptureRecord = { id: makeId("capture"), text, createdAt: new Date().toISOString(), source: "quick capture", status: "review" };
  return { captureRecord, suggestions: classifyCapture(captureRecord) };
}

function getDeviceId() {
  const saved = localStorage.getItem(DEVICE_KEY);
  if (saved) return saved;
  const next = makeId("device");
  localStorage.setItem(DEVICE_KEY, next);
  return next;
}

function isSupabaseConfigured() { return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY); }

async function loadFromSupabase(deviceId: string): Promise<StoredOS | null> {
  if (!isSupabaseConfigured()) return null;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/os_state?device_id=eq.${encodeURIComponent(deviceId)}&select=data&limit=1`, { headers: { apikey: SUPABASE_ANON_KEY ?? "", Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
  if (!response.ok) throw { phase: "load", status: response.status, detail: await response.text() } satisfies SupabaseError;
  const rows = await response.json() as { data: StoredOS }[];
  return rows[0]?.data ?? null;
}

async function saveToSupabase(deviceId: string, data: StoredOS) {
  if (!isSupabaseConfigured()) return;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/os_state?on_conflict=device_id`, { method: "POST", headers: { apikey: SUPABASE_ANON_KEY ?? "", Authorization: `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ device_id: deviceId, data, updated_at: data.updatedAt }) });
  if (!response.ok) throw { phase: "save", status: response.status, detail: await response.text() } satisfies SupabaseError;
}

function themeVars(mode: "light" | "dark") {
  return { "--app-bg": mode === "light" ? "#f6f1e8" : "#171512", "--panel": mode === "light" ? "rgba(255, 252, 246, 0.84)" : "rgba(40, 37, 32, 0.88)", "--panel-strong": mode === "light" ? "#fffdf8" : "#27231f", "--rail": mode === "light" ? "#fbf6ee" : "#211e1b", "--line": mode === "light" ? "#e7dccb" : "#3b352f", "--text": mode === "light" ? "#201a16" : "#f4eadf", "--muted": mode === "light" ? "#7a6d5f" : "#c3b6a7", "--faint": mode === "light" ? "#a69a8b" : "#948678", "--shadow": mode === "light" ? "0 18px 45px rgba(74, 55, 34, 0.10)" : "0 18px 45px rgba(0,0,0,0.22)" } as CSSProperties & Record<string, string>;
}

function toneForDestination(destination: string): Tone { return ({ Writing: "pink", Ideas: "aqua", Calendar: "butter", Plan: "mint", LSAT: "mint", People: "rose", Fitness: "mint", Faith: "rose", Daily: "mint", Review: "ink" } as Record<string, Tone>)[destination] ?? "ink"; }
function iconForDestination(destination: string): LucideIcon { return ({ Writing: PenLine, Ideas: Lightbulb, Calendar: CalendarDays, Plan: CalendarDays, LSAT: BookOpen, People: Users, Fitness: Dumbbell, Faith: Heart, Daily: Sun, Review: Inbox } as Record<string, LucideIcon>)[destination] ?? FileText; }
function Surface({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={`rounded-[28px] border border-[var(--line)] bg-[var(--panel)] shadow-[var(--shadow)] backdrop-blur ${className}`}>{children}</section>; }
function Chip({ children, tone = "pink", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) { return <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold ${toneStyles[tone].chip} ${className}`}>{children}</span>; }
function IconButton({ children, label, onClick }: { children: ReactNode; label: string; onClick?: () => void }) { return <button type="button" aria-label={label} title={label} onClick={onClick} className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--panel-strong)] text-[var(--muted)] shadow-sm transition hover:-translate-y-0.5 hover:text-[var(--text)]">{children}</button>; }
function MetricTile({ label, value, sub, tone, icon: Icon }: { label: string; value: string | number; sub: string; tone: Tone; icon: LucideIcon }) { return <div className="relative min-h-32 overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--panel-strong)] p-4 shadow-sm"><div className={`absolute inset-y-0 right-0 w-2 bg-gradient-to-b ${toneStyles[tone].strip}`} /><div className="flex items-start justify-between"><span className={`grid h-9 w-9 place-items-center rounded-2xl ${toneStyles[tone].soft} ${toneStyles[tone].text}`}><Icon className="h-4 w-4" /></span><span className="text-[11px] font-semibold text-[var(--faint)]">{label}</span></div><p className="mt-5 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-sm text-[var(--muted)]">{sub}</p></div>; }
function CollectionCard({ label, title, body, tone, icon: Icon }: { label: string; title: string; body: string; tone: Tone; icon: LucideIcon }) { return <div className="group relative min-h-44 overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--panel-strong)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"><div className={`absolute inset-y-0 right-0 w-3 bg-gradient-to-b ${toneStyles[tone].strip}`} /><div className="flex items-start justify-between gap-3"><span className={`grid h-9 w-9 place-items-center rounded-2xl ${toneStyles[tone].soft} ${toneStyles[tone].text}`}><Icon className="h-4 w-4" /></span><Chip tone={tone}>{label}</Chip></div><h3 className="mt-5 text-base font-semibold leading-5">{title}</h3><p className="mt-2 text-sm leading-5 text-[var(--muted)]">{body}</p></div>; }

function TodayDump({ onCapture }: { onCapture: (text: string) => void }) {
  const [draft, setDraft] = useState("");
  function submit() { if (!draft.trim()) return; onCapture(draft); setDraft(""); }
  return <Surface className="overflow-hidden p-0"><div className="border-b border-[var(--line)] bg-[var(--panel-strong)] px-5 py-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">Today Dump</p><h2 className="mt-1 text-xl font-semibold">Drop the whole messy list here.</h2></div><Chip tone="pink">goes to Review</Chip></div></div><div className="p-5"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} className="min-h-36 w-full resize-y rounded-[24px] border border-[var(--line)] bg-[var(--panel-strong)] p-4 text-sm leading-6 text-[var(--text)] outline-none placeholder:text-[var(--faint)] focus:border-[#eab4c9] focus:ring-4 focus:ring-[#fff0f6]" placeholder="Example: pack charger, call Sarah, LSAT 10 LR, run 2 miles, pay card, pick up groceries..." /><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-[var(--muted)]">One dump can become tasks, plan blocks, daily data, LSAT, fitness, and reminders.</p><button type="button" onClick={submit} className="rounded-full bg-[#d94f8c] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5">Send to Review</button></div></div></Surface>;
}

function HomeView({ pending, captures, approved, syncState, syncDetail, dailyStandard, onReview, onPlan, onCapture }: { pending: number; captures: CaptureRecord[]; approved: number; syncState: SyncState; syncDetail: string; dailyStandard: string; onReview: () => void; onPlan: () => void; onCapture: (text: string) => void }) {
  const reviewTabs = [{ label: "Pending", value: pending, tone: "pink" as Tone }, { label: "Filed", value: approved, tone: "mint" as Tone }, { label: "Themes", value: Math.max(1, approved), tone: "aqua" as Tone }];
  return <div className="space-y-6"><header className="grid gap-4 lg:grid-cols-[1fr_360px]"><Surface className="p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><Chip tone={syncState === "supabase" ? "mint" : syncState === "supabase-error" ? "butter" : "aqua"}>{syncState === "supabase" ? "Synced" : syncState === "supabase-error" ? "Local backup" : syncState === "loading" ? "Loading" : "Local draft"}</Chip><h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Good morning, Kristen.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Capture the list first. Sort it after it is out of your head.</p>{syncDetail ? <p className="mt-3 max-w-xl rounded-2xl border border-[#ead9a8] bg-[#fff9df] p-3 text-xs leading-5 text-[var(--muted)]">Supabase detail: {syncDetail}</p> : null}</div><Chip tone="pink">living collection</Chip></div></Surface><Surface className="p-5"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d94f8c]">Daily Standard</p><p className="mt-3 text-base leading-6 text-[var(--text)]">Capture first. Discern second. Execute only what deserves it.</p><div className="mt-5 flex gap-1">{["pink", "aqua", "mint", "butter", "rose"].map((tone) => <span key={tone} className={`h-2 flex-1 rounded-full ${toneStyles[tone as Tone].dot}`} />)}</div></Surface></header><TodayDump onCapture={onCapture} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><MetricTile label="Review" value={pending} sub="waiting" tone="pink" icon={Inbox} /><MetricTile label="Captures" value={captures.length} sub="saved" tone="butter" icon={Archive} /><MetricTile label="Filed" value={approved} sub="approved" tone="mint" icon={Check} /><MetricTile label="Streak" value="4" sub="study days" tone="aqua" icon={Sparkles} /><MetricTile label="Miles" value="7.3" sub="this week" tone="mint" icon={Dumbbell} /></div><div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"><Surface className="p-5"><div className="flex items-start justify-between gap-4"><div><Chip tone="pink"><Inbox className="h-3.5 w-3.5" />Start here</Chip><h2 className="mt-4 text-2xl font-semibold tracking-tight">Review, then plan.</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Anything dumped lands in Review first. Plan is where today becomes a shape.</p></div><div className="flex flex-wrap gap-2"><button onClick={onReview} className="rounded-full bg-[#201a16] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5">Review</button><button onClick={onPlan} className="rounded-full border border-[var(--line)] bg-[var(--panel-strong)] px-5 py-3 text-sm font-semibold text-[var(--muted)] shadow-sm transition hover:-translate-y-0.5">Plan</button></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{reviewTabs.map((tab) => <div key={tab.label} className={`rounded-3xl border p-4 ${toneStyles[tab.tone].chip}`}><p className="text-2xl font-semibold">{tab.value}</p><p className="text-xs font-semibold uppercase tracking-[0.12em]">{tab.label}</p></div>)}</div></Surface><Surface className="p-5"><div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">Recent Captures</p><Archive className="h-4 w-4 text-[var(--faint)]" /></div><div className="mt-4 space-y-3">{captures.slice(0, 3).map((item) => <div key={item.id} className="rounded-3xl border border-[var(--line)] bg-[var(--panel-strong)] p-3"><p className="line-clamp-3 text-sm leading-6 text-[var(--muted)]">{item.text}</p></div>)}</div></Surface></div></div>;
}

function ReviewView({ queue, approved, setStatus }: { queue: Suggestion[]; approved: number; setStatus: (id: string, status: Status) => void }) {
  const filedCounts = queue.filter((item) => item.status === "approved").reduce<Record<string, number>>((acc, item) => { acc[item.destination] = (acc[item.destination] ?? 0) + 1; return acc; }, {});
  return <div className="space-y-6"><header className="flex flex-wrap items-end justify-between gap-4"><div><Chip tone="pink"><Inbox className="h-3.5 w-3.5" />Review</Chip><h1 className="mt-4 text-4xl font-semibold tracking-tight">Start here.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">Your raw capture appears first. Then the OS suggests tasks, logs, plan items, and destinations.</p></div><Chip tone="mint">{approved} filed</Chip></header><Surface className="p-5"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">Filed By Workspace</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{Object.entries(filedCounts).length ? Object.entries(filedCounts).map(([destination, count]) => <CollectionCard key={destination} label="filed" title={`${count} ${destination}`} body="Routed to a destination with suggested tags and themes." tone={toneForDestination(destination)} icon={iconForDestination(destination)} />) : <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--panel-strong)] p-5 text-sm text-[var(--muted)]">Dump a list from Home or the top bar and it will appear here.</div>}</div></Surface><div className="grid gap-3">{queue.map((item) => { const tone = toneForDestination(item.destination); const Icon = iconForDestination(item.destination); return <Surface key={item.id} className="overflow-hidden p-0"><div className={`h-2 bg-gradient-to-r ${toneStyles[tone].strip}`} /><div className="grid gap-4 p-4 lg:grid-cols-[1fr_auto]"><div><div className="flex flex-wrap items-center gap-2"><Chip tone={tone}><Icon className="h-3.5 w-3.5" />{item.type}</Chip><Chip tone={item.status === "approved" ? "mint" : item.status === "deleted" ? "ink" : "butter"}>{item.status}</Chip></div><p className="mt-3 whitespace-pre-wrap text-base font-semibold leading-6">{item.text}</p><p className="mt-2 text-sm text-[var(--muted)]">{item.destination} collection - {item.confidence}% confidence</p></div><div className="flex flex-wrap items-center gap-2 lg:justify-end"><button type="button" className="rounded-full bg-[#d94f8c] px-4 py-2 text-xs font-semibold text-white shadow-sm" onClick={() => setStatus(item.id, "approved")}>Approve</button><button type="button" className="rounded-full bg-[#21a85b] px-4 py-2 text-xs font-semibold text-white shadow-sm" onClick={() => setStatus(item.id, "edited")}>Edit</button><button type="button" className="rounded-full border border-[var(--line)] bg-[var(--panel-strong)] px-4 py-2 text-xs font-semibold text-[var(--muted)]" onClick={() => setStatus(item.id, "deleted")}>Delete</button><button type="button" className="rounded-full border border-[#eab4c9] bg-[#fff0f6] px-4 py-2 text-xs font-semibold text-[#b83272]" onClick={() => setStatus(item.id, "reclassified")}>Reclassify</button></div></div></Surface>; })}</div></div>;
}

function PlanView() {
  const routines = [{ title: "Bible + supplements", time: "Morning", tone: "rose" as Tone }, { title: "LSAT questions", time: "Focus block", tone: "mint" as Tone }, { title: "Pack / reset", time: "Errands", tone: "butter" as Tone }, { title: "Ride or workout", time: "Body", tone: "aqua" as Tone }];
  const blocks = [{ time: "8:30", title: "Slow start / sleep in", tone: "butter" as Tone }, { time: "10:00", title: "Review yesterday", tone: "pink" as Tone }, { time: "11:00", title: "LSAT: 1 RC + 10 LR", tone: "mint" as Tone }, { time: "2:00", title: "Pack list", tone: "aqua" as Tone }];
  return <div className="space-y-6"><div><Chip tone="mint"><CalendarDays className="h-3.5 w-3.5" />Plan</Chip><h1 className="mt-4 text-4xl font-semibold tracking-tight">Build the day.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">A calm place to plan from routines, priorities, and anything unfinished from review.</p></div><div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]"><Surface className="p-5"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">Today</p><h2 className="mt-1 text-xl font-semibold">Calendar shape</h2><div className="mt-5 space-y-3">{blocks.map((block) => <div key={block.title} className="grid grid-cols-[64px_1fr] gap-3 rounded-[24px] border border-[var(--line)] bg-[var(--panel-strong)] p-3"><p className="pt-1 text-xs font-semibold text-[var(--faint)]">{block.time}</p><div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-3"><p className="text-sm font-semibold">{block.title}</p><span className={`h-3 w-3 rounded-full ${toneStyles[block.tone].dot}`} /></div></div>)}</div></Surface><Surface className="p-5"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">Daily Routines</p><div className="mt-4 grid gap-3">{routines.map((routine) => <button key={routine.title} type="button" className="flex items-center justify-between rounded-[22px] border border-[var(--line)] bg-[var(--panel-strong)] p-4 text-left"><div><p className="text-sm font-semibold">{routine.title}</p><p className="mt-1 text-xs text-[var(--muted)]">{routine.time}</p></div><Chip tone={routine.tone}>add</Chip></button>)}</div></Surface></div></div>;
}

function WritingStudioView() {
  const [draftTitle, setDraftTitle] = useState("Untitled essay");
  const [draftBody, setDraftBody] = useState("");
  const wordCount = draftBody.trim() ? draftBody.trim().split(/\s+/).length : 0;
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><Chip tone="pink"><PenLine className="h-3.5 w-3.5" />Writing Studio</Chip><h1 className="mt-4 text-4xl font-semibold tracking-tight">Sit down and write.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">Draft here now. Google Docs sync comes next.</p></div><button type="button" onClick={() => { setDraftTitle("Untitled essay"); setDraftBody(""); }} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#d94f8c] px-4 text-sm font-semibold text-white shadow-sm"><Plus className="h-4 w-4" />New draft</button></div><Surface className="overflow-hidden p-0"><div className="border-b border-[var(--line)] bg-[var(--panel-strong)] px-5 py-4"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">New Draft</p><input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} className="mt-1 w-full bg-transparent text-2xl font-semibold tracking-tight text-[var(--text)] outline-none" /></div><textarea value={draftBody} onChange={(event) => setDraftBody(event.target.value)} className="min-h-[360px] w-full resize-y bg-transparent p-5 text-base leading-7 text-[var(--text)] outline-none placeholder:text-[var(--faint)]" placeholder="Start writing. Messy is allowed here." /><div className="flex items-center justify-between border-t border-[var(--line)] px-5 py-4"><p className="text-xs text-[var(--muted)]">{wordCount} words</p><Chip tone="butter">OS draft now / Google sync next</Chip></div></Surface></div>;
}

function WorkspaceView({ view }: { view: keyof typeof workspaceCopy }) {
  const workspace = workspaceCopy[view];
  const Icon = workspace.icon;
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><Chip tone={workspace.tone}><Icon className="h-3.5 w-3.5" />{workspace.eyebrow}</Chip><h1 className="mt-4 text-4xl font-semibold tracking-tight">{workspace.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{workspace.intro}</p></div><div className="flex gap-2"><IconButton label="Search"><Search className="h-4 w-4" /></IconButton><IconButton label="Add"><Plus className="h-4 w-4" /></IconButton></div></div><div className="grid gap-4 md:grid-cols-3">{workspace.cards.map((card) => <CollectionCard key={card.title} icon={workspace.icon} tone={card.tone} label={card.label} title={card.title} body={card.body} />)}</div><Surface className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--faint)]">Living Collection</p><p className="mt-1 text-sm text-[var(--muted)]">Next pass: this page reads approved records, tags, and related themes from Supabase.</p></div><Chip tone="aqua">ready for data</Chip></div></Surface></div>;
}

export default function HomePage() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [activeView, setActiveView] = useState<View>("Home");
  const [capture, setCapture] = useState("");
  const [captures, setCaptures] = useState<CaptureRecord[]>([]);
  const [queue, setQueue] = useState<Suggestion[]>([]);
  const [hasLoadedStore, setHasLoadedStore] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [syncState, setSyncState] = useState<SyncState>("loading");
  const [syncDetail, setSyncDetail] = useState("");
  const [captureStatus, setCaptureStatus] = useState("");
  const pending = useMemo(() => queue.filter((item) => item.status === "pending").length, [queue]);
  const approved = useMemo(() => queue.filter((item) => item.status === "approved").length, [queue]);
  const dailyStandard = "Capture first. Discern second. Execute only what deserves it.";

  useEffect(() => { async function loadStore() { const currentDeviceId = getDeviceId(); setDeviceId(currentDeviceId); try { const remote = await loadFromSupabase(currentDeviceId); if (remote) { setCaptures(remote.captures ?? []); setQueue(remote.queue ?? []); setSyncState("supabase"); setHasLoadedStore(true); return; } if (isSupabaseConfigured()) setSyncState("supabase"); } catch (error) { const supabaseError = error as SupabaseError; setSyncState("supabase-error"); setSyncDetail(`${supabaseError.phase ?? "load"} ${supabaseError.status ?? ""}: ${supabaseError.detail ?? supabaseError.message ?? "Unknown Supabase error"}`); } const saved = localStorage.getItem(STORAGE_KEY); if (saved) { try { const parsed = JSON.parse(saved) as StoredOS; setCaptures(parsed.captures ?? []); setQueue(parsed.queue ?? []); if (!isSupabaseConfigured()) setSyncState("local"); setHasLoadedStore(true); return; } catch { localStorage.removeItem(STORAGE_KEY); } } const seed = createCapture(starterCapture); setCaptures([seed.captureRecord]); setQueue(seed.suggestions); if (!isSupabaseConfigured()) setSyncState("local"); setHasLoadedStore(true); } void loadStore(); }, []);
  useEffect(() => { if (!hasLoadedStore) return; const data = { captures, queue, updatedAt: new Date().toISOString() } satisfies StoredOS; localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); if (!deviceId || !isSupabaseConfigured()) return; saveToSupabase(deviceId, data).then(() => { setSyncState("supabase"); setSyncDetail(""); }).catch((error) => { const supabaseError = error as SupabaseError; setSyncState("supabase-error"); setSyncDetail(`${supabaseError.phase ?? "save"} ${supabaseError.status ?? ""}: ${supabaseError.detail ?? supabaseError.message ?? "Unknown Supabase error"}`); }); }, [captures, deviceId, hasLoadedStore, queue]);

  function addCaptureToReview(rawText: string) {
    if (!rawText.trim()) return;
    const next = createCapture(rawText);
    setCaptures((current) => [next.captureRecord, ...current]);
    setQueue((current) => [...next.suggestions, ...current]);
    setCaptureStatus("Saved to Review");
    window.setTimeout(() => setCaptureStatus(""), 2200);
    setActiveView("Review");
  }
  function submitCapture() { addCaptureToReview(capture); setCapture(""); }
  function setStatus(id: string, status: Status) { setQueue((current) => current.map((item) => item.id === id ? { ...item, status } : item)); }
  function renderView() { if (activeView === "Home") return <HomeView pending={pending} captures={captures} approved={approved} syncState={syncState} syncDetail={syncDetail} dailyStandard={dailyStandard} onReview={() => setActiveView("Review")} onPlan={() => setActiveView("Plan")} onCapture={addCaptureToReview} />; if (activeView === "Review") return <ReviewView queue={queue} approved={approved} setStatus={setStatus} />; if (activeView === "Plan") return <PlanView />; if (activeView === "Writing") return <WritingStudioView />; return <WorkspaceView view={activeView as keyof typeof workspaceCopy} />; }

  return <main style={themeVars(mode)} className="min-h-screen overflow-x-hidden bg-[var(--app-bg)] text-[var(--text)] transition-colors"><div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(217,79,140,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(22,199,193,0.14),transparent_24%),radial-gradient(circle_at_72%_88%,rgba(33,168,91,0.12),transparent_24%)]" /><div className="flex min-h-screen flex-col lg:flex-row"><aside className="border-b border-[var(--line)] bg-[var(--rail)]/88 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:overflow-y-auto lg:border-b-0 lg:border-r"><div className="flex items-center justify-between gap-3"><button onClick={() => setActiveView("Home")} className="flex items-center gap-3 text-left"><div className="grid h-11 w-11 place-items-center rounded-[18px] bg-[#d94f8c] text-sm font-black tracking-[-0.08em] text-white shadow-lg shadow-pink-200/60">KF</div><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d94f8c]">Kristen Forti</p><p className="text-sm font-semibold text-[var(--text)]">Excellent OS</p></div></button><IconButton label="Toggle color mode" onClick={() => setMode(mode === "light" ? "dark" : "light")}>{mode === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</IconButton></div><nav className="mt-6 hidden gap-5 lg:grid">{(["Start", "Create", "Practice", "Becoming", "World"] as NavGroup[]).map((group) => <div key={group}><p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--faint)]">{group}</p><div className="grid gap-1">{navItems.filter((item) => item.group === group).map((item) => { const Icon = item.icon; const active = activeView === item.view; return <button key={item.view} onClick={() => setActiveView(item.view)} className={`flex items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${active ? `${toneStyles[item.tone].soft} ${toneStyles[item.tone].text} shadow-sm` : "text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-[var(--text)]"}`}><span className="flex items-center gap-2"><span className={`grid h-7 w-7 place-items-center rounded-xl ${active ? toneStyles[item.tone].fill : "bg-[var(--panel-strong)]"}`}><Icon className="h-3.5 w-3.5" /></span>{item.label}</span>{active ? <Circle className="h-2 w-2 fill-current" /> : null}</button>; })}</div></div>)}</nav></aside><section className="flex-1 pb-20 lg:pb-0"><form onSubmit={(event) => { event.preventDefault(); submitCapture(); }} className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--app-bg)]/80 px-4 py-3 backdrop-blur-xl lg:px-8"><div className="mx-auto flex max-w-6xl gap-2 sm:items-center"><div className="flex min-h-12 flex-1 items-center rounded-full border border-[var(--line)] bg-[var(--panel-strong)] px-4 shadow-sm"><input value={capture} onChange={(event) => setCapture(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--faint)]" aria-label="Capture" placeholder="Dump a to-do, reminder, note, or today list" /></div>{captureStatus ? <span className="hidden rounded-full border border-[#b8dfc5] bg-[#eefbf1] px-3 py-2 text-xs font-semibold text-[#1a7d46] sm:inline-flex">{captureStatus}</span> : null}<button type="submit" className="min-h-12 rounded-full bg-[#d94f8c] px-5 text-sm font-semibold text-white shadow-lg shadow-pink-200/70 transition hover:-translate-y-0.5 hover:bg-[#c83f7e]">Add</button></div></form><div className="mx-auto max-w-6xl px-4 py-7 lg:px-8">{renderView()}</div></section></div><nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 gap-2 rounded-[28px] border border-[var(--line)] bg-[var(--panel)] p-2 shadow-[var(--shadow)] backdrop-blur lg:hidden">{navItems.slice(0, 5).map((item) => { const Icon = item.icon; const active = activeView === item.view; return <button key={item.view} onClick={() => setActiveView(item.view)} className={`grid place-items-center rounded-2xl px-2 py-2 text-[10px] font-semibold ${active ? `${toneStyles[item.tone].soft} ${toneStyles[item.tone].text}` : "text-[var(--muted)]"}`}><Icon className="mb-1 h-4 w-4" />{item.label}</button>; })}</nav></main>;
}
