import { useEffect, useState } from "react";
import { lessonLabel } from "./plan-b-lessons";
import "./plan-b-worlds.css";

/* ———————————————————————————————————————————————
   Plan B worlds: Emily's floating-islands hub map + six world pages.
   Art: public/worlds/plan-b/ (clean 1672x941 backgrounds, 16:9). Crystals, labels and
   plaques are live HTML placed from her With_Crystals_and_Labels mockups. Positions were
   measured by diffing each mockup against its clean image (Pillow/OpenCV) and are stored
   as % of the 16:9 frame, so they scale with the stage. The pedestals and blank plaques are
   painted into the clean art; only the crystals and text are added here.
   ——————————————————————————————————————————————— */

export type LessonState = "mastered" | "current" | "new" | "retry";

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;

export const MAP_BG = asset("worlds/plan-b/map.webp");

const CRYSTAL: Record<LessonState, string> = {
  mastered: asset("worlds/plan-b/crystal-blue.webp"),
  current: asset("worlds/plan-b/crystal-green.webp"),
  new: asset("worlds/plan-b/crystal-purple.webp"),
  retry: asset("worlds/plan-b/crystal-yellow.webp"),
};
export const CRYSTAL_SRC = CRYSTAL;

export const STATE_LABEL: Record<LessonState, string> = {
  mastered: "Mastered",
  current: "Up next",
  new: "Not started",
  retry: "Try again",
};

/** Hub map (01_Main_Map_mockup): crystal = bottom-centre anchor + height, label = top-centre.
    Merfolk's label sits above its crystal (nudged): in the mockup it is below, where it would
    sit under Plan B's "Current assignment" bar. */
export type HubSpot = { x: number; bottom: number; h: number; labelTop: number; labelAbove?: boolean };

export const HUB: Record<string, HubSpot> = {
  scr: { x: 19.2, bottom: 37.6, h: 5.6, labelTop: 37.9 },
  ecr: { x: 45.9, bottom: 30.4, h: 5.4, labelTop: 30.9 },
  sentences: { x: 77.7, bottom: 33.6, h: 5.8, labelTop: 34.4 },
  plan: { x: 79.5, bottom: 60.7, h: 5.4, labelTop: 61.6 },
  revise: { x: 59.5, bottom: 86.6, h: 6.0, labelTop: 80.0, labelAbove: true },
  edit: { x: 22.3, bottom: 79.8, h: 5.8, labelTop: 81.2 },
  treehouse: { x: 51.0, bottom: 66.1, h: 5.8, labelTop: 67.6 },
};

/** World pages: crystal anchor (x, bottom, h) + painted-plaque centre (x, py) and size (pw, ph).
    One entry per pedestal in the art, in lesson order. A page shows min(lessons, spots), so when
    new art adds pedestals (Fairy Hollow / Dwarven Stonehold), just append entries here. */
export type WorldSpot = {
  x: number;
  bottom: number;
  h: number;
  py: number;
  pw: number;
  ph: number;
  /** Near a stage edge: pin the label's left/right edge at `ax` (% of width) instead of centring it. */
  align?: "left" | "right";
  ax?: number;
  /** Max label width in cqw (default 16) where neighbouring labels would touch. */
  maxW?: number;
};
export type WorldArt = {
  slug: string;
  moduleId: string;
  bg: string;
  /** Horizontal anchor of the cover-cropped frame (0 = keep left edge, 0.5 = centre, 1 = keep right edge). */
  fx: number;
  spots: WorldSpot[];
};

