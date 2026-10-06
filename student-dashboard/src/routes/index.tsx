import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check, Compass, Feather } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Crystal,
  HUB,
  MAP_BG,
  WorldPage,
  useProgress,
  worldByModule,
  worldBySlug,
} from "./plan-b-worlds";
import { M1_VARIANT, M1_VARIANTS, PLAN_B_LESSONS, lessonLabel, type PlanBLesson } from "./plan-b-lessons";

export const Route = createFileRoute("/")({ component: StudentHome });

type Lesson = PlanBLesson;

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
    x: 19.2,
    y: 34.8,
    w: 5.5,
    h: 9,
    lessons: PLAN_B_LESSONS.scr,
  },
  {
    id: "ecr",
    n: 2,
    name: "ECR",
    short: "ECR",
    world: "Dwarven Stonehold",
    blurb: "Extended responses that build a full argument.",
    x: 45.9,
    y: 27.7,
    w: 5.5,
    h: 9,
    lessons: PLAN_B_LESSONS.ecr,
  },
  {
    id: "sentences",
    n: 3,
    name: "Stellar Writers",
    short: "Stellar",
    world: "Elven Starspire",
    blurb: "Sentences that hold one clear idea.",
    x: 77.7,
    y: 30.7,
    w: 5.5,
    h: 9,
    lessons: PLAN_B_LESSONS.sentences,
  },
  {
    id: "plan",
    n: 4,
    name: "The Writing Process",
    short: "Process",
    world: "Gnome Gearworks",
    blurb: "Read the prompt, take notes, make a plan.",
    x: 79.5,
    y: 58.0,
    w: 5.5,
    h: 9,
    lessons: PLAN_B_LESSONS.plan,
  },
  {
    id: "revise",
    n: 5,
    name: "Revision",
    short: "Revision",
    world: "Merfolk Lagoon",
    blurb: "Make the draft clearer and stronger.",
    x: 59.5,
    y: 83.6,
    w: 5.5,
    h: 9,
    labelAbove: true,
    lessons: PLAN_B_LESSONS.revise,
  },
  {
    id: "edit",
    n: 6,
    name: "Edit",
    short: "Edit",
    world: "Dragon’s Roost",
    blurb: "Polish conventions until the writing is clear.",
    x: 22.3,
    y: 76.9,
    w: 5.5,
    h: 9,
    labelAbove: true,
    lessons: PLAN_B_LESSONS.edit,
  },
];

/** Crystal at the foot of the great tree */
const treehouseSpot = { x: HUB.treehouse.x, y: 62.0, w: 6, h: 10, labelAbove: true };
/** Broader hotspot over the tree canopy / observatory */
const treeCanopySpot = { x: 50.0, y: 40.0, w: 15, h: 30 };

/** Assignments point at an M1 lesson by topic, so they follow whichever M1 variant is set. */
function m1Lesson(match: RegExp) {
  return (PLAN_B_LESSONS.scr.find((l) => match.test(l.title)) ?? PLAN_B_LESSONS.scr[0]).title;
}

const assignments = [
  {
    title: "How Refrigerators Changed Our Food",
    kind: "ECR",
    format: "Argument",
    teacher: "Mr. Verret",
    due: "Due tomorrow",
    action: "Begin",
    moduleId: "scr",
    lesson: m1Lesson(/Evidence/),
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
    lesson: m1Lesson(/Evidence/),
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
    lesson: m1Lesson(/Expla/),
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
    title: "Lesson 1: Writing Sentences",
    from: "Stellar Writers",
    body: "A sentence holds one idea. The fox waited on the stone until the lantern was lit.",
  },
  {
    title: "Lesson 2: Connecting Ideas",
    from: "Stellar Writers",
    body: "The writer followed the path. The crystal marked the turn.",
  },
];

