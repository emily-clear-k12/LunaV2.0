import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Feather, Lightbulb, Pencil, ScrollText, Search, Star } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: StudentHome });

type Lesson = { title: string; world: string; minutes: number; task: string };

type Module = {
  id: string;
  n: number;
  name: string;
  world: string;
  blurb: string;
  x: number;
  y: number;
  gem: number;
  lessons: Lesson[];
};

type Writing = { title: string; from: string; body: string };

const modules: Module[] = [
  {
    id: "sentences",
    n: 1,
    name: "Stellar Writers",
    world: "Redwood path",
    blurb: "Sentences that hold one clear idea.",
    x: 8.3,
    y: 71.3,
    gem: 7.4,
    lessons: [
      { title: "One complete thought", world: "First stones", minutes: 20, task: "Write three sentences that each say one whole idea." },
      { title: "Who did what", world: "Root bridge", minutes: 20, task: "Mark the who and the what in each sentence." },
      { title: "Join two ideas", world: "Twin trunks", minutes: 20, task: "Combine two short sentences without losing either idea." },
    ],
  },
  {
    id: "plan",
    n: 2,
    name: "Preparing to Write",
    world: "Birch grove",
    blurb: "Read the prompt, take notes, make a plan.",
    x: 22.4,
    y: 37.6,
    gem: 5.5,
    lessons: [
      { title: "Read the prompt", world: "White trunks", minutes: 15, task: "Underline what the prompt is asking you to do." },
      { title: "Gather notes", world: "Lantern circle", minutes: 20, task: "List the facts you will use before you draft." },
      { title: "Order the plan", world: "Grove gate", minutes: 20, task: "Put your notes in the order a reader needs." },
    ],
  },
  {
    id: "draft",
    n: 3,
    name: "Writing a Draft",
    world: "Great tree",
    blurb: "Shape a paragraph, then a whole draft.",
    x: 48.7,
    y: 23.1,
    gem: 4.5,
    lessons: [
      { title: "Lead with the idea", world: "Tree door", minutes: 20, task: "Write the sentence that tells your main idea." },
      { title: "Build a paragraph", world: "Inner rings", minutes: 20, task: "Add reasons under that idea, in order." },
      { title: "Hold the draft", world: "High branches", minutes: 25, task: "Write the beginning, middle, and end." },
    ],
  },
  {
    id: "short",
    n: 4,
    name: "Short Responses",
    world: "Treehouse canopy",
    blurb: "Answer the question, then prove it.",
    x: 90.1,
    y: 16.9,
    gem: 4.7,
    lessons: [
      { title: "Details", world: "Canopy marks", minutes: 20, task: "Write detail sentences a reader can picture." },
      { title: "Evidence", world: "High proof", minutes: 23, task: "Use two pieces of proof from the passage." },
      { title: "Quoting", world: "Exact words", minutes: 20, task: "Put the author’s exact words in your answer." },
    ],
  },
  {
    id: "revise",
    n: 5,
    name: "Revision",
    world: "Stone ridge",
    blurb: "Make the draft clearer and stronger.",
    x: 76.4,
    y: 41.7,
    gem: 6,
    lessons: [
      { title: "Name the idea", world: "Lookout", minutes: 15, task: "Say what the draft is really about, in one line." },
      { title: "Add what’s missing", world: "Switchback", minutes: 20, task: "Find a claim with no support and add it." },
      { title: "Cut what wanders", world: "Cliff path", minutes: 20, task: "Remove a sentence that does not help the idea." },
    ],
  },
  {
    id: "edit",
    n: 6,
    name: "Editing",
    world: "Autumn wood",
    blurb: "Fix conventions after the ideas are set.",
    x: 84.7,
    y: 69.5,
    gem: 7,
    lessons: [
      { title: "Capitals and stops", world: "Fallen leaves", minutes: 15, task: "Fix sentences that start or end the wrong way." },
      { title: "Spelling that counts", world: "Red maples", minutes: 20, task: "Correct the words a reader would stumble on." },
      { title: "Read it through", world: "Last lantern", minutes: 15, task: "Read aloud and mark anything that still snags." },
    ],
  },
];

const journalSpot = { x: 42.3, y: 58 };

const trails = [
  "M 8.3 71.3 C 12 55, 16 45, 22.4 37.6",
  "M 22.4 37.6 C 32 31, 40 26, 48.7 23.1",
  "M 48.7 23.1 C 64 15, 80 14, 90.1 16.9",
  "M 90.1 16.9 C 88 28, 82 35, 76.4 41.7",
  "M 76.4 41.7 C 78 54, 82 62, 84.7 69.5",
];

