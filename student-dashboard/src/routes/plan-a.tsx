import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

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
  /** Lesson-dot pill center under the portal */
  dotX: number;
  dotY: number;
  accent: string;
  lessons: Lesson[];
};

type Writing = { title: string; from: string; body: string };

type Lantern = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Center of painted wooden sign under the lantern (for frosted label cover). */
  signX: number;
  signY: number;
};

const CLASS_FOCUS = "Today, let's back every answer with evidence from the text!";
const MY_GOAL = "Back up my opinion with strong, specific reasons.";

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
    y: 65.74,
    w: 11,
    h: 23.98,
    dotX: 25.9,
    dotY: 83.3,
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
    y: 65.74,
    w: 11,
    h: 23.98,
    dotX: 38.8,
    dotY: 83.3,
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
    y: 65.74,
    w: 11,
    h: 23.98,
    dotX: 51.5,
    dotY: 83.3,
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
    y: 65.74,
    w: 11,
    h: 23.98,
    dotX: 64.5,
    dotY: 83.3,
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
    y: 65.74,
    w: 11,
    h: 23.98,
    dotX: 78.1,
    dotY: 83.3,
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
    y: 65.74,
    w: 11,
    h: 23.98,
    dotX: 92.3,
    dotY: 83.3,
    accent: "#ff6fa8",
    lessons: [
      { title: "Capitals and stops", world: "Fallen leaves", minutes: 15, task: "Fix sentences that start or end the wrong way." },
      { title: "Spelling that counts", world: "Red maples", minutes: 20, task: "Correct the words a reader would stumble on." },
      { title: "Read it through", world: "Last lantern", minutes: 15, task: "Read aloud and mark anything that still snags." },
    ],
  },
];

const treehouseSpot = { x: 50, y: 50.32, w: 13, h: 22.27 };
const astraSpot = { x: 9.5, y: 64.03, w: 13, h: 32.55 };
const tipDotSpot = { x: 22, y: 36.62 };

/** Four interactive lanterns; any extra lantern in the art stays decorative. */
const lanterns: Lantern[] = [
  { id: "goal", label: "My goal", x: 34.5, y: 43.04, w: 5.5, h: 10.28, signX: 32.8, signY: 50.6 },
  { id: "progress", label: "My progress", x: 41.5, y: 43.47, w: 5.5, h: 10.28, signX: 39.8, signY: 50.0 },
  { id: "practice", label: "Practice", x: 63.5, y: 46.04, w: 5.5, h: 10.28, signX: 63.5, signY: 52.2 },
  { id: "quick", label: "Quick write", x: 74.5, y: 43.04, w: 5.5, h: 10.28, signX: 74.2, signY: 50.2 },
];

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

const savedAtStart: Writing[] = [
  {
    title: "Why is the old tree special?",
    from: "Stellar Writers · Finished",
    body: "The old tree is special because the path starts at its roots. Lanterns hang by the door, and the bark holds the names of writers who passed.",
  },
  {
    title: "One complete thought",
    from: "Stellar Writers",
    body: "A sentence holds one idea. The fox waited on the stone until the lantern was lit.",
  },
];

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;