// Public images live under the site's base path (/LunaV2.0/dashboard/ on GitHub Pages).
const CLASS_FOCUS = "Today, let's back every answer with evidence from the text!";
const MY_GOAL = "Back up my opinion with strong, specific reasons.";

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
  /* World pages live at #world/<slug> (like Plan A's #world/starfall). */
  const [worldSlug, setWorldSlug] = useState<string | null>(() => slugFromHash());
  const [leaving, setLeaving] = useState<{ x: number; y: number } | null>(null);
  const [mapEnter, setMapEnter] = useState(false);
  const progress = useProgress();

  useEffect(() => {
    const onHash = () => {
      setWorldSlug(slugFromHash());
      setLeaving(null);
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("popstate", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("popstate", onHash);
    };
  }, []);

  const world = worldBySlug(worldSlug);
  const worldMod = world ? modules.find((mod) => mod.id === world.moduleId) ?? null : null;

  const focused = modules.find((mod) => mod.id === moduleId) ?? null;
  const lessonIndex = focused ? focused.lessons.findIndex((item) => item.title === lessonTitle) : -1;
  const lesson = focused && lessonIndex >= 0 ? focused.lessons[lessonIndex] : null;
  const lessonName = lesson ? lessonLabel(lessonIndex, lesson.title) : "";
  const entry = writings.find((item) => item.title === entryTitle) ?? null;
  const focus = treehouse ? treehouseSpot : focused;

  function mastered(id: string) {
    const mod = modules.find((item) => item.id === id);
    if (!mod) return false;
    const finished = done[id] ?? [];
    return mod.lessons.every((item) => finished.includes(item.title));
  }

  /** Zoom + fade toward the island, then open its world page. */
  function goWorld(id: string) {
    const target = worldByModule(id);
    if (!target || leaving) return;
    setEcrNote(false);
    setShelfOpen(false);
    const spot = HUB[id];
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setLeaving({ x: spot.x, y: spot.bottom - spot.h / 2 });
    window.setTimeout(() => {
      history.pushState(null, "", `#world/${target.slug}`);
      setWorldSlug(target.slug);
      setLeaving(null);
      setMapEnter(false);
    }, reduce ? 60 : 480);
  }

  function leaveWorld() {
    history.pushState(null, "", window.location.pathname + window.location.search);
    setWorldSlug(null);
    setMapEnter(true);
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
    if (world) leaveWorld();
    setModuleId(null);
    setLessonTitle(null);
    setWriteTitle(null);
    setQuick(false);
    setTreehouse(false);
    setEntryTitle(null);
  }

  function markDone(moduleKey: string, title: string, label = title) {
    setDone((current) => {
      const list = current[moduleKey] ?? [];
      if (list.includes(title)) return current;
      return { ...current, [moduleKey]: [...list, title] };
    });
    setWritings((current) => {
      if (current.some((item) => item.title === label)) return current;
      const mod = modules.find((item) => item.id === moduleKey);
      return [
        {
          title: label,
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
          {focus || world ? (
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
                          if (world) leaveWorld();
                          goWorld(badge.moduleId);
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
        {world && worldMod ? (
          <WorldPage
            key={world.slug}
            world={world}
            moduleN={worldMod.n}
            moduleShort={worldMod.id === "scr" && M1_VARIANT !== "scr" ? `${worldMod.short} · ${M1_VARIANTS[M1_VARIANT].label}` : worldMod.short}
            worldName={worldMod.world}
            lessons={worldMod.lessons}
            states={progress[world.moduleId] ?? []}
            entering
          />
        ) : (
        <div
          className={
            "pb-hub-scene absolute inset-0 transition-transform duration-700 ease-out" +
            (leaving ? " is-leaving" : "") +
            (mapEnter ? " pb-map-enter" : "")
          }
          style={{
            transformOrigin: leaving
              ? `${leaving.x}% ${leaving.y}%`
              : focus
                ? `${focus.x}% ${focus.y}%`
                : "50% 50%",
            transform: leaving ? "scale(1.9)" : focus ? "scale(2.35)" : "scale(1)",
          }}
        >
          <div className="kingdom-scene">
            <div className="kingdom-scene-frame pb-frame">
              <img
                src={MAP_BG}
                alt="Floating islands map with six module worlds around Astra’s Treehouse"
                className="kingdom-scene-img"
              />
              <button
                type="button"
                onClick={openTreehouse}
                aria-label="Treehouse, your writing space"
                tabIndex={-1}
                className={
                  "kingdom-hotspot tree-canopy-hotspot absolute -translate-x-1/2 -translate-y-1/2 " +
                  (focus || leaving ? "pointer-events-none opacity-0" : "")
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
              {[...modules.map((mod) => ({ id: mod.id, top: `M${mod.n} · ${mod.short}`, name: mod.world, n: mod.n })), { id: "treehouse", top: "Your space", name: "Treehouse", n: 0 }].map((item, i) => {
                const spot = HUB[item.id];
                const onOpen = item.id === "treehouse" ? openTreehouse : () => goWorld(item.id);
                const label = item.n ? `Module ${item.n}, ${item.name}` : "Treehouse, your writing space";
                return (
                  <div
                    key={item.id}
                    className={"pb-hub-item" + (focus || leaving ? " pointer-events-none opacity-0 transition-opacity" : "")}
                  >
                    <button
                      type="button"
                      onClick={onOpen}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="pb-hub-crystal"
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.bottom - spot.h}%`,
                        height: `${spot.h}%`,
                        ["--d" as string]: `${i * -0.5}s`,
                      }}
                    >
                      <Crystal state="mastered" />
                    </button>
                    <button
                      type="button"
                      onClick={onOpen}
                      aria-label={label}
                      className={"pb-hub-label" + (spot.labelAbove ? " above" : "")}
                      style={{ left: `${spot.x}%`, top: `${spot.labelTop}%` }}
                    >
                      <span className="pb-hub-label-mod">{item.top}</span>
                      <span className="pb-hub-label-world">{item.name}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        )}
        </div>

      {focused && lesson ? (
        <section className="absolute inset-x-0 bottom-0 px-3 pb-3 sm:px-6 sm:pb-5">
          <div className="mx-auto max-w-xl rounded-3xl bg-cream p-5 text-ink shadow-2xl">
            <p className="text-sm font-bold text-lantern">
              {focused.name} · {focused.world}
            </p>
            <h2 className="mt-1 font-display text-3xl">{writeTitle ?? lessonName}</h2>
            {writeTitle ? <p className="mt-1 text-sm text-muted">{lessonName}</p> : null}
            {lesson.task ? <p className="mt-3">{lesson.task}</p> : null}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {(done[focused.id] ?? []).includes(lesson.title) ? (
                <span className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-moss">
                  <Check className="size-4" aria-hidden="true" />
                  Saved to Treehouse
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => markDone(focused.id, lesson.title, lessonName)}
                  className="inline-flex min-h-11 items-center rounded-full bg-moss px-4 text-sm font-bold text-cream"
                >
                  Save to Treehouse
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const id = focused.id;
                  backToMap();
                  goWorld(id);
                }}
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

      {!focus && !quick && !world ? (
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
      <QuickWrite onStart={startQuickWrite} />
      </div>
      </div>
    </div>
  );
}

function slugFromHash() {
  const m = window.location.hash.match(/^#\/?world\/([a-z-]+)/);
  return m ? m[1] : null;
}

function QuickWrite({ onStart }: { onStart: () => void }) {
  return (
    <aside className="planb-guide flex w-[17.5rem] shrink-0 flex-col gap-2 bg-cream px-2.5 pt-2.5 pb-3 text-ink">
      <div className="planb-astra relative min-h-0 flex-[1.15] overflow-hidden rounded-2xl shadow-md">
        <img
          src={asset("astra-treehouse.jpg")}
          alt="Astra the wolf waving from the stairs of his treehouse"
          className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
        />
        <div className="planb-tip-bubble">
          <p className="planb-tip-label">Astra’s tip</p>
          <p className="planb-tip-text">{CLASS_FOCUS}</p>
        </div>
      </div>

      <div className="goal-compass">
        <div className="goal-compass-icon" aria-hidden="true">
          <Compass className="size-5" strokeWidth={2.4} />
        </div>
        <div className="min-w-0">
          <p className="goal-compass-label">My goal</p>
          <p className="goal-compass-text">{MY_GOAL}</p>
        </div>
      </div>

      <div className="planb-quest">
        <p className="planb-quest-label">Treehouse</p>
        <h2 className="planb-quest-title">Robot at School</h2>
        <p className="planb-quest-body">A robot joins your class. What happens during the day?</p>
        <button type="button" onClick={onStart} className="crystal-btn mt-2">
          <span className="crystal-btn-icon" aria-hidden="true">
            <Feather className="size-3.5" strokeWidth={2.5} />
          </span>
          Quick write
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