export const WORLDS: WorldArt[] = [
  {
    slug: "fairy-hollow",
    moduleId: "scr",
    bg: asset("worlds/plan-b/fairy-hollow.webp"),
    fx: 0.5,
    /* Five pink-petal pedestals (Oct 6 art): L1 front-left, L2-L4 back, L5 front-right. */
    spots: [
      { x: 15.7, bottom: 73.8, h: 17.2, py: 80.6, pw: 10.4, ph: 5.4 },
      { x: 23.9, bottom: 43.0, h: 11.1, py: 46.9, pw: 9.4, ph: 4.2 },
      { x: 51.2, bottom: 46.1, h: 11.3, py: 50.3, pw: 9.3, ph: 4.2 },
      { x: 79.8, bottom: 46.8, h: 11.7, py: 50.9, pw: 9.6, ph: 4.4 },
      { x: 87.9, bottom: 78.0, h: 16.4, py: 84.5, pw: 11.4, ph: 5.4, align: "right", ax: 95.0 },
    ],
  },
  {
    slug: "dwarven-stonehold",
    moduleId: "ecr",
    bg: asset("worlds/plan-b/dwarven-stonehold.webp"),
    /* Six stone pedestals (Oct 6 art). Slightly right of centre so both edge plaques stay in view;
       the edge labels are pinned inward and the close back-row pairs get a narrower max width. */
    fx: 0.55,
    spots: [
      { x: 12.4, bottom: 64.6, h: 13.9, py: 69.0, pw: 9.5, ph: 5.2, align: "left", ax: 8.6 },
      { x: 30.4, bottom: 51.2, h: 7.5, py: 54.1, pw: 5.6, ph: 3.2, maxW: 12.5 },
      { x: 43.8, bottom: 49.8, h: 6.2, py: 52.1, pw: 4.9, ph: 3.0, maxW: 12.5 },
      { x: 70.4, bottom: 52.1, h: 6.4, py: 54.5, pw: 5.1, ph: 3.0, maxW: 12 },
      { x: 86.2, bottom: 55.3, h: 7.5, py: 57.9, pw: 5.8, ph: 3.2, maxW: 12 },
      { x: 91.4, bottom: 74.2, h: 12.4, py: 78.7, pw: 10.3, ph: 5.2, align: "right", ax: 95.5, maxW: 20 },
    ],
  },
  {
    slug: "elven-starspire",
    moduleId: "sentences",
    bg: asset("worlds/plan-b/elven-starspire.webp"),
    fx: 0.5,
    spots: [
      { x: 19.2, bottom: 76.0, h: 17.3, py: 81.3, pw: 8.8, ph: 4.6 },
      { x: 36.2, bottom: 60.4, h: 10.9, py: 63.0, pw: 6.0, ph: 3.0 },
      { x: 66.0, bottom: 59.7, h: 9.9, py: 63.6, pw: 6.0, ph: 3.0 },
      { x: 84.3, bottom: 74.4, h: 15.2, py: 80.9, pw: 9.2, ph: 4.6 },
    ],
  },
  {
    slug: "gnome-gearworks",
    moduleId: "plan",
    bg: asset("worlds/plan-b/gnome-gearworks.webp"),
    fx: 0.5,
    /* Emily's Gearworks art has five pedestals (Lesson 1-5 in her mockup). */
    spots: [
      { x: 17.4, bottom: 67.5, h: 10.7, py: 70.2, pw: 5.8, ph: 3.2 },
      { x: 29.6, bottom: 49.1, h: 6.5, py: 50.8, pw: 4.4, ph: 2.4 },
      { x: 50.5, bottom: 61.0, h: 11.2, py: 63.4, pw: 5.6, ph: 3.0 },
      { x: 71.5, bottom: 49.3, h: 6.7, py: 50.9, pw: 4.4, ph: 2.4 },
      { x: 82.9, bottom: 67.5, h: 10.7, py: 70.3, pw: 5.8, ph: 3.2 },
    ],
  },
  {
    slug: "merfolk-lagoon",
    moduleId: "revise",
    bg: asset("worlds/plan-b/merfolk-lagoon.webp"),
    fx: 0.5,
    spots: [
      { x: 16.6, bottom: 68.2, h: 15.4, py: 75.1, pw: 8.8, ph: 4.8 },
      { x: 34.1, bottom: 50.8, h: 8.2, py: 53.6, pw: 6.6, ph: 3.3 },
      { x: 69.9, bottom: 52.0, h: 7.8, py: 54.7, pw: 6.6, ph: 3.3 },
      { x: 83.4, bottom: 69.4, h: 14.3, py: 75.4, pw: 9.6, ph: 5.2 },
    ],
  },
  {
    slug: "dragons-roost",
    moduleId: "edit",
    bg: asset("worlds/plan-b/dragons-roost.webp"),
    fx: 0.5,
    spots: [
      { x: 19.5, bottom: 61.9, h: 14.8, py: 66.6, pw: 8.0, ph: 4.4 },
      { x: 34.4, bottom: 53.4, h: 10.6, py: 56.8, pw: 6.2, ph: 3.0 },
      { x: 69.8, bottom: 54.0, h: 11.5, py: 56.9, pw: 6.2, ph: 3.0 },
      { x: 84.0, bottom: 63.9, h: 14.1, py: 68.5, pw: 8.4, ph: 4.6 },
    ],
  },
];

export const worldBySlug = (slug: string | null) => WORLDS.find((w) => w.slug === slug) ?? null;
export const worldByModule = (id: string) => WORLDS.find((w) => w.moduleId === id) ?? null;

/* ——— Lesson progress (demo): localStorage, seeded per world; ?demo=reset restores the seed ——— */
const PROGRESS_KEY = "astra.planb.lessons.v1";
const SEED: LessonState[] = ["mastered", "retry", "current", "new", "new"];
/** Emily's real example lesson (/demo/lesson/) is Module 3 · Lesson 3, Details & Evidence. */
const DEMO_LESSON_FLAG = "details-and-evidence";
export const DEMO_LESSON = { moduleId: "sentences", index: 2, title: "Details & Evidence", url: `${import.meta.env.BASE_URL}../demo/lesson/?from=planb` };