function StudentHome() {
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, string[]>>(DEMO_DONE);
  const [shelfOpen, setShelfOpen] = useState(false);
  const [writeTitle, setWriteTitle] = useState<string | null>(null);
  const [ecrNote, setEcrNote] = useState(false);
  const [quick, setQuick] = useState(false);
  const [treehouse, setTreehouse] = useState(false);
  const [entryTitle, setEntryTitle] = useState<string | null>(null);
  const [writings, setWritings] = useState<Writing[]>(savedAtStart);
  const [tipOpen, setTipOpen] = useState(true);
  const [sheet, setSheet] = useState<"goal" | "progress" | "practice" | null>(null);

  const focused = modules.find((mod) => mod.id === moduleId) ?? null;
  const lesson = focused?.lessons.find((item) => item.title === lessonTitle) ?? null;
  const entry = writings.find((item) => item.title === entryTitle) ?? null;
  const focus = treehouse || focused;
  const overlayOpen = Boolean(focus || quick || sheet);

  useEffect(() => {
    if (!tipOpen) return;
    const id = window.setTimeout(() => setTipOpen(false), 6000);
    return () => window.clearTimeout(id);
  }, [tipOpen]);

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
    setTreehouse(false);
    setEntryTitle(null);
    setSheet(null);
    setModuleId(id || null);
    setLessonTitle(lessonName ?? null);
    setWriteTitle(assignmentTitle ?? null);
    setQuick(false);
    setShelfOpen(false);
  }

  function openTreehouse() {
    setModuleId(null);
    setLessonTitle(null);
    setWriteTitle(null);
    setQuick(false);
    setSheet(null);
    setTreehouse(true);
    setEntryTitle(null);
    setShelfOpen(false);
  }

  function startQuickWrite() {
    setModuleId(null);
    setLessonTitle(null);
    setWriteTitle(null);
    setSheet(null);
    setTreehouse(true);
    setQuick(true);
    setEntryTitle(null);
    setShelfOpen(false);
  }

  function backToHub() {
    setModuleId(null);
    setLessonTitle(null);
    setWriteTitle(null);
    setQuick(false);
    setTreehouse(false);
    setEntryTitle(null);
    setSheet(null);
  }

  function markDone(moduleKey: string, title: string) {
    setDone((current) => {
      const list = current[moduleKey] ?? [];
      if (list.includes(title)) return current;
      return { ...current, [moduleKey]: [...list, title] };
    });
    setWritings((current) => {
      if (current.some((item) => item.title === title)) return current;
      const mod = modules.find((item) => item.id === moduleKey);
      return [{ title, from: mod ? mod.name : "Astra", body: "Saved in your Treehouse." }, ...current];
    });
  }

  function onLantern(id: string) {
    if (id === "quick") {
      startQuickWrite();
      return;
    }
    if (id === "goal") setSheet("goal");
    if (id === "progress") setSheet("progress");
    if (id === "practice") setSheet("practice");
    setModuleId(null);
    setLessonTitle(null);
    setWriteTitle(null);
    setQuick(false);
    setTreehouse(false);
    setEntryTitle(null);
    setShelfOpen(false);
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
                transformOrigin: focused
                  ? `${focused.x}% ${focused.y}%`
                  : treehouse
                    ? `${treehouseSpot.x}% ${treehouseSpot.y}%`
                    : "50% 45%",
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

                  {/* Astra tip bubble / collapsed tip dot */}
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
                  ) : (
                    <button
                      type="button"
                      className="z-tip-dot"
                      style={{ left: `${tipDotSpot.x}%`, top: `${tipDotSpot.y}%` }}
                      onClick={() => setTipOpen(true)}
                      aria-label="Show Astra’s tip"
                    />
                  )}

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
                      <span className="z-plate under">
                        <span className="z-plate-mod">M{mod.n} · {mod.short}</span>
                        <span className="z-plate-world">{mod.world}</span>
                      </span>
                    </button>
                  ))}

                  {/* Lesson crystal dots — demo mastery via DEMO_DONE */}
                  {!focus
                    ? modules.map((mod) => (
                        <div
                          key={`dots-${mod.id}`}
                          className="z-dots"
                          style={{ left: `${mod.dotX}%`, top: `${mod.dotY}%` }}
                          aria-hidden="true"
                        >
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
                        </div>
                      ))
                    : null}

                  {lanterns.map((lan) => (
                    <button
                      key={lan.id}
                      type="button"
                      onClick={() => onLantern(lan.id)}
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
                    onClick={openTreehouse}
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

          {treehouse && !entry && !quick ? (
            <section className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 sm:px-6 sm:pb-5">
              <div className="mx-auto max-w-xl rounded-3xl bg-cream/95 p-4 text-ink shadow-2xl sm:p-5">
                <p className="text-sm font-bold text-lantern">Treehouse · Your space</p>
                <h2 className="font-display text-2xl">Treehouse</h2>
                <p className="mt-1 text-sm text-muted">Quick writes and finished work live here with Astra.</p>
                <button
                  type="button"
                  onClick={startQuickWrite}
                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-lantern px-4 text-sm font-bold text-cream"
                >
                  Start Quick write
                </button>
                <ul className="mt-3 grid gap-2">
                  {writings.map((item) => (
                    <li key={item.title}>
                      <button
                        type="button"
                        onClick={() => setEntryTitle(item.title)}
                        className="flex min-h-14 w-full flex-col items-start rounded-2xl bg-cream-deep px-3 py-2 text-left"
                      >
                        <span className="font-bold">{item.title}</span>
                        <span className="text-xs text-muted">{item.from}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {treehouse && entry ? (
            <section className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3 sm:px-6 sm:pb-5">
              <div className="mx-auto max-w-xl rounded-3xl bg-cream p-5 text-ink shadow-2xl">
                <p className="text-sm font-bold text-lantern">{entry.from}</p>
                <h2 className="mt-1 font-display text-3xl">{entry.title}</h2>
                <p className="mt-3">{entry.body}</p>
                <button
                  type="button"
                  onClick={() => setEntryTitle(null)}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-lantern"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  All writing
                </button>
              </div>
            </section>
          ) : null}

          {quick ? (
            <section className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4">
              <div className="mx-auto max-w-xl rounded-3xl bg-cream p-5 text-ink shadow-2xl">
                <p className="text-sm font-bold text-lantern">Astra · Quick write</p>
                <h2 className="mt-1 font-display text-3xl">Robot at School</h2>
                <p className="mt-3">A robot joins your class. What happens during the day?</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setWritings((current) => [
                        {
                          title: "Robot at School",
                          from: "Astra · Quick write",
                          body: "A robot joins your class. What happens during the day?",
                        },
                        ...current.filter((item) => item.title !== "Robot at School"),
                      ]);
                      setQuick(false);
                      openTreehouse();
                    }}
                    className="inline-flex min-h-11 items-center rounded-full bg-moss px-4 text-sm font-bold text-cream"
                  >
                    Save to Treehouse
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuick(false);
                      setTreehouse(true);
                    }}
                    className="inline-flex min-h-11 items-center text-sm font-bold text-lantern"
                  >
                    Back to Treehouse
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {sheet === "goal" ? (
            <FrostCard title="My goal" onClose={() => setSheet(null)}>
              <p>{MY_GOAL}</p>
            </FrostCard>
          ) : null}

          {sheet === "practice" ? (
            <FrostCard title="Practice" onClose={() => setSheet(null)}>
              <p>Practice pages coming soon — Astra is still packing the crystal drills!</p>
            </FrostCard>
          ) : null}

          {sheet === "progress" ? (
            <FrostCard title="My progress" eyebrow="Data & goals" onClose={() => setSheet(null)} wide>
              <p className="mb-3 text-sm font-bold text-[#7a5a2e]">
                {modules.filter((m) => mastered(m.id)).length} of 6 worlds explored · Goal: {MY_GOAL}
              </p>
              <ul className="grid gap-2">
                {modules.map((mod) => {
                  const finished = (done[mod.id] ?? []).length;
                  const total = mod.lessons.length;
                  const lit = mastered(mod.id);
                  return (
                    <li
                      key={mod.id}
                      className="flex items-center gap-3 rounded-2xl bg-[rgb(255,248,235)]/70 px-3 py-2"
                    >
                      <span
                        className="inline-block size-3 rotate-45 rounded-[2px]"
                        style={{
                          background: lit ? mod.accent : "rgba(74,46,26,.2)",
                          boxShadow: lit ? `0 0 8px ${mod.accent}` : "none",
                        }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold">M{mod.n} · {mod.short}</span>
                        <span className="block text-xs text-[#7a5a2e]">{mod.world}</span>
                      </span>
                      <span className="text-xs font-bold text-[#7a5a2e]">
                        {finished}/{total}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </FrostCard>
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
      </div>
    </div>
  );
}

function FrostCard({
  title,
  eyebrow,
  onClose,
  children,
  wide,
}: {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={"z-frost " + (wide ? "wide" : "")} role="dialog" aria-label={title}>
      <div className="z-frost-head">
        <div>
          {eyebrow ? <p className="z-frost-k">{eyebrow}</p> : null}
          <h2 className="z-frost-title">{title}</h2>
        </div>
        <button type="button" className="z-frost-x" aria-label="Close" onClick={onClose}>
          <X className="size-4" />
        </button>
      </div>
      <div className="z-frost-body">{children}</div>
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
    <section className="absolute inset-x-0 bottom-3 z-10 flex flex-col items-center gap-2 px-4">
      {ecrNote ? (
        <p className="z-assign max-w-xl px-4 py-3 text-sm">
          Extended responses are the longer writes. Today’s path is Short Responses.
          <button type="button" onClick={onCloseEcr} className="ml-2 font-bold text-[#a0521d]">
            Close
          </button>
        </p>
      ) : null}
      <div className="z-assign w-full max-w-xl">
        <div className="flex min-h-14 items-center gap-2 px-3">
          <button type="button" onClick={onToggle} className="min-w-0 flex-1 py-2 text-left" aria-expanded={open}>
            <span className="block text-[11px] font-extrabold tracking-[0.08em] text-[#a0521d]">
              CURRENT ASSIGNMENT
            </span>
            <span className="block truncate text-[17px] font-bold leading-tight">{today.title}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpen(today.moduleId, today.lesson, today.title)}
            className={
              "start-write inline-flex min-h-11 shrink-0 items-center rounded-full bg-[#8a4a17] px-5 text-sm font-extrabold text-white" +
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