const fireflies = [
  [26, 52, 0],
  [34, 42, 1.4],
  [40, 58, 2.2],
  [57, 44, 0.6],
  [63, 36, 3],
  [70, 58, 1.1],
  [32, 68, 2.6],
  [74, 30, 0.3],
  [16, 48, 1.8],
  [54, 34, 2.8],
  [42, 72, 0.9],
  [78, 62, 1.6],
];

const assignments = [
  {
    title: "How Refrigerators Changed Our Food",
    kind: "ECR",
    format: "Argument",
    teacher: "Mr. Verret",
    due: "Due tomorrow",
    action: "Begin",
    moduleId: "short",
    lesson: "Evidence",
    current: true,
  },
  {
    title: "Should recess be longer?",
    kind: "ECR",
    format: "Argument",
    teacher: "Mr. Nowitski",
    due: "Due Jul 4",
    action: "Continue",
    moduleId: "short",
    lesson: "Evidence",
    current: false,
  },
  {
    title: "The Brave Little Girl of 1776",
    kind: "SCR",
    format: "Narrative",
    teacher: "Mr. Prescott",
    due: "Due Jul 6",
    action: "Begin",
    moduleId: "short",
    lesson: "Details",
    current: false,
  },
];

const badges = [
  { id: "scr", label: "SCR", name: "Short responses", moduleId: "short", Icon: Feather },
  { id: "ecr", label: "ECR", name: "Extended responses", moduleId: "", Icon: ScrollText },
  { id: "stellar", label: "Stellar", name: "Sentences", moduleId: "sentences", Icon: Star },
  { id: "process", label: "Process", name: "Preparing to write", moduleId: "plan", Icon: Lightbulb },
  { id: "revision", label: "Revision", name: "Revision", moduleId: "revise", Icon: Search },
  { id: "editing", label: "Editing", name: "Editing", moduleId: "edit", Icon: Pencil },
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
  {
    title: "Who did what",
    from: "Stellar Writers",
    body: "The writer followed the path. The crystal marked the turn.",
  },
];

// Public images live under the site's base path (/LunaV2.0/dashboard/ on GitHub Pages).
const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;

const STAGE_W = 1366;
const STAGE_H = 768;

function useStageScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      // Leave room for the view switcher bar when it is shown above the stage.
      const bar = document.querySelector<HTMLElement>(".vswitch")?.offsetHeight ?? 0;
      setScale(Math.min(window.innerWidth / STAGE_W, (window.innerHeight - bar) / STAGE_H));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return scale;
}