export function demoParams() {
  const out = new URLSearchParams(window.location.search);
  const q = window.location.hash.split("?")[1];
  if (q) new URLSearchParams(q).forEach((v, k) => out.set(k, v));
  return out;
}

function seed(): Record<string, LessonState[]> {
  return Object.fromEntries(WORLDS.map((w) => [w.moduleId, SEED.slice(0, w.spots.length)]));
}

export function readProgress(): Record<string, LessonState[]> {
  const base = seed();
  try {
    if (demoParams().get("demo") === "reset") {
      localStorage.removeItem(PROGRESS_KEY);
      const k = "astra-demo-alex-v1";
      const p = JSON.parse(localStorage.getItem(k) || "{}");
      delete p[DEMO_LESSON_FLAG];
      localStorage.setItem(k, JSON.stringify(p));
      return base;
    }
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") as Record<string, LessonState[]>;
    for (const id of Object.keys(base)) if (Array.isArray(saved[id])) base[id] = base[id].map((s, i) => saved[id][i] ?? s);
    // Finishing the real lesson page lights its crystal blue and moves "current" on.
    const lessonDemo = JSON.parse(localStorage.getItem("astra-demo-alex-v1") || "{}");
    if (lessonDemo[DEMO_LESSON_FLAG]) {
      const list = base[DEMO_LESSON.moduleId];
      list[DEMO_LESSON.index] = "mastered";
      const next = list.indexOf("new");
      if (!list.includes("current") && next >= 0) list[next] = "current";
    }
  } catch {
    /* ignore bad demo state */
  }
  return base;
}

export function useProgress() {
  const [progress] = useState(readProgress);
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      /* ignore */
    }
  }, [progress]);
  return progress;
}

/* ——— Pieces ——— */

export function Crystal({ state, className = "" }: { state: LessonState; className?: string }) {
  return (
    <span className={`pb-crystal pb-crystal-${state} ${className}`} aria-hidden="true">
      <span className="pb-crystal-glow" />
      <img src={CRYSTAL[state]} alt="" className="pb-crystal-img" draggable={false} />
    </span>
  );
}

type WorldLesson = { title: string };

export function WorldPage({
  world,
  moduleN,
  moduleShort,
  worldName,
  lessons,
  states,
  entering,
}: {
  world: WorldArt;
  moduleN: number;
  moduleShort: string;
  worldName: string;
  lessons: WorldLesson[];
  states: LessonState[];
  entering: boolean;
}) {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  function open(i: number) {
    if (world.moduleId === DEMO_LESSON.moduleId && lessons[i]?.title === DEMO_LESSON.title) {
      window.location.href = DEMO_LESSON.url;
      return;
    }
    setToast(`${lessonLabel(i, lessons[i].title)} is coming soon!`);
  }

  return (
    <div className={"kingdom-scene pb-world" + (entering ? " pb-world-enter" : "")}>
      <div className="kingdom-scene-frame pb-frame" style={{ ["--fx" as string]: world.fx }}>
        <img src={world.bg} alt={`${worldName}, Module ${moduleN} ${moduleShort}`} className="kingdom-scene-img" />
        {world.spots.slice(0, lessons.length).map((spot, i) => {
          const state = states[i] ?? "new";
          const label = lessonLabel(i, lessons[i].title);
          return (
            <div key={i} className="pb-spot">
              <button
                type="button"
                onClick={() => open(i)}
                className="pb-lesson-crystal"
                aria-label={`${label}, ${STATE_LABEL[state]}`}
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.bottom - spot.h}%`,
                  height: `${spot.h}%`,
                  ["--d" as string]: `${i * -0.7}s`,
                }}
              >
                <Crystal state={state} />
              </button>
              {/* One label, "Lesson N: Name", widened past the painted plaque and wrapping to 2 lines. */}
              <button
                type="button"
                tabIndex={-1}
                onClick={() => open(i)}
                className={
                  "pb-plaque" + (state === "current" ? " is-current" : "") + (spot.align ? ` align-${spot.align}` : "")
                }
                style={{
                  left: `${spot.align && spot.ax !== undefined ? spot.ax : spot.x}%`,
                  ["--plaque-max" as string]: spot.maxW ? `${spot.maxW}cqw` : undefined,
                  top: `${spot.py}%`,
                  minWidth: `${spot.pw}%`,
                  minHeight: `${spot.ph}%`,
                  ["--ph" as string]: spot.ph,
                }}
              >
                {label}
              </button>
            </div>
          );
        })}
      </div>
      <div className="pb-world-name" aria-hidden="true">
        <span className="pb-world-name-mod">M{moduleN} · {moduleShort}</span>
        <span className="pb-world-name-world">{worldName}</span>
      </div>
      {toast ? (
        <p className="pb-toast" role="status">
          {toast}
        </p>
      ) : null}
    </div>
  );
}
