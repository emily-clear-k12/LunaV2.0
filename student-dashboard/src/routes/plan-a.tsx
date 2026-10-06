import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useState } from "react";
import {
  COINS_AT_START,
  ClassCadeNote,
  GrowthPage,
  PIECES_AT_START,
  Pouch,
  PracticePage,
  TreehousePage,
  useWritingStats,
  type CoinState,
  type Earning,
  type Piece,
  type TreehouseRoute,
} from "./plan-a-pages";

export const Route = createFileRoute("/")({ component: StudentHome });

type Lesson = { title: string; world: string; minutes: number; task: string };

type Module = {
  id: string;
  n: number;
  name: string;
  short: string;
  world: string;
  blurb: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Top of the name tag + lesson-dot stack, just under the glowing ring (frame-%). */
  tagY: number;
  accent: string;
  lessons: Lesson[];
};


type Lantern = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Center of the wooden plaque under the lantern (frame-%); x = lantern body center */
  signX: number;
  signY: number;
};

const CLASS_FOCUS = "Today, let's back every answer with evidence from the text!";

/** Demo mastery seeds — not live student data. */
const DEMO_DONE: Record<string, string[]> = {
  scr: ["Answer the ask", "Cite the text", "Explain the link"],
  ecr: ["Claim the sky"],
  sentences: ["One complete thought", "Who did what"],
};

const modules: Module[] = [
  {
    id: "scr",
    n: 1,
    name: "SCR",
    short: "SCR",
    world: "Crystal Caverns",
    blurb: "Short constructed responses with clear evidence.",
    x: 25.9,
    y: 60,
    w: 11,
    h: 28,
    tagY: 79.8,
    accent: "#4aa3ff",
    lessons: [
      { title: "Answer the ask", world: "First crystals", minutes: 20, task: "Write a short answer that restates the question." },
      { title: "Cite the text", world: "Glow caves", minutes: 20, task: "Add one piece of evidence from the passage." },
      { title: "Explain the link", world: "Deep vault", minutes: 20, task: "Tell how your evidence proves your answer." },
    ],
  },
  {
    id: "ecr",
    n: 2,
    name: "ECR",
    short: "ECR",
    world: "Sky Harbor",
    blurb: "Extended responses that build a full argument.",
    x: 38.8,
    y: 60,
    w: 11,
    h: 28,
    tagY: 79.8,
    accent: "#7cc8ff",
    lessons: [
      { title: "Claim the sky", world: "Docking ring", minutes: 20, task: "Write a clear claim for a longer response." },
      { title: "Stack reasons", world: "Airship deck", minutes: 25, task: "Order three reasons that support your claim." },
      { title: "Land the ending", world: "Cloud dock", minutes: 20, task: "Close with a conclusion that ties the reasons together." },
    ],
  },
  {
    id: "sentences",
    n: 3,
    name: "Stellar Writers",
    short: "Stellar",
    world: "Starfall Meadow",
    blurb: "Sentences that hold one clear idea.",
    x: 51.5,
    y: 60,
    w: 11,
    h: 28,
    tagY: 79.8,
    accent: "#b46bff",
    lessons: [
      { title: "One complete thought", world: "First stones", minutes: 20, task: "Write three sentences that each say one whole idea." },
      { title: "Who did what", world: "Root bridge", minutes: 20, task: "Mark the who and the what in each sentence." },
      { title: "Join two ideas", world: "Twin trunks", minutes: 20, task: "Combine two short sentences without losing either idea." },
    ],
  },
  {
    id: "plan",
    n: 4,
    name: "The Writing Process",
    short: "Process",
    world: "Ember Forge",
    blurb: "Read the prompt, take notes, make a plan.",
    x: 64.5,
    y: 60,
    w: 11,
    h: 28,
    tagY: 79.8,
    accent: "#ff9a3c",
    lessons: [
      { title: "Read the prompt", world: "White trunks", minutes: 15, task: "Underline what the prompt is asking you to do." },
      { title: "Gather notes", world: "Lantern circle", minutes: 20, task: "List the facts you will use before you draft." },
      { title: "Order the plan", world: "Grove gate", minutes: 20, task: "Put your notes in the order a reader needs." },
    ],
  },
  {
    id: "revise",
    n: 5,
    name: "Revision",
    short: "Revision",
    world: "Sunken Library",
    blurb: "Make the draft clearer and stronger.",
    x: 78.1,
    y: 60,
    w: 11,
    h: 28,
    tagY: 79.8,
    accent: "#2fd6c8",
    lessons: [
      { title: "Name the idea", world: "Lookout", minutes: 15, task: "Say what the draft is really about, in one line." },
      { title: "Add what’s missing", world: "Switchback", minutes: 20, task: "Find a claim with no support and add it." },
      { title: "Cut what wanders", world: "Cliff path", minutes: 20, task: "Remove a sentence that does not help the idea." },
    ],
  },
  {
    id: "edit",
    n: 6,
    name: "Edit",
    short: "Edit",
    world: "Coral Cove",
    blurb: "Polish conventions until the writing is clear.",
    x: 92.3,
    y: 60,
    w: 11,
    h: 28,
    tagY: 82.9,
    accent: "#ff6fa8",
    lessons: [
      { title: "Capitals and stops", world: "Fallen leaves", minutes: 15, task: "Fix sentences that start or end the wrong way." },
      { title: "Spelling that counts", world: "Red maples", minutes: 20, task: "Correct the words a reader would stumble on." },
      { title: "Read it through", world: "Last lantern", minutes: 15, task: "Read aloud and mark anything that still snags." },
    ],
  },
];

