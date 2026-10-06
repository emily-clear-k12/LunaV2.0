import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronRight, Feather } from "lucide-react";
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
import "./plan-b-hub.css";
import { AssignCrystalArt } from "./assign-crystal";

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
  { id: "ecr", label: "ECR", name: "Extended responses", moduleId: "ecr" },
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

/* Treehouse-balcony frame (Emily, Oct 6): 1672x941 art with the map window keyed transparent. */
const HUB_FRAME = asset("worlds/plan-b/hub-frame.webp");
const ASTRA_PORTRAIT = asset("worlds/plan-b/astra-portrait.webp");
const GOAL_COMPASS = asset("worlds/plan-b/goal-compass.webp");
const CRYSTAL_ICON = asset("worlds/plan-b/crystal-blue.webp");

function StudentHome() {
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, string[]>>({
    sentences: modules[0].lessons.map((lesson) => lesson.title),
  });
  const [shelfOpen, setShelfOpen] = useState(false);
  const [writeTitle, setWriteTitle] = useState<string | null>(null);
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
    setShelfOpen(false);
    if (world || focus) {
      // From the side panel while a world or card is open: switch straight to that world.
      backToMap();
      history.pushState(null, "", `#world/${target.slug}`);
      setWorldSlug(target.slug);
      return;
    }
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
    if (world) leaveWorld();
    setTreehouse(false);
    setEntryTitle(null);
    setModuleId(id || null);
    setLessonTitle(lessonName ?? null);
    setWriteTitle(assignmentTitle ?? null);
    setQuick(false);
    setShelfOpen(false);
  }

  function openTreehouse() {
    if (world) leaveWorld();
    setModuleId(null);
    setLessonTitle(null);
    setWriteTitle(null);
    setQuick(false);
    setTreehouse(true);
    setEntryTitle(null);
    setShelfOpen(false);
  }

  function startQuickWrite() {
    if (world) leaveWorld();
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

  const today = assignments[0];
  const hideMarkers = Boolean(focus || leaving || world);

  return (
    <div className="pb-root h-dvh w-full">
      <div className="pb-stage">
        {/* Map window (behind the frame): the hub map, or a world page. */}
        <div className="pb-window pb-map-clip">
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
              className={"pb-mapbox pb-hub-scene" + (leaving ? " is-leaving" : "") + (mapEnter ? " pb-map-enter" : "")}
              style={{
                transformOrigin: leaving
                  ? `${leaving.x}% ${leaving.y}%`
                  : focus
                    ? `${focus.x}% ${focus.y}%`
                    : "50% 50%",
                transform: leaving ? "scale(1.9)" : focus ? "scale(2.35)" : "scale(1)",
              }}
            >
              <img
                src={MAP_BG}
                alt="Floating islands map with six module worlds around Astra’s Treehouse"
                className="pb-map-img"
              />
            </div>
          )}
        </div>

        <img src={HUB_FRAME} alt="" className="pb-frame-art" draggable={false} />

        {/* Crystals + labels sit above the frame so the railing never hides them. */}
        <div className="pb-window pb-marker-layer">
          <div className={"pb-mapbox pb-frame" + (hideMarkers ? " is-hidden" : "")}>
            <button
              type="button"
              onClick={openTreehouse}
              aria-label="Treehouse, your writing space"
              tabIndex={-1}
              className="kingdom-hotspot tree-canopy-hotspot absolute -translate-x-1/2 -translate-y-1/2"
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
                  <div key={item.id} className="pb-hub-item">
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

        <header className="pb-ribbon">
          <img src={CRYSTAL_ICON} alt="" className="pb-ribbon-crystal" />
          <h1 className="pb-ribbon-title">Astra’s Writing Adventure</h1>
        </header>

        <aside className="pb-panel" aria-label="Astra, mastery, goal and Treehouse">
          <section className="pb-sec pb-sec-tip">
            <img src={ASTRA_PORTRAIT} alt="Astra the wolf" className="pb-portrait" />
            <div className="min-w-0">
              <p className="pb-cap">Astra’s Tip</p>
              <p className="pb-tip-text">{CLASS_FOCUS}</p>
            </div>
          </section>

          <section className="pb-sec pb-sec-mastery">
            <h2 className="pb-sec-title">Your Mastery</h2>
            <div className="pb-medals">
              {badges.map((badge) => {
                const active = badge.id === "scr" || (badge.moduleId ? mastered(badge.moduleId) : false);
                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => goWorld(badge.moduleId)}
                    aria-current={active ? "true" : undefined}
                    title={badge.name}
                    className={"pb-medal" + (active ? " is-active" : "")}
                  >
                    <img
                      src={asset(`badges/${badge.id}-${active ? "active" : "inactive"}.png`)}
                      alt=""
                      className="pb-medal-art"
                    />
                    <span className="pb-medal-label">{badge.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="pb-sec pb-sec-goal">
            <img src={GOAL_COMPASS} alt="" className="pb-compass" />
            <div className="min-w-0">
              <p className="pb-cap">My Goal</p>
              <p className="pb-goal-text">{MY_GOAL}</p>
            </div>
          </section>

          <section className="pb-sec pb-sec-tree">
            <p className="pb-cap">Treehouse</p>
            <h2 className="pb-tree-title">Robot at School</h2>
            <p className="pb-tree-text">A robot joins your class. What happens during the day?</p>
            <button type="button" onClick={startQuickWrite} className="pb-pill pb-pill-big">
              <Feather className="pb-pill-icon" strokeWidth={2.4} aria-hidden="true" />
              <span>Quick write</span>
              <ChevronRight className="pb-pill-chev" strokeWidth={2.6} aria-hidden="true" />
            </button>
          </section>
        </aside>

        <div className="pb-bottom">
          <button
            type="button"
            onClick={() => setShelfOpen((value) => !value)}
            aria-label={shelfOpen ? "Hide assignments" : "Show all assignments"}
            aria-expanded={shelfOpen}
            className="pb-bottom-crystal pb-assign-crystal"
          >
            <AssignCrystalArt src={CRYSTAL_ICON} />
          </button>
          <button
            type="button"
            onClick={() => setShelfOpen((value) => !value)}
            aria-expanded={shelfOpen}
            className="pb-bottom-text"
          >
            <span className="pb-cap">Current assignment</span>
            <span className="pb-bottom-title">{today.title}</span>
          </button>
          <button
            type="button"
            onClick={() => openModule(today.moduleId, today.lesson, today.title)}
            className="pb-pill pb-pill-start"
          >
            <Feather className="pb-pill-icon" strokeWidth={2.4} aria-hidden="true" />
            <span>Start writing</span>
            <ChevronRight className="pb-pill-chev" strokeWidth={2.6} aria-hidden="true" />
          </button>
        </div>

        {shelfOpen ? (
          <div className="pb-assign-pop">
            <ul className="max-h-[42vh] overflow-y-auto px-2 py-1">
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
                    onClick={() => openModule(item.moduleId, item.lesson, item.title)}
                    className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-ink px-3 text-sm font-bold text-cream"
                  >
                    {item.action}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Cards + Back to map float above the frame, inside the map window. */}
        <div className="pb-window pb-card-layer">
          {focus || world ? (
            <button type="button" onClick={backToMap} className="pb-back">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to map
            </button>
          ) : null}
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
      </div>
    </div>
  );
}

function slugFromHash() {
  const m = window.location.hash.match(/^#\/?world\/([a-z-]+)/);
  return m ? m[1] : null;
}
