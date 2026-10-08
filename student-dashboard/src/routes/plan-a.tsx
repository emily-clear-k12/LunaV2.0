import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DEMO_LESSON_TITLE, StarfallWorld } from "./world-starfall";

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

const CLASS_FOCUS = "Today, let's back every answer with evidence from the text!";

/** Demo mastery seeds — not live student data. */
const DEMO_DONE: Record<string, string[]> = {
  scr: ["Answer the ask", "Cite the text", "Explain the link"],
  ecr: ["Claim the sky"],
  sentences: ["Writing Sentences", "Connecting Ideas"],
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
    y: 60.5,
    w: 11,
    h: 31,
    tagY: 80.2,
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
    y: 60.5,
    w: 11,
    h: 31,
    tagY: 80.2,
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
    x: 51.6,
    y: 60.5,
    w: 11,
    h: 31,
    tagY: 80.2,
    accent: "#b46bff",
    lessons: [
      { title: "Writing Sentences", world: "First stones", minutes: 20, task: "Write three sentences that each say one whole idea." },
      { title: "Connecting Ideas", world: "Root bridge", minutes: 20, task: "Join two short sentences without losing either idea." },
      { title: "Details & Evidence", world: "Twin trunks", minutes: 20, task: "Use details to bring a story to life, then choose strong evidence and quote it." },
      { title: "Vocabulary & Language", world: "Wishing hill", minutes: 20, task: "Pick strong, exact words that make your sentences shine." },
    ],
  },
  {
    id: "plan",
    n: 4,
    name: "The Writing Process",
    short: "Process",
    world: "Ember Forge",
    blurb: "Read the prompt, take notes, make a plan.",
    x: 64.6,
    y: 60.5,
    w: 11,
    h: 31,
    tagY: 80.2,
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
    x: 78.2,
    y: 60.5,
    w: 11,
    h: 31,
    tagY: 80.2,
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
    x: 92.5,
    y: 60.5,
    w: 11,
    h: 31,
    tagY: 83.5,
    accent: "#ff6fa8",
    lessons: [
      { title: "Capitals and stops", world: "Fallen leaves", minutes: 15, task: "Fix sentences that start or end the wrong way." },
      { title: "Spelling that counts", world: "Red maples", minutes: 20, task: "Correct the words a reader would stumble on." },
      { title: "Read it through", world: "Last lantern", minutes: 15, task: "Read aloud and mark anything that still snags." },
    ],
  },
];

/* Portal x/y/w/h/tagY are frame-% of the 1280x720 animated hub (portal-hub-loop-v3 /
   portal-hub-poster-v3.jpg; v3 = the loop with the two blank lantern plaques painted out). */

type View = { page: "hub" } | { page: "world"; id: "starfall" };

/* ——— Portal worlds: demo progress + coins persist in localStorage so the world is testable ——— */
const COINS_KEY = "astra.coins";
/** Starting demo coins (shown inside the portal worlds). */
const COINS_AT_START = 120;
const lessonsKey = (modId: string) => `astra.lessons.${modId}`;