/* Centered on the tree trunk / treehouse tower in portal-hub-z.jpg (trunk spans ~576-768 of
   1280 between the sky gaps at rows 300-340; tower window ~673) — not the frame center. */
const treehouseSpot = { x: 52.6, y: 42, w: 13, h: 26 };
const astraSpot = { x: 9.5, y: 58, w: 13, h: 38 };
/** Thought bubble: top-left corner in frame-%, in the sky right of Astra's right ear. */
const thinkSpot = { x: 19.5, y: 25.8 };

/** Two interactive lanterns (crystal = My growth, leaf = Practice); the compass and
    feather lanterns stay decorative. */
/* Measured on portal-hub-z.jpg (1280x776): body centers compass 398, crystal 489,
   feather 813, leaf 960; the wooden plaque hangs directly under each body. */
const lanterns: Lantern[] = [
  { id: "growth", label: "My growth", x: 38.2, y: 30.3, w: 5.5, h: 18, signX: 38.2, signY: 41.9 },
  { id: "practice", label: "Practice", x: 75.0, y: 34.1, w: 5.5, h: 16, signX: 75.0, signY: 42.3 },
];

/** Astra’s pouch sits on the ground beside his right shoe (frame-%). */
const pouchSpot = { x: 20.6, y: 85.2 };

type View =
  | { page: "hub" }
  | { page: "growth" }
  | { page: "practice" }
  | { page: "treehouse"; route: TreehouseRoute };

function parseHash(hash: string): View {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "growth") return { page: "growth" };
  if (parts[0] === "practice") return { page: "practice" };
  if (parts[0] === "treehouse") {
    if (parts[1] === "write") return { page: "treehouse", route: { mode: "write", id: parts[2], idea: parts[2] === "idea" ? true : undefined } };
    if (parts[1] === "piece" && parts[2]) return { page: "treehouse", route: { mode: "piece", id: parts[2] } };
    return { page: "treehouse", route: { mode: "shelf" } };
  }
  return { page: "hub" };
}

function viewHash(v: View): string {
  if (v.page === "hub") return "";
  if (v.page !== "treehouse") return `#${v.page}`;
  const r = v.route;
  if (r.mode === "piece") return `#treehouse/piece/${r.id}`;
  if (r.mode === "write") return r.idea ? "#treehouse/write/idea" : r.id ? `#treehouse/write/${r.id}` : "#treehouse/write";
  return "#treehouse";
}

const PIP_PIECE: Piece = {
  id: "pip-challenge",
  title: "Pip’s rough draft: Should recess be longer?",
  kind: "lesson",
  from: "Daily challenge · Pip’s draft",
  date: "Today",
  status: "Challenge",
  prompt: "Pip wrote this. Make the reasons strong and specific, then add a real ending.",
  drafts: ["Recess should be longer. Recess is good. We like it alot. it is fun and we get to play. So recess should be longer"],
};

