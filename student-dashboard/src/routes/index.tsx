import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

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
  labelAbove?: boolean;
  lessons: Lesson[];
};

type Writing = { title: string; from: string; body: string };

const modules: Module[] = [
  {
    id: "scr",
    n: 1,
    name: "SCR",
    short: "SCR",
    world: "Fairy Hollow",
    blurb: "Short constructed responses with clear evidence.",
    x: 21.1,
    y: 38.5,
    w: 5.5,
    h: 9,
    lessons: [
      { title: "Answer the ask", world: "Mushroom lane", minutes: 20, task: "Write a short answer that restates the question." },
      { title: "Evidence", world: "Glow caps", minutes: 23, task: "Use two pieces of proof from the passage." },
      { title: "Details", world: "Spore bridge", minutes: 20, task: "Write detail sentences a reader can picture." },
    ],
  },
  {
    id: "ecr",
    n: 2,
    name: "ECR",
    short: "ECR",
    world: "Dwarven Stonehold",
    blurb: "Extended responses that build a full argument.",
    x: 41.1,
    y: 31.7,
    w: 5.5,
    h: 9,
    lessons: [
      { title: "Claim the fort", world: "Gate stones", minutes: 20, task: "Write a clear claim for a longer response." },
      { title: "Stack reasons", world: "Hall of proofs", minutes: 25, task: "Order three reasons that support your claim." },
      { title: "Land the ending", world: "Deep vault", minutes: 20, task: "Close with a conclusion that ties the reasons together." },
    ],
  },
  {
    id: "sentences",
    n: 3,
    name: "Stellar Writers",
    short: "Stellar",
    world: "Elven Starspire",
    blurb: "Sentences that hold one clear idea.",
    x: 65.0,
    y: 31.7,
    w: 5.5,
    h: 9,
    lessons: [
      { title: "One complete thought", world: "First spires", minutes: 20, task: "Write three sentences that each say one whole idea." },
      { title: "Who did what", world: "Star bridge", minutes: 20, task: "Mark the who and the what in each sentence." },
      { title: "Join two ideas", world: "Twin towers", minutes: 20, task: "Combine two short sentences without losing either idea." },
    ],
  },
  {
    id: "plan",
    n: 4,
    name: "The Writing Process",
    short: "Process",
    world: "Gnome Gearworks",
    blurb: "Read the prompt, take notes, make a plan.",
    x: 77.4,
    y: 51.2,
    w: 5.5,
    h: 9,
    lessons: [
      { title: "Read the prompt", world: "Windmill gate", minutes: 15, task: "Underline what the prompt is asking you to do." },
      { title: "Gather notes", world: "Gear loft", minutes: 20, task: "List the facts you will use before you draft." },
      { title: "Order the plan", world: "Clockwork yard", minutes: 20, task: "Put your notes in the order a reader needs." },
    ],
  },
  {
    id: "revise",
    n: 5,
    name: "Revision",
    short: "Revision",
    world: "Merfolk Lagoon",
    blurb: "Make the draft clearer and stronger.",
    x: 73.9,
    y: 81.2,
    w: 5.5,
    h: 9,
    labelAbove: true,
    lessons: [
      { title: "Name the idea", world: "Dock lights", minutes: 15, task: "Say what the draft is really about, in one line." },
      { title: "Add what’s missing", world: "Tide shelves", minutes: 20, task: "Find a claim with no support and add it." },
      { title: "Cut what wanders", world: "Reef path", minutes: 20, task: "Remove a sentence that does not help the idea." },
    ],
  },
  {
    id: "edit",
    n: 6,
    name: "Edit",
    short: "Edit",
    world: "Dragon’s Roost",
    blurb: "Polish conventions until the writing is clear.",
    x: 16.5,
    y: 81.5,
    w: 5.5,
    h: 9,
    labelAbove: true,
    lessons: [
      { title: "Capitals and stops", world: "Cliff stairs", minutes: 15, task: "Fix sentences that start or end the wrong way." },
      { title: "Spelling that counts", world: "Aerie wall", minutes: 20, task: "Correct the words a reader would stumble on." },
      { title: "Read it through", world: "Lookout torch", minutes: 15, task: "Read aloud and mark anything that still snags." },
    ],
  },
];