function StudentHome() {
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, string[]>>({
    sentences: modules[0].lessons.map((lesson) => lesson.title),
  });
  const [shelfOpen, setShelfOpen] = useState(false);
  const [writeTitle, setWriteTitle] = useState<string | null>(null);
  const [ecrNote, setEcrNote] = useState(false);
  const [quick, setQuick] = useState(false);
  const [journal, setJournal] = useState(false);
  const [entryTitle, setEntryTitle] = useState<string | null>(null);
  const [writings, setWritings] = useState<Writing[]>(savedAtStart);

  const focused = modules.find((mod) => mod.id === moduleId) ?? null;
  const lesson = focused?.lessons.find((item) => item.title === lessonTitle) ?? null;
  const entry = writings.find((item) => item.title === entryTitle) ?? null;
  const focus = journal ? journalSpot : focused;

  function mastered(id: string) {
    const mod = modules.find((item) => item.id === id);
    if (!mod) return false;
    const finished = done[id] ?? [];
    return mod.lessons.every((item) => finished.includes(item.title));
  }

  function openModule(id: string, lessonName?: string, assignmentTitle?: string) {
    setJournal(false);
    setEntryTitle(null);
    setModuleId(id || null);
    setLessonTitle(lessonName ?? null);
    setWriteTitle(assignmentTitle ?? null);
    setQuick(false);
    setShelfOpen(false);
  }

  function openJournal() {
    setModuleId(null);
    setLessonTitle(null);
    setWriteTitle(null);
    setQuick(false);
    setJournal(true);
    setEntryTitle(null);
    setShelfOpen(false);
  }

  function backToMap() {
    setModuleId(null);
    setLessonTitle(null);
    setWriteTitle(null);
    setQuick(false);
    setJournal(false);
    setEntryTitle(null);
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
      return [
        {
          title,
          from: mod ? mod.name : "Astra",
          body: "Saved to your journal in the clearing.",
        },
        ...current,
      ];
    });
  }

  const scale = useStageScale();

  return (
    <div className="grid h-dvh w-full place-items-center overflow-hidden bg-cream">
      <div
        className="relative flex flex-col overflow-hidden bg-dusk"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
      >
      <header className="title-bar">
        <h1 className="font-display min-w-0 truncate text-xl text-fog sm:text-2xl">
          Astra’s Writing Adventure
        </h1>
        {focus ? (
          <button
            type="button"
            onClick={backToMap}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-cream px-4 text-sm font-bold text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to map
          </button>
        ) : (
          <div className="flex shrink-0 items-end gap-1.5 overflow-x-auto">
            {badges.map((badge) => (
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
                aria-current={badge.id === "scr" ? "true" : undefined}
                title={badge.name}
                className="gem-badge"
              >
                <span className={badge.id === "scr" ? "gem live" : "gem"}>
                  {badge.id === "scr" ? (
                    <img src={asset("crystal.png")} alt="" className="gem-crystal" />
                  ) : (
                    <badge.Icon className="size-4" aria-hidden="true" />
                  )}
                </span>
                <span className="text-xs font-bold tracking-wide">{badge.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>
      <div className="flex min-h-0 flex-1">
      <div className="relative min-w-0 flex-1">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            transformOrigin: focus ? `${focus.x}% ${focus.y}%` : "50% 50%",
            transform: focus ? "scale(2.35)" : "scale(1)",
          }}
        >
          <img src={asset("forest-map.jpg?v=6")} alt="" className="h-full w-full object-fill" />
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {trails.map((d, index) => (
              <path key={d} d={d} className={mastered(modules[index].id) ? "trail lit" : "trail"} />
            ))}
          </svg>
          {fireflies.map(([x, y, delay]) => (
            <span
              key={`${x}-${y}`}
              className="firefly pointer-events-none absolute"
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}
            />
          ))}
          {modules.map((mod) => (
            <button
              key={mod.id}
              type="button"
              onClick={() => openModule(mod.id)}
              aria-label={`Module ${mod.n}, ${mod.name}`}
              className={
                "absolute -translate-x-1/2 -translate-y-1/2 " +
                (focus ? "pointer-events-none opacity-0" : "")
              }
              style={{ left: `${mod.x - 1.2}%`, top: `${mod.y + 2}%` }}
            >
              <img
                src={asset("crystal.png")}
                alt=""
                className="crystal-mark"
                style={{ height: `${(mod.gem / 100) * STAGE_H}px` }}
              />
              <span className="map-label absolute top-full left-1/2 mt-1 -translate-x-1/2">
                Module {mod.n}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={openJournal}
            aria-label="Journal, your saved writing"
            className={
              "absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center " +
              (focus ? "pointer-events-none opacity-0" : "")
            }
            style={{ left: `${journalSpot.x}%`, top: `${journalSpot.y}%` }}
          >
            <span className="journal-glow" aria-hidden="true" />
            <span className="map-label absolute top-full left-1/2 mt-0.5 -translate-x-1/2">
              Journal
            </span>
          </button>
        </div>
        </div>

      {focused && !lesson ? (
        <section className="absolute inset-x-0 bottom-0 px-3 pb-3 sm:px-6 sm:pb-5">
          <div className="mx-auto max-w-3xl rounded-3xl bg-cream/95 p-4 text-ink shadow-2xl sm:p-5">
            <p className="text-sm font-bold text-lantern">
              Module {focused.n} · {focused.world}
              {mastered(focused.id) ? " · Path lit" : ""}
            </p>
            <h2 className="font-display text-2xl">{focused.name}</h2>
            <p className="mt-1 text-sm text-muted">{focused.blurb}</p>
            <ol className="mt-3 grid gap-2 sm:grid-cols-3">
              {focused.lessons.map((item, index) => {
                const finished = (done[focused.id] ?? []).includes(item.title);
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
        <section className="absolute inset-x-0 bottom-0 px-3 pb-3 sm:px-6 sm:pb-5">
          <div className="mx-auto max-w-xl rounded-3xl bg-cream p-5 text-ink shadow-2xl">
            <p className="text-sm font-bold text-lantern">
              {focused.name} · {lesson.world}
            </p>
            <h2 className="mt-1 font-display text-3xl">{writeTitle ?? lesson.title}</h2>
            {writeTitle ? <p className="mt-1 text-sm text-muted">{lesson.title}</p> : null}
            <p className="mt-3">{lesson.task}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {(done[focused.id] ?? []).includes(lesson.title) ? (
                <span className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-moss">
                  <Check className="size-4" aria-hidden="true" />
                  Saved to journal
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => markDone(focused.id, lesson.title)}
                  className="inline-flex min-h-11 items-center rounded-full bg-moss px-4 text-sm font-bold text-cream"
                >
                  Save to journal
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

      {journal && !entry ? (
        <section className="absolute inset-x-0 bottom-0 px-3 pb-3 sm:px-6 sm:pb-5">
          <div className="mx-auto max-w-xl rounded-3xl bg-cream/95 p-4 text-ink shadow-2xl sm:p-5">
            <p className="text-sm font-bold text-lantern">Fern heart · Your space</p>
            <h2 className="font-display text-2xl">Journal</h2>
            <p className="mt-1 text-sm text-muted">Writing you finish is kept here.</p>
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

      {journal && entry ? (
        <section className="absolute inset-x-0 bottom-0 px-3 pb-3 sm:px-6 sm:pb-5">
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

      {!focus && !quick ? (
        <AssignmentShelf
          open={shelfOpen}
          onToggle={() => setShelfOpen((value) => !value)}
          onOpen={(id, lessonName, title) => openModule(id, lessonName, title)}
          ecrNote={ecrNote}
          onCloseEcr={() => setEcrNote(false)}
        />
      ) : null}
      {quick ? (
        <section className="absolute inset-x-0 bottom-0 px-4 pb-4">
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
                  openJournal();
                }}
                className="inline-flex min-h-11 items-center rounded-full bg-moss px-4 text-sm font-bold text-cream"
              >
                Save to journal
              </button>
              <button
                type="button"
                onClick={() => setQuick(false)}
                className="inline-flex min-h-11 items-center text-sm font-bold text-lantern"
              >
                Back to map
              </button>
            </div>
          </div>
        </section>
      ) : null}
      </div>
      <div className="pane-break" aria-hidden="true" />
      <QuickWrite onStart={() => { setQuick(true); setShelfOpen(false); }} />
      </div>
      </div>
    </div>
  );
}

function QuickWrite({ onStart }: { onStart: () => void }) {
  return (
    <aside className="flex w-80 shrink-0 flex-col bg-cream px-3 pt-3 pb-4 text-ink">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl shadow-md">
        <img
          src={asset("astra-treehouse.jpg")}
          alt="Astra leaning against the trunk of his treehouse"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="pt-3">
        <p className="text-xs font-bold tracking-wide text-lantern">Quick write</p>
        <h2 className="mt-1 font-display text-3xl leading-tight">Robot at School</h2>
        <p className="mt-2 text-sm">A robot joins your class. What happens during the day?</p>
        <button
          type="button"
          onClick={onStart}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-lantern text-sm font-bold text-cream"
        >
          Start writing
        </button>
      </div>
    </aside>
  );
}

function AssignmentShelf({
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
    <section className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-2 px-4">
      {ecrNote ? (
        <p className="max-w-xl rounded-2xl bg-cream/95 px-4 py-3 text-sm text-ink">
          Extended responses are the longer writes. Today’s path is Short Responses.
          <button type="button" onClick={onCloseEcr} className="ml-2 font-bold text-lantern">
            Close
          </button>
        </p>
      ) : null}
      <div className="w-full max-w-xl rounded-3xl bg-cream/95 text-ink shadow-2xl">
        <div className="flex min-h-14 items-center gap-2 px-3">
          <button
            type="button"
            onClick={onToggle}
            className="min-w-0 flex-1 py-2 text-left"
            aria-expanded={open}
          >
            <span className="block text-xs font-bold text-lantern">Current assignment</span>
            <span className="block truncate font-bold">{today.title}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpen(today.moduleId, today.lesson, today.title)}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-lantern px-4 text-sm font-bold text-cream"
          >
            Start writing
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-label={open ? "Hide assignments" : "Show all assignments"}
            className={
              "grid size-12 place-items-center rounded-full " +
              (assignments.length > 1 ? "more-work" : "")
            }
          >
            {open ? (
              <ChevronDown className="size-4" aria-hidden="true" />
            ) : (
              <ChevronUp className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {open ? (
          <ul className="max-h-[42vh] overflow-y-auto border-t border-line px-2 pb-2">
            {assignments.map((item) => (
              <li key={item.title} className="flex items-center gap-2 border-b border-line py-2 last:border-b-0">
                <div className="min-w-0 flex-1 px-2">
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                    <span className="rounded-full bg-moss-soft px-2 py-0.5 font-bold text-moss">{item.kind}</span>
                    <span>{item.format}</span>
                    <span>{item.teacher}</span>
                    <span className="font-bold text-lantern">{item.due}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpen(item.moduleId, item.lesson, item.title)}
                  className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-ink px-3 text-sm font-bold text-cream"
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