const assignments = [
  {
    title: "How Refrigerators Changed Our Food",
    kind: "ECR",
    format: "Argument",
    teacher: "Mr. Verret",
    due: "Due tomorrow",
    action: "Begin",
    moduleId: "scr",
    lesson: "Cite the text",
    current: true,
  },
  {
    title: "Should recess be longer?",
    kind: "ECR",
    format: "Argument",
    teacher: "Mr. Nowitski",
    due: "Due Jul 4",
    action: "Continue",
    moduleId: "scr",
    lesson: "Explain the link",
    current: false,
  },
  {
    title: "The Brave Little Girl of 1776",
    kind: "SCR",
    format: "Narrative",
    teacher: "Mr. Prescott",
    due: "Due Jul 6",
    action: "Begin",
    moduleId: "scr",
    lesson: "Answer the ask",
    current: false,
  },
];

const badges = [
  { id: "scr", label: "SCR", name: "Short responses", moduleId: "scr" },
  { id: "ecr", label: "ECR", name: "Extended responses", moduleId: "ecr" },
  { id: "stellar", label: "Stellar", name: "Stellar Writers", moduleId: "sentences" },
  { id: "process", label: "Process", name: "The writing process", moduleId: "plan" },
  { id: "revision", label: "Revision", name: "Revision", moduleId: "revise" },
  { id: "editing", label: "Editing", name: "Edit", moduleId: "edit" },
];

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;