function useReducedMotion() {
  const [reduce, setReduce] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

function readCoins(): number {
  try {
    const n = Number(localStorage.getItem(COINS_KEY));
    return localStorage.getItem(COINS_KEY) !== null && Number.isFinite(n) ? n : COINS_AT_START;
  } catch {
    return COINS_AT_START;
  }
}

/** Starfall lesson titles were renamed (Oct 2026); keep saved demo progress working. */
const RENAMED_LESSONS: Record<string, string> = {
  "One complete thought": "Writing Sentences",
  "Who did what": "Connecting Ideas",
  "Join two ideas": "Details & Evidence",
  "Grow the sentence": "Vocabulary & Language",
};

function readDone(): Record<string, string[]> {
  const out = { ...DEMO_DONE };
  try {
    const raw = localStorage.getItem(lessonsKey("sentences"));
    if (raw) out.sentences = (JSON.parse(raw) as string[]).map((t) => RENAMED_LESSONS[t] ?? t);
    // Emily's example lesson (/demo/lesson/) records its own finish under this key.
    const lessonDemo = JSON.parse(localStorage.getItem("astra-demo-alex-v1") || "{}");
    if (lessonDemo["details-and-evidence"] && !(out.sentences ?? []).includes(DEMO_LESSON_TITLE)) {
      out.sentences = [...(out.sentences ?? []), DEMO_LESSON_TITLE];
    }
  } catch {
    /* ignore bad demo state */
  }
  return out;
}

function parseHash(hash: string): View {
  const parts = hash.replace(/^#\/?/, "").split("?")[0].split("/").filter(Boolean);
  if (parts[0] === "world" && parts[1] === "starfall") return { page: "world", id: "starfall" };
  return { page: "hub" };
}

function viewHash(v: View): string {
  return v.page === "world" ? `#world/${v.id}` : "";
}

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
  const [done, setDone] = useState<Record<string, string[]>>(readDone);
  const [coins, setCoins] = useState<number>(readCoins);
  const [dive, setDive] = useState<{ x: number; y: number; ox: number; oy: number; reduce: boolean } | null>(null);
  const [cameByPortal, setCameByPortal] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<View>(() => parseHash(window.location.hash));

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
    try {
      localStorage.setItem(COINS_KEY, String(coins));
    } catch {
      /* ignore */
    }
  }, [coins]);

  useEffect(() => {
    try {
      localStorage.setItem(lessonsKey("sentences"), JSON.stringify(done.sentences ?? []));
    } catch {
      /* ignore */
    }
  }, [done.sentences]);

  /** Portal dive: the scene zooms into the tapped portal while its light floods the screen,
      then the world takes over (reduced motion: a plain fade). */
  function diveInto(el: HTMLElement) {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const r = el.getBoundingClientRect();
    const stage = sceneRef.current?.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.42;
    setDive({
      x: stage ? ((cx - stage.left) / stage.width) * 100 : 50,
      y: stage ? ((cy - stage.top) / stage.height) * 100 : 50,
      ox: stage ? cx - stage.left : 0,
      oy: stage ? cy - stage.top : 0,
      reduce,
    });
    window.setTimeout(() => {
      setCameByPortal(true);
      navigate({ page: "world", id: "starfall" });
      setDive(null);
    }, reduce ? 300 : 680);
  }

  function navigate(next: View) {
    const hash = viewHash(next);
    if (hash !== window.location.hash) {
      history.pushState(null, "", hash || window.location.pathname + window.location.search);
    }
    setView(next);
    window.scrollTo(0, 0);
  }

  function earn(amount: number) {
    setCoins((c) => c + amount);
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

  function openModule(id: string) {
    setModuleId(id);
    setLessonTitle(null);
  }

  function backToHub() {
    setModuleId(null);
    setLessonTitle(null);
  }

  function markDone(moduleKey: string, title: string) {
    setDone((current) => {
      const list = current[moduleKey] ?? [];
      if (list.includes(title)) return current;
      return { ...current, [moduleKey]: [...list, title] };
    });
    earn(10);
  }

  const toHub = () => navigate({ page: "hub" });

  if (view.page === "world") {
    const mod = modules.find((m) => m.id === "sentences")!;
    return (
      <StarfallWorld
        mod={mod}
        done={done.sentences ?? []}
        setDone={(list) => setDone((cur) => ({ ...cur, sentences: list }))}
        defaultDone={DEMO_DONE.sentences}
        coins={coins}
        onEarn={(_label, amount) => earn(amount)}
        onBack={() => {
          setCameByPortal(false);
          toHub();
        }}
        autoSpeak={cameByPortal}
      />
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
                  badge.id === "scr" || mastered(badge.moduleId);
                const src = asset(`badges/${badge.id}-${active ? "active" : "inactive"}.png`);
                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => openModule(badge.moduleId)}
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
              ref={sceneRef}
              className="absolute inset-0 transition-transform duration-700 ease-out"
              style={
                dive && !dive.reduce
                  ? {
                      transformOrigin: `${dive.ox}px ${dive.oy}px`,
                      transform: "scale(3.4)",
                      transition: "transform 680ms cubic-bezier(0.55, 0, 0.8, 0.4)",
                    }
                  : {
                      transformOrigin: focused ? `${focused.x}% ${focused.y}%` : "50% 45%",
                      transform: focus ? "scale(1.85)" : "scale(1)",
                    }
              }
            >
              <div className="zscene">
                <div className="zscene-frame">
                  {/* Emily's animated hub (seamless 1s cross-fade loop). The poster still stays
                      underneath as the fallback and is all reduced-motion users see. */}
                  <img
                    src={asset("portal-hub-poster-v3.jpg")}
                    alt="Astra beside six magical portals under a lantern treehouse"
                    className="zscene-img"
                  />
                  {!reduceMotion ? (
                    <video
                      className="zscene-img zscene-video"
                      poster={asset("portal-hub-poster-v3.jpg")}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      disablePictureInPicture
                      aria-hidden="true"
                      onCanPlay={(e) => e.currentTarget.classList.add("ready")}
                    >
                      <source src={asset("portal-hub-loop-v3.mp4")} type="video/mp4" />
                      <source src={asset("portal-hub-loop-v3.webm")} type="video/webm" />
                    </video>
                  ) : null}

                  {/* Astra's tip: always showing so today's focus stays in view */}
                  <div className="z-tip" role="note" aria-label="Astra’s tip">
                    <span className="z-tip-k">✦ Astra’s tip</span>
                    <span className="z-tip-t">{CLASS_FOCUS}</span>
                  </div>

                  {modules.map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={(e) => (mod.id === "sentences" ? diveInto(e.currentTarget) : openModule(mod.id))}
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
                <h2 className="mt-1 font-display text-3xl">{lesson.title}</h2>
                <p className="mt-3">{lesson.task}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {lessonDone(focused.id, lesson.title) ? (
                    <span className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-moss">
                      <Check className="size-4" aria-hidden="true" />
                      Lesson done
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markDone(focused.id, lesson.title)}
                      className="inline-flex min-h-11 items-center rounded-full bg-moss px-4 text-sm font-bold text-cream"
                    >
                      Mark lesson done
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

          {dive ? (
            <div
              className={`wf-dive ${dive.reduce ? "reduce" : ""}`}
              aria-hidden="true"
              style={{ ["--gx" as string]: `${dive.x}%`, ["--gy" as string]: `${dive.y}%` }}
            />
          ) : null}
      </div>
    </div>
  );
}
