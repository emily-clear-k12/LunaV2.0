import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Feather,
  Gamepad2,
  Lightbulb,
  Lock,
  PenLine,
  Sparkles,
  Squirrel,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/* ———————————————————————————————————————————————
   Shared bits: asset helper, coins, Astra's pouch
   ——————————————————————————————————————————————— */

export const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;

export const MY_GOAL = "Back up my opinion with strong, specific reasons.";

export type Earning = { label: string; amount: number };

export type CoinState = {
  coins: number;
  recent: Earning[];
  /** bumps every time coins are added so the pouch can play its "clink" */
  pulse: number;
};

export const COINS_AT_START: CoinState = {
  coins: 120,
  recent: [
    { label: "Finished “Cite the text”", amount: 10 },
    { label: "Revised “Four-day week”", amount: 15 },
    { label: "Practice set · Commas in a series", amount: 10 },
  ],
  pulse: 0,
};

/** Small leather drawstring pouch with glowing coins peeking out. */
function PouchArt() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="ap-pouch-art">
      <defs>
        <radialGradient id="apPouchBody" cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#c27a3e" />
          <stop offset="60%" stopColor="#8a4a1c" />
          <stop offset="100%" stopColor="#5a2d10" />
        </radialGradient>
        <radialGradient id="apCoin" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="55%" stopColor="#f4c541" />
          <stop offset="100%" stopColor="#b9821c" />
        </radialGradient>
      </defs>
      {/* coins peeking over the rim */}
      <circle cx="25" cy="20" r="7" fill="url(#apCoin)" stroke="#8a5a12" strokeWidth="1" />
      <circle cx="37" cy="18" r="7" fill="url(#apCoin)" stroke="#8a5a12" strokeWidth="1" />
      <circle cx="31" cy="15" r="6" fill="url(#apCoin)" stroke="#8a5a12" strokeWidth="1" />
      {/* body */}
      <path
        d="M14 27c-6 10-6 22 2 28 8 6 24 6 32 0 8-6 8-18 2-28-3-4-33-4-36 0z"
        fill="url(#apPouchBody)"
        stroke="#3d1d08"
        strokeWidth="1.5"
      />
      {/* gathered neck + drawstring */}
      <path d="M15 27c6 3 28 3 34 0" fill="none" stroke="#3d1d08" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 29c-3 5-4 9-2 13M44 29c3 5 4 9 2 13" fill="none" stroke="#e8b06a" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
      {/* tiny crystal clasp */}
      <path d="M32 31l3 4-3 4-3-4z" fill="#8fd3ff" stroke="#e8f7ff" strokeWidth=".8" />
    </svg>
  );
}