function StudentHome() {
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, string[]>>(DEMO_DONE);
  const [shelfOpen, setShelfOpen] = useState(false);
  const [writeTitle, setWriteTitle] = useState<string | null>(null);
  const [ecrNote, setEcrNote] = useState(false);
  const [pieces, setPieces] = useState<Piece[]>(PIECES_AT_START);
  const [coins, setCoins] = useState<CoinState>(COINS_AT_START);
  const [tipOpen, setTipOpen] = useState(true);
  const [view, setView] = useState<View>(() => parseHash(window.location.hash));
  const [glow, setGlow] = useState<{ x: number; y: number } | null>(null);
  const [cade, setCade] = useState(false);
  const stats = useWritingStats(pieces);

  const focused = modules.find((mod) => mod.id === moduleId) ?? null;
  const lesson = focused?.lessons.find((item) => item.title === lessonTitle) ?? null;
  const focus = focused;
  const overlayOpen = Boolean(focus);

  useEffect(() => {
    const onHash = () => setView(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!tipOpen) return;
    const id = window.setTimeout(() => setTipOpen(false), 6000);
    return () => window.clearTimeout(id);
  }, [tipOpen]);

  function navigate(next: View) {
    const hash = viewHash(next);
    if (hash !== window.location.hash) {
      history.pushState(null, "", hash || window.location.pathname + window.location.search);
    }
    setView(next);
    window.scrollTo(0, 0);
  }

  /** Lantern / treehouse light swells to fill the screen, then the new page fades in. */
  function enter(next: View, from: { x: number; y: number }) {
    setGlow(from);
    window.setTimeout(() => {
      navigate(next);
      window.setTimeout(() => setGlow(null), 380);
    }, 420);
  }

  function earn(e: Earning) {
    setCoins((c) => ({ coins: c.coins + e.amount, recent: [e, ...c.recent].slice(0, 6), pulse: c.pulse + 1 }));
  }

  function mastered(id: string) {
    const mod = modules.find((item) => item.id === id);
    if (!mod) return false;
    const finished = done[id] ?? [];
    return mod.lessons.every((item) => finished.includes(item.title));
  }

  function lessonDone(modId: string, title: string) {
    return (done[modId] ?? []).includes(title);
  }

  function openModule(id: string, lessonName?: string, assignmentTitle?: string) {
    setModuleId(id || null);
    setLessonTitle(lessonName ?? null);
    setWriteTitle(assignmentTitle ?? null);
    setShelfOpen(false);
  }

  function backToHub() {
    setModuleId(null);
    setLessonTitle(null);
    setWriteTitle(null);
  }

  function markDone(moduleKey: string, title: string) {
    setDone((current) => {
      const list = current[moduleKey] ?? [];
      if (list.includes(title)) return current;
      return { ...current, [moduleKey]: [...list, title] };
    });
    const mod = modules.find((item) => item.id === moduleKey);
    setPieces((current) => {
      if (current.some((item) => item.title === title)) return current;
      return [
        {
          id: `lesson-${moduleKey}-${current.length}`,
          title,
          kind: "lesson",
          from: `${mod ? mod.name : "Astra"} lesson`,
          date: "Today",
          status: "Finished",
          drafts: [mod?.lessons.find((l) => l.title === title)?.task ?? "Saved in your Treehouse."],
        },
        ...current,
      ];
    });
    earn({ label: `Finished “${title}”`, amount: 10 });
  }

  function onLantern(lan: Lantern) {
    enter({ page: lan.id === "growth" ? "growth" : "practice" }, { x: lan.x, y: lan.y });
  }

  function savePiece(piece: Piece, isNewDraft: boolean) {
    const exists = pieces.some((p) => p.id === piece.id);
    setPieces((current) => (exists ? current.map((p) => (p.id === piece.id ? piece : p)) : [piece, ...current]));
    if (piece.id === PIP_PIECE.id && isNewDraft) earn({ label: "Daily challenge · fixed Pip’s draft", amount: 50 });
    else if (isNewDraft) earn({ label: `Revised “${piece.title}”`, amount: 15 });
    else earn({ label: exists ? `Kept writing “${piece.title}”` : `Free write · “${piece.title}”`, amount: 5 });
    navigate({ page: "treehouse", route: { mode: "piece", id: piece.id } });
  }

  function revisePip() {
    setPieces((current) => (current.some((p) => p.id === PIP_PIECE.id) ? current : [PIP_PIECE, ...current]));
    navigate({ page: "treehouse", route: { mode: "write", id: PIP_PIECE.id } });
  }

  const toHub = () => navigate({ page: "hub" });
  const openCade = () => setCade(true);

  if (view.page !== "hub") {
    return (
      <div className="ap-fade-in">
        {view.page === "growth" ? (
          <GrowthPage
            onBack={toHub}
            coins={coins}
            onOpenClassCade={openCade}
            stats={stats}
            onPractice={() => navigate({ page: "practice" })}
            onOpenPiece={(id) => navigate({ page: "treehouse", route: { mode: "piece", id } })}
          />
        ) : null}
        {view.page === "practice" ? (
          <PracticePage onBack={toHub} coins={coins} onOpenClassCade={openCade} onEarn={earn} onRevisePip={revisePip} />
        ) : null}
        {view.page === "treehouse" ? (
          <TreehousePage
            route={view.route}
            go={(route) => navigate({ page: "treehouse", route })}
            pieces={pieces}
            onSave={savePiece}
            onBack={toHub}
            coins={coins}
            onOpenClassCade={openCade}
          />
        ) : null}
        {cade ? <ClassCadeNote onClose={() => setCade(false)} /> : null}
      </div>
    );
  }

  return (
    <div className="plana-stage flex h-dvh w-full flex-col overflow-hidden">
      <div className="relative min-h-0 w-full min-w-0 flex-1 overflow-hidden">
          <h1 className="z-sky-title">✦ Astra’s Writing Adventure ✦</h1>
          {overlayOpen ? (
            <button
              type="button"
              onClick={backToHub}
              className="z-back-btn"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to portals
            </button>
          ) : (
            <div className="z-mastery-pill" aria-label="Your mastery">
              {badges.map((badge) => {
                const active =
                  badge.id === "scr" ||
                  (badge.moduleId ? mastered(badge.moduleId) : false);
                const src = asset(`badges/${badge.id}-${active ? "active" : "inactive"}.png`);
                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => {
                      if (badge.moduleId) {
                        setEcrNote(false);
                        openModule(badge.moduleId);
                      } else {
                        setEcrNote(true);
                      }
                    }}
                    aria-current={active ? "true" : undefined}
                    title={badge.name}
                    className="z-mastery-btn"
                  >
                    <img src={src} alt="" />
                  </button>
                );
              })}
            </div>
          )}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out"
              style={{
                transformOrigin: focused ? `${focused.x}% ${focused.y}%` : "50% 45%",
                transform: focus ? "scale(1.85)" : "scale(1)",
              }}
            >
              <div className="zscene">
                <div className="zscene-frame">
                  <img
                    src={asset("portal-hub-z.jpg")}
                    alt="Astra beside six magical portals under a lantern treehouse"
                    className="zscene-img"
                  />

                  {/* Astra tip bubble; after it collapses (~6s) a thought bubble invites a re-open */}
                  {tipOpen ? (
                    <button
                      type="button"
                      className="z-tip"
                      onClick={() => setTipOpen(false)}
                      aria-label="Astra’s tip. Tap to dismiss."
                    >
                      <span className="z-tip-k">✦ Astra’s tip</span>
                      <span className="z-tip-t">{CLASS_FOCUS}</span>
                    </button>
                  ) : !focus ? (
                    <button
                      type="button"
                      className="z-think"
                      style={{ left: `${thinkSpot.x}%`, top: `${thinkSpot.y}%` }}
                      onClick={() => setTipOpen(true)}
                      aria-label="Astra has a thought. Show Astra’s tip"
                      title="Astra has a thought"
                    >
                      <svg viewBox="0 0 52 54" aria-hidden="true">
                        <circle className="z-think-trail t2" cx="6" cy="48" r="2.6" />
                        <circle className="z-think-trail t1" cx="12.5" cy="40" r="4" />
                        <path
                          className="z-think-cloud"
                          d="M20 34c-6.5 0-8.6-6.7-4.4-9.6-2.6-5.6 3-10.6 8-8.3 1.6-6 10.6-7.2 13.8-1.8 4.6-3 11.4.6 10.2 6.2 4.4 2.4 3 9.8-3.2 9.6-1.6 4.8-9.4 5.8-12.4 2-3.6 4-10.8 3.6-12-1.1z"
                        />
                        <circle className="z-think-dot d1" cx="25.5" cy="24.6" r="2.3" />
                        <circle className="z-think-dot d2" cx="32" cy="24.6" r="2.3" />
                        <circle className="z-think-dot d3" cx="38.5" cy="24.6" r="2.3" />
                      </svg>
                    </button>
                  ) : null}

                  <button
                    type="button"
                    className={
                      "z-hotspot z-astra absolute -translate-x-1/2 -translate-y-1/2 " +
                      (focus ? "pointer-events-none opacity-0" : "")
                    }
                    style={{
                      left: `${astraSpot.x}%`,
                      top: `${astraSpot.y}%`,
                      width: `${astraSpot.w}%`,
                      height: `${astraSpot.h}%`,
                    }}
                    onClick={() => setTipOpen(true)}
                    aria-label="Astra, show tip"
                  />

                  {modules.map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => openModule(mod.id)}
                      aria-label={`Module ${mod.n}, ${mod.name}, ${mod.world}`}
                      className={
                        "z-hotspot z-portal absolute -translate-x-1/2 -translate-y-1/2 " +
                        (focus ? "pointer-events-none opacity-0" : "")
                      }
                      style={{
                        left: `${mod.x}%`,
                        top: `${mod.y}%`,
                        width: `${mod.w}%`,
                        height: `${mod.h}%`,
                        ["--z-accent" as string]: mod.accent,
                      }}
                    >
                      <span className="z-ring" aria-hidden="true" />
                    </button>
                  ))}

                  {/* Portal name (world + topic) sitting right above its lesson crystal dots,
                      just under the glowing ring — demo mastery via DEMO_DONE */}
                  {!focus
                    ? modules.map((mod) => (
                        <div
                          key={`tag-${mod.id}`}
                          className="z-portal-tag"
                          style={{ left: `${mod.x}%`, top: `${mod.tagY}%` }}
                          aria-hidden="true"
                        >
                          <span className="z-portal-name">
                            <span className="z-portal-world">{mod.world}</span>
                            <span className="z-portal-topic">{mod.short}</span>
                          </span>
                          <span className="z-dots">
                            {mod.lessons.map((item) => {
                              const lit = lessonDone(mod.id, item.title);
                              return (
                                <i
                                  key={item.title}
                                  className={lit ? "lit" : undefined}
                                  style={
                                    lit
                                      ? {
                                          background: mod.accent,
                                          boxShadow: `0 0 8px ${mod.accent}`,
                                        }
                                      : undefined
                                  }
                                />
                              );
                            })}
                          </span>
                        </div>
                      ))
                    : null}

                  {lanterns.map((lan) => (
                    <button
                      key={lan.id}
                      type="button"
                      onClick={() => onLantern(lan)}
                      aria-label={lan.label}
                      className={
                        "z-hotspot z-lantern absolute -translate-x-1/2 -translate-y-1/2 " +
                        (focus ? "pointer-events-none opacity-0" : "")
                      }
                      style={{
                        left: `${lan.x}%`,
                        top: `${lan.y}%`,
                        width: `${lan.w}%`,
                        height: `${lan.h}%`,
                      }}
                    >
                      <span className="z-ring warm" aria-hidden="true" />
                    </button>
                  ))}

                  {!focus
                    ? lanterns.map((lan) => (
                        <span
                          key={`${lan.id}-sign`}
                          className="z-lantern-tag"
                          style={{ left: `${lan.signX}%`, top: `${lan.signY}%` }}
                        >
                          {lan.label}
                        </span>
                      ))
                    : null}

                  <button
                    type="button"
                    onClick={() =>
                      enter({ page: "treehouse", route: { mode: "shelf" } }, { x: treehouseSpot.x, y: treehouseSpot.y })
                    }
                    aria-label="Treehouse, your writing space"
                    className={
                      "z-hotspot z-tree absolute -translate-x-1/2 -translate-y-1/2 " +
                      (focus ? "pointer-events-none opacity-0" : "")
                    }
                    style={{
                      left: `${treehouseSpot.x}%`,
                      top: `${treehouseSpot.y}%`,
                      width: `${treehouseSpot.w}%`,
                      height: `${treehouseSpot.h}%`,
                    }}
                  >
                    <span className="z-ring warm" aria-hidden="true" />
                    <span className="z-plate tree">
                      <span className="z-plate-mod">Your space</span>
                      <span className="z-plate-world">Treehouse</span>
                    </span>
                  </button>

                  {!focus ? (
                    <div className="ap-pouch-anchor" style={{ left: `${pouchSpot.x}%`, top: `${pouchSpot.y}%` }}>
                      <Pouch state={coins} variant="hub" onOpenClassCade={openCade} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {focused && !lesson ? (
            <section className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 sm:px-6 sm:pb-5">
              <div className="mx-auto max-w-3xl rounded-3xl bg-cream/95 p-4 text-ink shadow-2xl sm:p-5">
                <p className="text-sm font-bold text-lantern">
                  Module {focused.n} · {focused.world}
                  {mastered(focused.id) ? " · Path lit" : ""}
                </p>
                <h2 className="font-display text-2xl">{focused.name}</h2>
                <p className="mt-1 text-sm text-muted">{focused.blurb}</p>
                <ol className="mt-3 grid gap-2 sm:grid-cols-3">
                  {focused.lessons.map((item, index) => {
                    const finished = lessonDone(focused.id, item.title);
                    return (
                      <li key={item.title}>
                        <button
                          type="button"
                          onClick={() => setLessonTitle(item.title)}
                          className="flex min-h-16 w-full flex-col items-start rounded-2xl bg-cream-deep px-3 py-2 text-left"
                        >
                          <span className="text-xs font-bold text-moss">
                            Lesson {index + 1}
                            {finished ? " · Done" : ` · ${item.minutes} min`}
                          </span>
                          <span className="font-bold">{item.title}</span>
                          <span className="text-xs text-muted">{item.world}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>
          ) : null}

          {focused && lesson ? (
            <section className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 sm:px-6 sm:pb-5">
              <div className="mx-auto max-w-xl rounded-3xl bg-cream p-5 text-ink shadow-2xl">
                <p className="text-sm font-bold text-lantern">
                  {focused.name} · {lesson.world}
                </p>
                <h2 className="mt-1 font-display text-3xl">{writeTitle ?? lesson.title}</h2>
                {writeTitle ? <p className="mt-1 text-sm text-muted">{lesson.title}</p> : null}
                <p className="mt-3">{lesson.task}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {lessonDone(focused.id, lesson.title) ? (
                    <span className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-moss">
                      <Check className="size-4" aria-hidden="true" />
                      Saved to Treehouse
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markDone(focused.id, lesson.title)}
                      className="inline-flex min-h-11 items-center rounded-full bg-moss px-4 text-sm font-bold text-cream"
                    >
                      Save to Treehouse
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setLessonTitle(null)}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-lantern"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Other lessons
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {!overlayOpen ? (
            <AssignmentBar
              open={shelfOpen}
              onToggle={() => setShelfOpen((value) => !value)}
              onOpen={(id, lessonName, title) => openModule(id, lessonName, title)}
              ecrNote={ecrNote}
              onCloseEcr={() => setEcrNote(false)}
            />
          ) : null}

          {glow ? (
            <div
              className="ap-glow"
              aria-hidden="true"
              style={{ ["--gx" as string]: `${glow.x}%`, ["--gy" as string]: `${glow.y}%` }}
            />
          ) : null}
          {cade ? <ClassCadeNote onClose={() => setCade(false)} /> : null}
      </div>
    </div>
  );
}

function AssignmentBar({
  open,
  onToggle,
  onOpen,
  ecrNote,
  onCloseEcr,
}: {
  open: boolean;
  onToggle: () => void;
  onOpen: (moduleId: string, lesson: string, title: string) => void;
  ecrNote: boolean;
  onCloseEcr: () => void;
}) {
  const today = assignments[0];
  return (
    <section className="z-assign-wrap absolute inset-x-0 z-10 flex flex-col items-center gap-2 px-4">
      {ecrNote ? (
        <p className="z-assign max-w-xl px-4 py-3 text-sm">
          Extended responses are the longer writes. Today’s path is Short Responses.
          <button type="button" onClick={onCloseEcr} className="ml-2 font-bold text-[#a0521d]">
            Close
          </button>
        </p>
      ) : null}
      <div className="z-assign w-full max-w-xl">
        <div className="z-assign-row flex items-center gap-2 pl-3.5 pr-1.5">
          <button type="button" onClick={onToggle} className="z-assign-text min-w-0 flex-1 text-left" aria-expanded={open}>
            <span className="block text-[10px] leading-[1.1] font-extrabold tracking-[0.08em] text-[#a0521d]">
              CURRENT ASSIGNMENT
            </span>
            <span className="block truncate text-[16px] font-bold leading-[1.15]">{today.title}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpen(today.moduleId, today.lesson, today.title)}
            className={
              "start-write inline-flex shrink-0 items-center rounded-full bg-[#8a4a17] px-5 text-sm font-extrabold text-white" +
              (assignments.length > 1 ? " start-write-glow" : "")
            }
          >
            Start writing
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-label={open ? "Hide assignments" : "Show all assignments"}
            aria-expanded={open}
            className="assign-chip grid size-11 place-items-center"
          >
            <img src={asset("crystal.png")} alt="" className="assign-crystal" />
          </button>
        </div>
        {open ? (
          <ul className="max-h-[36vh] overflow-y-auto border-t border-[rgb(74,46,26)]/15 px-2 pb-2">
            {assignments.map((item) => (
              <li key={item.title} className="flex items-center gap-2 border-b border-[rgb(74,46,26)]/10 py-2 last:border-b-0">
                <div className="min-w-0 flex-1 px-2">
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#7a5a2e]">
                    <span className="rounded-full bg-[rgb(74,46,26)]/10 px-2 py-0.5 font-bold">{item.kind}</span>
                    <span>{item.format}</span>
                    <span>{item.teacher}</span>
                    <span className="font-bold text-[#a0521d]">{item.due}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpen(item.moduleId, item.lesson, item.title)}
                  className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-[#4a2e1a] px-3 text-sm font-bold text-cream"
                >
                  {item.action}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