/** Crystal at the foot of the great tree */
const treehouseSpot = { x: 50.3, y: 64.5, w: 6, h: 10, labelAbove: true };
/** Broader hotspot over the tree canopy / observatory */
const treeCanopySpot = { x: 50.0, y: 38.0, w: 14, h: 28 };

const assignments = [
  {
    title: "How Refrigerators Changed Our Food",
    kind: "ECR",
    format: "Argument",
    teacher: "Mr. Verret",
    due: "Due tomorrow",
    action: "Begin",
    moduleId: "scr",
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
    moduleId: "scr",
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
    moduleId: "scr",
    lesson: "Details",
    current: false,
  },
];

const badges = [
  { id: "scr", label: "SCR", name: "Short responses", moduleId: "scr" },
  { id: "ecr", label: "ECR", name: "Extended responses", moduleId: "" },
  { id: "stellar", label: "Stellar", name: "Sentences", moduleId: "sentences" },
  { id: "process", label: "Process", name: "Preparing to write", moduleId: "plan" },
  { id: "revision", label: "Revision", name: "Revision", moduleId: "revise" },
  { id: "editing", label: "Editing", name: "Editing", moduleId: "edit" },
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
/** Cream frame on all four sides around the map + panel. */
const FRAME_GAP = 18;

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
  const [treehouse, setTreehouse] = useState(false);
  const [entryTitle, setEntryTitle] = useState<string | null>(null);
  const [writings, setWritings] = useState<Writing[]>(savedAtStart);

  const focused = modules.find((mod) => mod.id === moduleId) ?? null;
  const lesson = focused?.lessons.find((item) => item.title === lessonTitle) ?? null;
  const entry = writings.find((item) => item.title === entryTitle) ?? null;
  const focus = treehouse ? treehouseSpot : focused;

  function mastered(id: string) {
    const mod = modules.find((item) => item.id === id);
    if (!mod) return false;
    const finished = done[id] ?? [];
    return mod.lessons.every((item) => finished.includes(item.title));
  }

  function openModule(id: string, lessonName?: string, assignmentTitle?: string) {
    setTreehouse(false);
    setEntryTitle(null);
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
    setTreehouse(true);
    setEntryTitle(null);
    setShelfOpen(false);
  }

  function startQuickWrite() {
    setModuleId(null);
    setLessonTitle(null);
    setWriteTitle(null);
    setTreehouse(true);
    setQuick(true);
    setEntryTitle(null);
    setShelfOpen(false);
  }

  function backToMap() {
    setModuleId(null);
    setLessonTitle(null);
    setWriteTitle(null);
    setQuick(false);
    setTreehouse(false);
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
          body: "Saved in your Treehouse.",
        },
        ...current,
      ];
    });
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-cream">
      <header className="title-bar">
        <img src={asset("astra-banner.jpg")} alt="" className="title-banner" />
        <div className="title-bar-inner">
          <div className="title-left">
            <h1 className="title-heading">Astra’s Writing Adventure</h1>
          </div>
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
            <div className="mastery">
              <span className="mastery-label">Your Mastery</span>
              <div className="mastery-row">
                {badges.map((badge) => {
                  const active =
                    badge.id === "scr" ||
                    (badge.moduleId ? mastered(badge.moduleId) : false);
                  const src = asset(
                    `badges/${badge.id}-${active ? "active" : "inactive"}.png`,
                  );
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
                      className={active ? "medal medal-live" : "medal"}
                    >
                      <img src={src} alt="" className="medal-art" />
                      <span className="medal-label">{badge.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>
      <div
        className="flex min-h-0 w-full min-w-0 flex-1 overflow-hidden bg-cream"
        style={{ padding: FRAME_GAP }}
      >
      <div className="flex h-full min-h-0 w-full min-w-0 overflow-hidden bg-dusk">
      <div className="relative min-h-0 min-w-0 flex-1">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            transformOrigin: focus ? `${focus.x}% ${focus.y}%` : "50% 50%",
            transform: focus ? "scale(2.35)" : "scale(1)",
          }}
        >
          <div className="kingdom-scene">
            <div className="kingdom-scene-frame">
              <img
                src={asset("kingdom-map.jpg")}
                alt="Storybook kingdom map with six module crystals and the Treehouse"
                className="kingdom-scene-img"
              />
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => openModule(mod.id)}
                  aria-label={`Module ${mod.n}, ${mod.name}, ${mod.world}`}
                  className={
                    "kingdom-hotspot absolute -translate-x-1/2 -translate-y-1/2 " +
                    (focus ? "pointer-events-none opacity-0" : "")
                  }
                  style={{
                    left: `${mod.x}%`,
                    top: `${mod.y}%`,
                    width: `${mod.w}%`,
                    height: `${mod.h}%`,
                  }}
                >
                  <span className="kingdom-ring" aria-hidden="true" />
                  <span className={"kingdom-plate" + (mod.labelAbove ? " above" : "")}>
                    <span className="kingdom-plate-mod">M{mod.n} · {mod.short}</span>
                    <span className="kingdom-plate-world">{mod.world}</span>
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={openTreehouse}
                aria-label="Treehouse, your writing space"
                className={
                  "kingdom-hotspot tree-canopy-hotspot absolute -translate-x-1/2 -translate-y-1/2 " +
                  (focus ? "pointer-events-none opacity-0" : "")
                }
                style={{
                  left: `${treeCanopySpot.x}%`,
                  top: `${treeCanopySpot.y}%`,
                  width: `${treeCanopySpot.w}%`,
                  height: `${treeCanopySpot.h}%`,
                }}
              >
                <span className="kingdom-ring soft" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={openTreehouse}
                aria-label="Treehouse crystal, your writing space"
                className={
                  "kingdom-hotspot absolute -translate-x-1/2 -translate-y-1/2 " +
                  (focus ? "pointer-events-none opacity-0" : "")
                }
                style={{
                  left: `${treehouseSpot.x}%`,
                  top: `${treehouseSpot.y}%`,
                  width: `${treehouseSpot.w}%`,
                  height: `${treehouseSpot.h}%`,
                }}
              >
                <span className="kingdom-ring" aria-hidden="true" />
                <span className={"kingdom-plate" + (treehouseSpot.labelAbove ? " above" : "")}>
                  <span className="kingdom-plate-mod">Your space</span>
                  <span className="kingdom-plate-world">Treehouse</span>
                </span>
              </button>
            </div>
          </div>
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
        <section className="absolute inset-x-0 bottom-0 px-3 pb-3 sm:px-6 sm:pb-5">
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
      </div>
      <div className="pane-break" aria-hidden="true" />
      <QuickWrite onStart={startQuickWrite} />
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
          alt="Astra the wolf waving from the stairs of his treehouse"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
      <div className="pt-3">
        <p className="text-xs font-bold tracking-wide text-lantern">Treehouse</p>
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
    <section className="absolute inset-x-0 bottom-3 flex flex-col items-center gap-2 px-4">
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
            className={
              "start-write inline-flex min-h-11 shrink-0 items-center rounded-full bg-lantern px-4 text-sm font-bold text-cream" +
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
            className={
              "assign-chip grid size-12 place-items-center " +
              (assignments.length > 1 && !open ? "assign-chip-pulse" : "")
            }
          >
            <img src={asset("crystal.png")} alt="" className="assign-crystal" />
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