export function Pouch({
  state,
  variant,
  onOpenClassCade,
}: {
  state: CoinState;
  variant: "hub" | "page";
  onOpenClassCade: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [clink, setClink] = useState(false);
  const first = useRef(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setClink(true);
    const id = window.setTimeout(() => setClink(false), 1400);
    return () => window.clearTimeout(id);
  }, [state.pulse]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const last = state.recent[0];

  return (
    <div ref={wrap} className={`ap-pouch ${variant} ${clink ? "clink" : ""}`}>
      <button
        type="button"
        className="ap-pouch-btn"
        aria-expanded={open}
        aria-label={`Astra’s pouch: ${state.coins} coins`}
        onClick={() => setOpen((v) => !v)}
      >
        <PouchArt />
        <span className="ap-pouch-count">{state.coins}</span>
        {clink && last ? <span className="ap-pouch-plus">+{last.amount}</span> : null}
      </button>
      {open ? (
        <div className="ap-pouch-pop" role="dialog" aria-label="Astra’s pouch">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="ap-eyebrow">Astra’s pouch</p>
              <p className="ap-pouch-total">
                {state.coins} <span>coins</span>
              </p>
            </div>
            <button type="button" className="ap-x" aria-label="Close" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </button>
          </div>
          <p className="mt-1 text-[13px] font-semibold text-[#7a5a2e]">
            You earn coins every time you write, practice, or revise.
          </p>
          <ul className="mt-2 grid gap-1">
            {state.recent.slice(0, 4).map((item, i) => (
              <li key={`${item.label}-${i}`} className="ap-earn">
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <b>+{item.amount}</b>
              </li>
            ))}
          </ul>
          <button type="button" className="ap-btn ap-btn-cade mt-3 w-full" onClick={onOpenClassCade}>
            <Gamepad2 className="size-4" aria-hidden="true" />
            Spend in ClassCade
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ———————————————————————————————————————————————
   Page shell: full-screen scene + header + scrolling body
   ——————————————————————————————————————————————— */

function PageShell({
  scene,
  eyebrow,
  title,
  icon,
  onBack,
  coins,
  onOpenClassCade,
  children,
}: {
  scene: string;
  eyebrow: string;
  title: string;
  icon: ReactNode;
  onBack: () => void;
  coins: CoinState;
  onOpenClassCade: () => void;
  children: ReactNode;
}) {
  return (
    <div className="ap-page">
      <img src={asset(scene)} alt="" className="ap-scene" />
      <div className="ap-veil" aria-hidden="true" />
      <header className="ap-head">
        <button type="button" className="ap-back" onClick={onBack}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Portals
        </button>
        <div className="ap-title-wrap">
          <span className="ap-title-icon" aria-hidden="true">
            {icon}
          </span>
          <div>
            <p className="ap-title-k">{eyebrow}</p>
            <h1 className="ap-title">{title}</h1>
          </div>
        </div>
        <Pouch state={coins} variant="page" onOpenClassCade={onOpenClassCade} />
      </header>
      <main className="ap-body">{children}</main>
    </div>
  );
}

function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <section className={`ap-card ${className}`}>{children}</section>;
}

function Seg<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="ap-seg" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          className={value === o.id ? "on" : ""}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ———————————————————————————————————————————————
   MY GROWTH — goal + writing data (crystal lantern)
   ——————————————————————————————————————————————— */

type Subject = "ela" | "science" | "social";
type Kind = "scr" | "ecr";

const STRATEGY: Record<Kind, { name: string; key: string; parts: { k: string; name: string }[] }> = {
  scr: {
    name: "R-A-C-E",
    key: "R-A-C-E — Restate, Answer, Cite, Explain",
    parts: [
      { k: "R", name: "Restate" },
      { k: "A", name: "Answer" },
      { k: "C", name: "Cite" },
      { k: "E", name: "Explain" },
    ],
  },
  ecr: {
    name: "Essay parts",
    key: "Claim · Reasons · Evidence · Explain · Conclude",
    parts: [
      { k: "Cl", name: "Claim" },
      { k: "Re", name: "Reasons" },
      { k: "Ev", name: "Evidence" },
      { k: "Ex", name: "Explain" },
      { k: "Co", name: "Conclude" },
    ],
  },
};

/** hits / pieces per strategy part — demo data, not live */
const STRATEGY_DATA: Record<Kind, Record<Subject, { hits: number[]; pieces: number }>> = {
  scr: {
    ela: { hits: [4, 4, 3, 2], pieces: 4 },
    science: { hits: [3, 3, 2, 1], pieces: 3 },
    social: { hits: [2, 2, 1, 1], pieces: 2 },
  },
  ecr: {
    ela: { hits: [2, 2, 1, 1, 1], pieces: 2 },
    science: { hits: [1, 1, 1, 0, 0], pieces: 1 },
    social: { hits: [0, 0, 0, 0, 0], pieces: 0 },
  },
};

const RECENT_SCORES: Record<Kind, { title: string; score: number }[]> = {
  scr: [
    { title: "Why did the town build a dam?", score: 2 },
    { title: "What helped the plant grow?", score: 2 },
    { title: "How did Rosa feel at the end?", score: 3 },
    { title: "Why are bees important?", score: 2 },
    { title: "What changed the river?", score: 3 },
    { title: "Why did Marco keep the map?", score: 3 },
    { title: "How do volcanoes form islands?", score: 3 },
    { title: "How Refrigerators Changed Our Food", score: 4 },
  ],
  ecr: [
    { title: "Should pets be allowed at school?", score: 1.5 },
    { title: "Is homework helpful?", score: 2 },
    { title: "Should kids have phones?", score: 2 },
    { title: "Four-day week · Draft 1", score: 2.5 },
    { title: "Four-day week · Draft 2", score: 3 },
  ],
};

const CONQUERED = [
  { goal: "Write a real conclusion instead of just stopping", date: "Sep 15" },
  { goal: "Start every sentence with a capital letter", date: "Aug 28" },
];

const GOAL_CHOICES = [
  "Back up my opinion with strong, specific reasons.",
  "Explain how my evidence proves my answer.",
  "Use transition words to connect my ideas.",
];

export function GrowthPage({
  onBack,
  coins,
  onOpenClassCade,
  onOpenPiece,
  onPractice,
  stats,
}: {
  onBack: () => void;
  coins: CoinState;
  onOpenClassCade: () => void;
  onOpenPiece: (id: string) => void;
  onPractice: () => void;
  stats: { revisions: number; finished: number };
}) {
  const [goal, setGoal] = useState(MY_GOAL);
  const [choosing, setChoosing] = useState(false);
  const [goalNote, setGoalNote] = useState<string | null>(null);
  const [kind, setKind] = useState<Kind>("scr");
  const [subject, setSubject] = useState<Subject>("ela");
  const [scoreKind, setScoreKind] = useState<Kind>("scr");

  const strat = STRATEGY[kind];
  const data = STRATEGY_DATA[kind][subject];

  return (
    <PageShell
      scene="scenes/scene4.jpg"
      eyebrow="Goals & data"
      title="My growth"
      icon={<Sparkles className="size-5" />}
      onBack={onBack}
      coins={coins}
      onOpenClassCade={onOpenClassCade}
    >
      <div className="ap-grid-growth">
        {/* Goal */}
        <Card className="ap-span-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="ap-h2">
              <Compass className="size-5 text-[#a0521d]" aria-hidden="true" />
              My focus goal
            </h2>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="ap-btn ap-btn-ghost" onClick={() => setChoosing((v) => !v)}>
                Change goal
              </button>
              <button
                type="button"
                className="ap-btn ap-btn-dark"
                onClick={() => setGoalNote("Sent! Mr. Verret will pick a time to conference with you.")}
              >
                <Users className="size-4" aria-hidden="true" />
                Conference with my teacher
              </button>
            </div>
          </div>
          <div className="ap-goal">
            <img src={asset("crystal.png")} alt="" className="ap-goal-crystal" />
            <div className="min-w-0 flex-1">
              <p className="ap-goal-text">{goal}</p>
              <p className="ap-goal-meta">Trait: Ideas · Set Sep 22 · Mr. Verret keeps this in mind when you conference</p>
            </div>
            <button
              type="button"
              className="ap-btn ap-btn-gold"
              onClick={() => setGoalNote("Great work! Your teacher will check your writing to light this crystal.")}
            >
              <Check className="size-4" aria-hidden="true" />I reached this goal!
            </button>
          </div>
          {goalNote ? (
            <p className="ap-note" role="status">
              {goalNote}
            </p>
          ) : null}
          {choosing ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {GOAL_CHOICES.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`ap-choice ${g === goal ? "on" : ""}`}
                  onClick={() => {
                    setGoal(g);
                    setChoosing(false);
                    setGoalNote("New goal set. Your teacher can see it.");
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          ) : null}
          <div className="ap-conquered">
            <p className="ap-eyebrow">Goals you’ve conquered</p>
            <ul className="flex flex-wrap gap-2">
              {CONQUERED.map((c) => (
                <li key={c.goal} className="ap-conq-chip">
                  <span className="ap-lit-crystal" aria-hidden="true" />
                  {c.goal}
                  <span className="ap-conq-date">{c.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Writing data */}
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="ap-h2">My writing data</h2>
            <Seg
              label="Subject"
              value={subject}
              onChange={setSubject}
              options={[
                { id: "ela", label: "ELA" },
                { id: "science", label: "Science" },
                { id: "social", label: "Social Studies" },
              ]}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <Seg
              label="Response type"
              value={kind}
              onChange={setKind}
              options={[
                { id: "scr", label: "SCR" },
                { id: "ecr", label: "ECR" },
              ]}
            />
            <span className="text-[13px] font-semibold text-[#7a5a2e]">
              how often each part shows up · {data.pieces} {data.pieces === 1 ? "piece" : "pieces"}
            </span>
          </div>
          <p className="ap-eyebrow mt-4">Strategy · {strat.name}</p>
          {data.pieces === 0 ? (
            <p className="ap-empty">No {kind.toUpperCase()} pieces here yet. Your first one will show up right here.</p>
          ) : (
            <ul className="mt-2 grid gap-2.5">
              {strat.parts.map((p, i) => {
                const pct = Math.round((data.hits[i] / data.pieces) * 100);
                const tone = pct >= 75 ? "good" : pct >= 50 ? "mid" : "low";
                return (
                  <li key={p.k} className="ap-meter" title={`${p.name}: ${data.hits[i]} of ${data.pieces} pieces`}>
                    <span className="ap-meter-k">{p.k}</span>
                    <span className="ap-meter-name">{p.name}</span>
                    <span className="ap-meter-track">
                      <span className={`ap-meter-fill ${tone}`} style={{ width: `${Math.max(pct, 2)}%` }} />
                    </span>
                    <span className="ap-meter-pct">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-3 text-[13px] font-semibold text-[#7a5a2e]">{strat.key}</p>
          {data.pieces > 0
            ? (() => {
                let low = 0;
                data.hits.forEach((h, i) => {
                  if (h < data.hits[low]) low = i;
                });
                const part = strat.parts[low];
                return (
                  <div className="ap-nextstep">
                    <Lightbulb className="size-5 shrink-0 text-[#a0521d]" aria-hidden="true" />
                    <p className="min-w-0 flex-1">
                      <b>Next step: {part.name}.</b> It shows up in {data.hits[low]} of your {data.pieces}{" "}
                      {kind.toUpperCase()}s. A short practice set can help.
                    </p>
                    <button type="button" className="ap-btn ap-btn-moss" onClick={onPractice}>
                      Practice it
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                );
              })()
            : null}
        </Card>

        {/* Scores + habits */}
        <div className="grid content-start gap-4">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="ap-h2">Recent scores</h2>
                <p className="text-[13px] font-semibold text-[#7a5a2e]">
                  Your last {RECENT_SCORES[scoreKind].length} {scoreKind.toUpperCase()}s · score out of 4
                </p>
              </div>
              <Seg
                label="Scores for"
                value={scoreKind}
                onChange={setScoreKind}
                options={[
                  { id: "scr", label: "SCR" },
                  { id: "ecr", label: "ECR" },
                ]}
              />
            </div>
            <ScoreBars items={RECENT_SCORES[scoreKind]} />
          </Card>
          <Card>
            <h2 className="ap-h2">Writing habits</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="ap-stat">
                <b>{stats.revisions}</b>
                <span>Revisions made</span>
                <small>Each one makes you stronger</small>
              </div>
              <div className="ap-stat">
                <b>{stats.finished}</b>
                <span>Pieces finished</span>
                <small>Start to polished</small>
              </div>
              <div className="ap-stat coins">
                <b>
                  <span className="ap-coin" aria-hidden="true" />
                  {coins.coins}
                </b>
                <span>Coins in your pouch</span>
                <small>For how you write</small>
              </div>
            </div>
          </Card>
        </div>

        {/* Growth story */}
        <Card className="ap-span-full">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="ap-h2">
                <Sparkles className="size-5 text-[#a0521d]" aria-hidden="true" />
                Growth story — “Should our school have a four-day week?”
              </h2>
              <p className="text-[13px] font-semibold text-[#7a5a2e]">Look what revising did — same writer, two drafts apart.</p>
            </div>
            <button type="button" className="ap-btn ap-btn-ghost" onClick={() => onOpenPiece("four-day")}>
              Open in Treehouse
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="ap-draft">
              <p className="ap-eyebrow">First draft</p>
              <p>{FOUR_DAY.drafts[0]}</p>
            </div>
            <div className="ap-draft latest">
              <p className="ap-eyebrow">Latest draft</p>
              <p className="line-clamp-3">{FOUR_DAY.drafts[1]}</p>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

function ScoreBars({ items }: { items: { title: string; score: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const avgLast = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const scores = items.map((i) => i.score);
  const half = Math.ceil(scores.length / 2);
  const now = avgLast(scores.slice(-half));
  const before = avgLast(scores.slice(0, half));
  const delta = now - before;
  return (
    <div className="mt-3">
      <p className="text-right text-[13px] font-semibold text-[#7a5a2e]">
        lately <b className="text-[#4a2e1a]">{now.toFixed(1)}</b>/4{" "}
        <span className="font-extrabold text-[#2f6b4f]">
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}
        </span>
      </p>
      <div className="ap-bars" role="img" aria-label={`Scores: ${items.map((i) => i.score).join(", ")} out of 4`}>
        {[4, 2, 0].map((g) => (
          <span key={g} className="ap-bars-grid" style={{ bottom: `${(g / 4) * 100}%` }}>
            <i>{g}</i>
          </span>
        ))}
        <div className="ap-bars-row">
          {items.map((it, i) => (
            <button
              key={it.title}
              type="button"
              className="ap-bar-hit"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${it.title}: ${it.score} out of 4`}
            >
              <span className={`ap-bar ${hover === i ? "hot" : ""}`} style={{ height: `${(it.score / 4) * 100}%` }} />
              {hover === i ? (
                <span className="ap-tip" role="tooltip">
                  <b>{it.score}/4</b> {it.title}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[11px] font-bold text-[#7a5a2e]">
        <span>older</span>
        <span>newest</span>
      </div>
    </div>
  );
}

/* ———————————————————————————————————————————————
   PRACTICE — practice paths + Fluency Zone (leaf lantern)
   ——————————————————————————————————————————————— */

type Stone = { name: string; state: "done" | "next" | "open" | "locked" };
type PathSet = { name: string; pre: number | null; stones: Stone[] };
type Topic = { id: string; name: string; done: number; total: number; next: string; paths: PathSet[] };

const TOPICS: Topic[] = [
  {
    id: "rootwood",
    name: "Grammar Roots",
    done: 14,
    total: 14,
    next: "Review any lesson you like",
    paths: [
      {
        name: "Grammar Roots",
        pre: 58,
        stones: [
          { name: "Nouns", state: "done" },
          { name: "Verbs", state: "done" },
          { name: "Adjectives", state: "done" },
          { name: "Adverbs", state: "done" },
          { name: "Pronouns", state: "done" },
        ],
      },
    ],
  },
  {
    id: "purpose",
    name: "Author’s Purpose",
    done: 4,
    total: 11,
    next: "Point of view",
    paths: [
      {
        name: "Why authors write",
        pre: 61,
        stones: [
          { name: "Inform", state: "done" },
          { name: "Persuade", state: "done" },
          { name: "Entertain", state: "done" },
          { name: "Point of view", state: "next" },
          { name: "Text features", state: "locked" },
        ],
      },
    ],
  },
  {
    id: "composition",
    name: "Composition",
    done: 6,
    total: 13,
    next: "Relative pronouns",
    paths: [
      {
        name: "Sentence Craft",
        pre: 52,
        stones: [
          { name: "Relative pronouns", state: "next" },
          { name: "Progressive tenses", state: "open" },
          { name: "Modal verbs", state: "open" },
          { name: "Prepositional phrases", state: "locked" },
          { name: "Fragments & run-ons", state: "locked" },
        ],
      },
      {
        name: "Linking Ideas",
        pre: null,
        stones: [
          { name: "Transition words", state: "locked" },
          { name: "Compound sentences", state: "locked" },
          { name: "Complex sentences", state: "locked" },
        ],
      },
    ],
  },
  {
    id: "comprehension",
    name: "Comprehension",
    done: 3,
    total: 12,
    next: "Main idea & details",
    paths: [
      {
        name: "Finding the big idea",
        pre: 47,
        stones: [
          { name: "Summarize", state: "done" },
          { name: "Main idea & details", state: "next" },
          { name: "Theme", state: "locked" },
          { name: "Compare texts", state: "locked" },
        ],
      },
    ],
  },
  {
    id: "genre",
    name: "Genre Grove",
    done: 5,
    total: 15,
    next: "Poetry: line breaks",
    paths: [
      {
        name: "Reading genres",
        pre: 66,
        stones: [
          { name: "Fables", state: "done" },
          { name: "Myths", state: "done" },
          { name: "Poetry: line breaks", state: "next" },
          { name: "Drama", state: "locked" },
          { name: "Biography", state: "locked" },
        ],
      },
    ],
  },
];

export function PracticePage({
  onBack,
  coins,
  onOpenClassCade,
  onEarn,
  onRevisePip,
}: {
  onBack: () => void;
  coins: CoinState;
  onOpenClassCade: () => void;
  onEarn: (e: Earning) => void;
  onRevisePip: () => void;
}) {
  const [topicId, setTopicId] = useState("composition");
  const [page, setPage] = useState(0);
  const topic = TOPICS.find((t) => t.id === topicId)!;
  const path = topic.paths[Math.min(page, topic.paths.length - 1)];
  const [started, setStarted] = useState(false);

  return (
    <PageShell
      scene="scenes/scene2.jpg"
      eyebrow="Practice · Grade 4–5"
      title="Practice"
      icon={<Feather className="size-5" />}
      onBack={onBack}
      coins={coins}
      onOpenClassCade={onOpenClassCade}
    >
      <div className="ap-grid-practice">
        <div className="grid content-start gap-4">
          <Card className="!p-0 overflow-hidden">
            <div className="ap-prac-banner">
              <div>
                <p className="ap-eyebrow light">Your practice paths</p>
                <h2 className="ap-prac-title">The Lit Labyrinth</h2>
              </div>
              <span className="ap-growth-chip">+38% avg growth</span>
            </div>
            <div className="ap-topics">
              {TOPICS.map((t) => {
                const complete = t.done === t.total;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`ap-topic ${t.id === topicId ? "on" : ""}`}
                    onClick={() => {
                      setTopicId(t.id);
                      setPage(0);
                      setStarted(false);
                    }}
                    aria-pressed={t.id === topicId}
                  >
                    <span className="flex items-center justify-between gap-1">
                      <b>{t.name}</b>
                      {complete ? <Check className="size-4 text-[#2f6b4f]" aria-label="complete" /> : null}
                    </span>
                    <span className="ap-topic-track">
                      <span
                        className={complete ? "full" : ""}
                        style={{ width: `${(t.done / t.total) * 100}%` }}
                      />
                    </span>
                    <span className="ap-topic-n">
                      {t.done}/{t.total} topics
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="ap-next">
              <span className="ap-next-n" aria-hidden="true">
                {topic.done === topic.total ? <Check className="size-4" /> : <Sparkles className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="ap-eyebrow">Next lesson</p>
                <p className="truncate text-[17px] font-extrabold">{topic.next}</p>
              </div>
              <span className="hidden text-[13px] font-semibold text-[#7a5a2e] md:block">
                Short lesson, then 3 activities
              </span>
              <button
                type="button"
                className="ap-btn ap-btn-moss"
                onClick={() => {
                  if (!started) onEarn({ label: `Started “${topic.next}”`, amount: 5 });
                  setStarted(true);
                }}
              >
                {started ? "Let’s go!" : "Start"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </Card>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="ap-h2">
                {path.name}
                <span className="ml-2 text-[15px] font-bold text-[#7a5a2e]">
                  {path.pre !== null ? <>Pre-test {path.pre}% → Post-test: not yet</> : "Opens after Sentence Craft"}
                </span>
              </h2>
              {topic.paths.length > 1 ? (
                <div className="flex items-center gap-1.5 text-[13px] font-bold">
                  <button
                    type="button"
                    className="ap-pager"
                    aria-label="Previous path"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  {page + 1} of {topic.paths.length}
                  <button
                    type="button"
                    className="ap-pager"
                    aria-label="Next path"
                    disabled={page >= topic.paths.length - 1}
                    onClick={() => setPage((p) => Math.min(topic.paths.length - 1, p + 1))}
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              ) : null}
            </div>
            <StonePath path={path} />
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <button type="button" className="ap-side-card fluency" onClick={onOpenClassCade}>
            <span className="ap-side-icon">
              <Gamepad2 className="size-7" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="ap-eyebrow light">Fluency Zone · in ClassCade</span>
              <span className="block text-[20px] font-extrabold leading-tight">Small games, big progress</span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#ffe08a]">
                <span className="ap-coin sm" aria-hidden="true" /> Double coins today
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0" aria-hidden="true" />
          </button>

          <div className="ap-side-card challenge">
            <div className="flex items-center gap-3">
              <span className="ap-side-icon pip">
                <Squirrel className="size-7" aria-hidden="true" />
              </span>
              <div>
                <p className="ap-eyebrow light">Daily challenge · Revision · Argument</p>
                <p className="text-[18px] font-extrabold leading-tight">Pip wrote something rough — can you fix it?</p>
              </div>
            </div>
            <p className="mt-2 text-[14px] font-semibold text-white/85">
              Check it against the rubric, then rewrite it stronger. It’s not yours, so revise boldly!
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="ap-earn-chip">
                <span className="ap-coin sm" aria-hidden="true" /> Earn 50 coins
              </span>
              <button type="button" className="ap-btn ap-btn-light" onClick={onRevisePip}>
                Start revising
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="ap-card ap-tipcard">
            <Lightbulb className="size-5 shrink-0 text-[#a0521d]" aria-hidden="true" />
            <p>
              <b>Your goal connects here.</b> Sentence Craft helps you write reasons that are clear and specific.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function StonePath({ path }: { path: PathSet }) {
  const all: { name: string; state: Stone["state"] | "pre" | "post"; label: string }[] = [
    { name: "Pre-test", state: "pre", label: path.pre !== null ? `${path.pre}%` : "" },
    ...path.stones.map((s, i) => ({ name: s.name, state: s.state, label: String(i + 1) })),
    { name: "Post-test", state: "post", label: "" },
  ];
  const n = all.length;
  // gentle wave so it reads as a path, not a chart
  const pts = all.map((_, i) => ({ x: 6 + (i * 88) / (n - 1), y: 50 + Math.sin(i * 1.15) * 16 }));
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
  return (
    <div className="ap-stones">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="ap-stones-line" aria-hidden="true">
        <path d={d} />
      </svg>
      {all.map((s, i) => {
        const locked = s.state === "locked" || s.state === "post";
        return (
          <div
            key={s.name}
            className={`ap-stone ${s.state}`}
            style={{ left: `${pts[i].x}%`, top: `${pts[i].y}%` }}
          >
            <span className="ap-stone-gem">
              {s.state === "done" ? (
                <Check className="size-4" aria-hidden="true" />
              ) : locked ? (
                <Lock className="size-3.5" aria-hidden="true" />
              ) : s.state === "pre" ? (
                <b>{s.label}</b>
              ) : (
                <b>{s.label}</b>
              )}
            </span>
            <span className="ap-stone-name">
              {s.name}
              {s.state === "next" ? <em>Up next</em> : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ———————————————————————————————————————————————
   TREEHOUSE — the writing journal
   ——————————————————————————————————————————————— */

export type PieceKind = "free" | "lesson" | "response";
export type Piece = {
  id: string;
  title: string;
  kind: PieceKind;
  from: string;
  date: string;
  status: "Draft" | "Revised" | "Finished" | "Challenge";
  drafts: string[];
  prompt?: string;
};

const FOUR_DAY: Piece = {
  id: "four-day",
  title: "Should our school have a four-day week?",
  kind: "response",
  from: "ECR · Argument · Mr. Verret",
  date: "Oct 1",
  status: "Revised",
  drafts: [
    "I think we should have a four day week. It would be fun. We would have more time to play. Everybody would like it. So we should do it.",
    "Dear Principal Ortiz, I believe our school should try a four-day week. First, students would come back to school rested and ready to learn. One article we read said attendance went up at schools that made the switch. Second, families would get a whole day together. When my cousin’s school changed, her family started volunteering at the food bank every Friday. A four-day week would help both learning and families, so please give it a try.",
  ],
};

export const PIECES_AT_START: Piece[] = [
  {
    id: "lanterns-out",
    title: "The Night the Lanterns Went Out",
    kind: "free",
    from: "Free write",
    date: "Oct 4",
    status: "Draft",
    drafts: [
      "Every lantern in the forest went dark at the same moment. Astra froze on the path. The fireflies stopped buzzing, and even the crystals in the cave went quiet. Then, far away, one tiny blue light blinked on. Astra took a deep breath and started walking toward it, even though his tail was shaking.",
    ],
  },
  FOUR_DAY,
  {
    id: "fridge",
    title: "How Refrigerators Changed Our Food",
    kind: "response",
    from: "SCR · Mr. Verret",
    date: "Oct 3",
    status: "Draft",
    drafts: [
      "Refrigerators changed our food because people could keep it fresh for longer. The text says, “families no longer had to shop every single day.” This shows that refrigerators saved people time and kept food from going bad.",
    ],
  },
  {
    id: "talk-animals",
    title: "If I Could Talk to Animals",
    kind: "free",
    from: "Free write · Astra’s idea",
    date: "Sep 29",
    status: "Finished",
    prompt: "If you could talk to one kind of animal, which would it be?",
    drafts: [
      "If I could talk to animals, I would talk to owls first. Owls stay up all night, so they must know every secret of the forest. I would ask them where the moon goes in the daytime and why they turn their heads so far.",
    ],
  },
  {
    id: "old-tree",
    title: "Why is the old tree special?",
    kind: "lesson",
    from: "Stellar Writers lesson",
    date: "Sep 26",
    status: "Finished",
    drafts: [
      "The old tree is special because the path starts at its roots. Lanterns hang by the door, and the bark holds the names of writers who passed.",
    ],
  },
  {
    id: "robot",
    title: "Robot at School",
    kind: "free",
    from: "Free write · Astra’s idea",
    date: "Sep 24",
    status: "Revised",
    prompt: "A robot joins your class. What happens during the day?",
    drafts: [
      "A robot came to school. It was cool. It did math fast.",
      "On Monday a robot named Bolt rolled into our class. At first everybody stared, but then Bolt solved the hardest math problem on the board in two seconds. By lunch, he was teaching us a dance that he learned from the internet.",
    ],
  },
  {
    id: "one-thought",
    title: "One complete thought",
    kind: "lesson",
    from: "Stellar Writers lesson",
    date: "Sep 19",
    status: "Finished",
    drafts: ["A sentence holds one idea. The fox waited on the stone until the lantern was lit."],
  },
];

const IDEAS = [
  "You find a tiny door at the bottom of a tree. What’s behind it?",
  "Write about a day when everything went backwards.",
  "Your shadow decides to go on an adventure without you.",
  "Describe the best meal you ever ate so a reader can taste it.",
  "A crystal in the cave starts humming your favorite song. What happens next?",
];

const STARTERS = [
  "At first, …",
  "Suddenly, …",
  "I will never forget the time …",
  "The most important reason is …",
  "For example, …",
];

const words = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

export type TreehouseRoute = { mode: "shelf" } | { mode: "piece"; id: string } | { mode: "write"; id?: string; idea?: boolean };

export function TreehousePage({
  route,
  go,
  pieces,
  onSave,
  onBack,
  coins,
  onOpenClassCade,
}: {
  route: TreehouseRoute;
  go: (r: TreehouseRoute) => void;
  pieces: Piece[];
  onSave: (piece: Piece, isNewDraft: boolean) => void;
  onBack: () => void;
  coins: CoinState;
  onOpenClassCade: () => void;
}) {
  return (
    <PageShell
      scene="scenes/scene3.jpg"
      eyebrow="Your space"
      title="Treehouse"
      icon={<BookOpen className="size-5" />}
      onBack={onBack}
      coins={coins}
      onOpenClassCade={onOpenClassCade}
    >
      {route.mode === "shelf" ? <Shelf pieces={pieces} go={go} /> : null}
      {route.mode === "piece" ? <PieceView piece={pieces.find((p) => p.id === route.id)} go={go} /> : null}
      {route.mode === "write" ? (
        <Writer
          key={`${route.id ?? "new"}-${route.idea ? "i" : ""}`}
          piece={route.id ? pieces.find((p) => p.id === route.id) : undefined}
          startWithIdea={Boolean(route.idea)}
          go={go}
          onSave={onSave}
        />
      ) : null}
    </PageShell>
  );
}

type ShelfTab = "all" | PieceKind;

function Shelf({ pieces, go }: { pieces: Piece[]; go: (r: TreehouseRoute) => void }) {
  const [tab, setTab] = useState<ShelfTab>("all");
  const shown = pieces.filter((p) => tab === "all" || p.kind === tab);
  const keepGoing = pieces.find((p) => p.status === "Draft" && p.kind === "free");
  const count = (k: ShelfTab) => pieces.filter((p) => k === "all" || p.kind === k).length;

  return (
    <div className="ap-grid-tree">
      <div className="grid content-start gap-4">
        <div className="ap-card ap-astra-card">
          <img src={asset("astra-guide.jpg")} alt="Astra waving on the treehouse stairs" className="ap-astra-img" />
          <div className="ap-astra-say">
            <p className="ap-eyebrow">Astra</p>
            <p>Your page, your rules. Write anything you want!</p>
          </div>
          <div className="grid gap-2 p-4 pt-1">
            <button type="button" className="ap-btn ap-btn-moss ap-btn-lg" onClick={() => go({ mode: "write" })}>
              <PenLine className="size-5" aria-hidden="true" />
              New free write
            </button>
            <button type="button" className="ap-btn ap-btn-ghost" onClick={() => go({ mode: "write", idea: true })}>
              <Lightbulb className="size-4" aria-hidden="true" />
              Give me an idea
            </button>
          </div>
        </div>
        {keepGoing ? (
          <button type="button" className="ap-card ap-keep" onClick={() => go({ mode: "write", id: keepGoing.id })}>
            <p className="ap-eyebrow">Keep going</p>
            <p className="text-[16px] font-extrabold leading-tight">{keepGoing.title}</p>
            <p className="mt-1 text-[13px] font-semibold text-[#7a5a2e]">
              Draft · {words(keepGoing.drafts[keepGoing.drafts.length - 1])} words so far
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[14px] font-extrabold text-[#2f6b4f]">
              Pick up where you left off <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </button>
        ) : null}
      </div>

      <section className="ap-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="ap-h2">
            <BookOpen className="size-5 text-[#a0521d]" aria-hidden="true" />
            My journal
          </h2>
          <Seg
            label="Show"
            value={tab}
            onChange={setTab}
            options={[
              { id: "all", label: `All ${count("all")}` },
              { id: "free", label: `Free writes ${count("free")}` },
              { id: "lesson", label: `Lessons ${count("lesson")}` },
              { id: "response", label: `SCR & ECR ${count("response")}` },
            ]}
          />
        </div>
        <ul className="ap-pieces">
          {shown.map((p) => {
            const latest = p.drafts[p.drafts.length - 1];
            return (
              <li key={p.id}>
                <button type="button" className="ap-piece" onClick={() => go({ mode: "piece", id: p.id })}>
                  <span className="flex items-center justify-between gap-2">
                    <span className={`ap-kind ${p.kind}`}>{p.kind === "free" ? "Free write" : p.kind === "lesson" ? "Lesson" : p.from.split(" · ")[0]}</span>
                    <span className={`ap-status ${p.status.toLowerCase()}`}>{p.status}</span>
                  </span>
                  <span className="ap-piece-title">{p.title}</span>
                  <span className="ap-piece-preview">{latest}</span>
                  <span className="ap-piece-meta">
                    {p.date} · {words(latest)} words
                    {p.drafts.length > 1 ? ` · ${p.drafts.length} drafts` : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function PieceView({ piece, go }: { piece?: Piece; go: (r: TreehouseRoute) => void }) {
  const [draft, setDraft] = useState(piece ? piece.drafts.length - 1 : 0);
  if (!piece) {
    return (
      <div className="ap-card mx-auto max-w-xl">
        <p>That piece isn’t on the shelf.</p>
        <button type="button" className="ap-btn ap-btn-ghost mt-3" onClick={() => go({ mode: "shelf" })}>
          Back to my journal
        </button>
      </div>
    );
  }
  return (
    <div className="ap-reader">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" className="ap-link" onClick={() => go({ mode: "shelf" })}>
          <ArrowLeft className="size-4" aria-hidden="true" /> My journal
        </button>
        {piece.drafts.length > 1 ? (
          <Seg
            label="Draft"
            value={String(draft)}
            onChange={(v) => setDraft(Number(v))}
            options={piece.drafts.map((_, i) => ({ id: String(i), label: i === piece.drafts.length - 1 ? `Draft ${i + 1} · latest` : `Draft ${i + 1}` }))}
          />
        ) : null}
      </div>
      <article className="ap-paper">
        <p className="ap-eyebrow">
          {piece.from} · {piece.date} · <span className={`ap-status inline ${piece.status.toLowerCase()}`}>{piece.status}</span>
        </p>
        <h2 className="ap-paper-title">{piece.title}</h2>
        {piece.prompt ? <p className="ap-paper-prompt">Prompt: {piece.prompt}</p> : null}
        <p className="ap-paper-body">{piece.drafts[draft]}</p>
        <p className="mt-4 text-[13px] font-bold text-[#7a5a2e]">{words(piece.drafts[draft])} words</p>
      </article>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="ap-btn ap-btn-moss" onClick={() => go({ mode: "write", id: piece.id })}>
          <PenLine className="size-4" aria-hidden="true" />
          {piece.status === "Draft" ? "Keep writing" : "Revise it"}
        </button>
        <button type="button" className="ap-btn ap-btn-ghost" onClick={() => go({ mode: "shelf" })}>
          Back to my journal
        </button>
      </div>
    </div>
  );
}

function Writer({
  piece,
  startWithIdea,
  go,
  onSave,
}: {
  piece?: Piece;
  startWithIdea: boolean;
  go: (r: TreehouseRoute) => void;
  onSave: (piece: Piece, isNewDraft: boolean) => void;
}) {
  const latest = piece ? piece.drafts[piece.drafts.length - 1] : "";
  const [title, setTitle] = useState(piece?.title ?? "");
  const [text, setText] = useState(latest);
  const [ideaIdx, setIdeaIdx] = useState(() => Math.floor(Math.random() * IDEAS.length));
  const [prompt, setPrompt] = useState<string | undefined>(piece?.prompt ?? (startWithIdea ? IDEAS[ideaIdx] : undefined));
  const [stuck, setStuck] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const n = words(text);
  // feather fills toward a cozy ~120 words, then keeps glowing — no target shown
  const fill = Math.min(1, n / 120);
  const revising = Boolean(piece && piece.status !== "Draft");
  const reward = piece?.status === "Challenge" ? 50 : revising ? 15 : 5;

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  const nextIdea = () => {
    const i = (ideaIdx + 1) % IDEAS.length;
    setIdeaIdx(i);
    setPrompt(IDEAS[i]);
  };

  const addStarter = (s: string) => {
    const base = text.trimEnd();
    setText(base + (base ? " " : "") + s.replace("…", "").trimEnd() + " ");
    setStuck(false);
    window.setTimeout(() => area.current?.focus(), 0);
  };

  const save = () => {
    const changed = text.trim() !== latest.trim();
    const fromPrompt = (q: string) => {
      const first = q.split(/[.?!]/)[0];
      if (first.length <= 48) return first;
      return first.slice(0, 48).replace(/\s+\S*$/, "") + "…";
    };
    const finalTitle = title.trim() || (prompt ? fromPrompt(prompt) : "Untitled free write");
    if (piece) {
      const newDraft = revising && changed;
      const drafts = newDraft ? [...piece.drafts, text.trim()] : [...piece.drafts.slice(0, -1), text.trim()];
      onSave({ ...piece, title: finalTitle, drafts, status: newDraft ? "Revised" : piece.status }, newDraft);
    } else {
      onSave(
        {
          id: `free-${Date.now()}`,
          title: finalTitle,
          kind: "free",
          from: prompt ? "Free write · Astra’s idea" : "Free write",
          date: "Today",
          status: "Draft",
          prompt,
          drafts: [text.trim()],
        },
        false,
      );
    }
  };

  return (
    <div className="ap-writer">
      <div className="ap-writer-main">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" className="ap-link" onClick={() => go(piece ? { mode: "piece", id: piece.id } : { mode: "shelf" })}>
            <ArrowLeft className="size-4" aria-hidden="true" /> {piece ? "Back to this piece" : "My journal"}
          </button>
          <span className="ap-eyebrow">
            {piece ? (revising ? `Revising · this will be draft ${piece.drafts.length + 1}` : "Keep writing") : "New free write"}
          </span>
        </div>

        {prompt ? (
          <div className="ap-idea">
            <Lightbulb className="size-5 shrink-0 text-[#a0521d]" aria-hidden="true" />
            <p className="min-w-0 flex-1">{prompt}</p>
            {!piece ? (
              <button type="button" className="ap-link" onClick={nextIdea}>
                Another idea
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="ap-paper writing">
          <input
            className="ap-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give it a title (or skip it)"
            aria-label="Title"
          />
          <textarea
            ref={area}
            className="ap-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={prompt ? "Start writing here…" : "Write anything — a story, a thought, a list, a letter…"}
            aria-label="Your writing"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" className="ap-btn ap-btn-moss ap-btn-lg" disabled={!text.trim()} onClick={save}>
            <Check className="size-5" aria-hidden="true" />
            Save to my journal
            <span className="ap-earn-chip on-dark">
              <span className="ap-coin sm" aria-hidden="true" />+{reward}
            </span>
          </button>
          {!prompt && !piece ? (
            <button type="button" className="ap-btn ap-btn-ghost" onClick={nextIdea}>
              <Lightbulb className="size-4" aria-hidden="true" />
              Give me an idea
            </button>
          ) : null}
        </div>
      </div>

      <aside className="grid content-start gap-3">
        <div className="ap-card ap-feather" aria-label={`${n} words`}>
          <svg viewBox="0 0 40 120" className="ap-feather-svg" aria-hidden="true">
            <defs>
              <linearGradient id="apFeatherFill" x1="0" y1="1" x2="0" y2="0">
                <stop offset={fill} stopColor="#7fd0ff" />
                <stop offset={fill} stopColor="#e9dfcc" />
              </linearGradient>
            </defs>
            <path
              d="M20 4c12 10 16 32 12 56-3 18-8 34-12 46-4-12-9-28-12-46C4 36 8 14 20 4z"
              fill="url(#apFeatherFill)"
              stroke="#8a5a2e"
              strokeWidth="1.5"
            />
            <path d="M20 10v104" stroke="#8a5a2e" strokeWidth="1.4" />
          </svg>
          <div>
            <p className="text-[26px] font-extrabold leading-none">{n}</p>
            <p className="text-[13px] font-bold text-[#7a5a2e]">words</p>
            <p className="mt-2 text-[13px] font-semibold">{n === 0 ? "Your feather fills as you write." : n < 120 ? "Keep going — the feather is filling!" : "Your feather is glowing. Nice!"}</p>
          </div>
        </div>

        <div className="ap-card">
          <button type="button" className="ap-btn ap-btn-ghost w-full" aria-expanded={stuck} onClick={() => setStuck((v) => !v)}>
            <Sparkles className="size-4" aria-hidden="true" />
            Stuck? Ask Astra
          </button>
          {stuck ? (
            <div className="mt-2">
              <p className="text-[13px] font-bold text-[#7a5a2e]">Tap one to add it to your writing:</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {STARTERS.map((s) => (
                  <button key={s} type="button" className="ap-starter" onClick={() => addStarter(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="ap-card ap-tipcard">
          <Compass className="size-5 shrink-0 text-[#a0521d]" aria-hidden="true" />
          <p>
            <b>My goal:</b> {MY_GOAL}
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ———————————————————————————————————————————————
   ClassCade hand-off (placeholder until the real link is wired)
   ——————————————————————————————————————————————— */

export function ClassCadeNote({ onClose }: { onClose: () => void }) {
  return (
    <div className="ap-modal-wrap" role="dialog" aria-label="ClassCade" onClick={onClose}>
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <span className="ap-side-icon mx-auto">
          <Gamepad2 className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-2 text-center text-[22px] font-extrabold">Off to ClassCade!</h2>
        <p className="mt-1 text-center text-[15px] font-semibold text-[#7a5a2e]">
          In the real product this opens ClassCade with your coins ready to spend. Your pouch comes with you.
        </p>
        <button type="button" className="ap-btn ap-btn-moss mx-auto mt-4 flex" onClick={onClose}>
          Back to Astra
        </button>
      </div>
    </div>
  );
}

export function useWritingStats(pieces: Piece[]) {
  return useMemo(
    () => ({
      revisions: 4 + pieces.reduce((n, p) => n + Math.max(0, p.drafts.length - 1), 0),
      finished: pieces.filter((p) => p.status !== "Draft").length,
    }),
    [pieces],
  );
}
