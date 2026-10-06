import { ArrowLeft, Check, Lock, Sparkles, Volume2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import "./world-starfall.css";

/* ———————————————————————————————————————————————
   Starfall Meadow — portal world for M3 Stellar Writers (sentences).
   Route: #world/starfall inside the Plan A app. Shared-template layout from
   docs/portal-worlds-plan.md: back (top-left), title (top-center), coins + 4 progress
   crystals (top-right), Astra + tip (bottom-left), 4 lesson landmarks, 1 coin extra.
   Art: enchanted forest meadow at twilight (Emily OK'd shooting stars / nebula sky for
   this world). Painted 3D landmark icons + full-body Astra; each art file falls back to
   the older asset / line icon if it's missing, so the page never breaks.
   ——————————————————————————————————————————————— */

export type WorldLesson = { title: string; world: string; minutes: number; task: string };
export type WorldModule = { id: string; name: string; world: string; accent: string; lessons: WorldLesson[] };

/** Lessons must go in order? Plan Q1 is still open, so default is all open with a "Next" hint.
    Preview the locked look with ?sequential=1. */
const SEQUENTIAL_DEFAULT = false;

/** Emily's example lesson (/demo/lesson/, "Module 3 · Lesson 3") lives at the Twin trunks. */
export const DEMO_LESSON_TITLE = "Details & Evidence";
const DEMO_LESSON_URL = `${import.meta.env.BASE_URL}../demo/lesson/?from=starfall`;

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;

/* World art (worlds/): meadow background, full-body Astra, painted firefly jar, blue crystal
   (a 160px copy of the app's crystal.png). */
const ART = {
  bg: asset("worlds/starfall-meadow-bg.jpg"),
  bgFallback: asset("worlds/starfall-bg.jpg"),
  bgVideo: asset("worlds/starfall-meadow-loop.mp4"),
  bgVideoWebm: asset("worlds/starfall-meadow-loop.webm"),
  astra: asset("worlds/astra-full.png"),
  jar: asset("worlds/icons/firefly-jar.png"),
  crystal: asset("worlds/crystal-blue.png"),
  crystalDone: asset("worlds/crystal-green.png"),
  /* Astra graded for twilight (cooler, a touch darker toward the ground) + a foreground cluster of
     flowers/grass cut from the meadow art that overlaps his shoes so he stands *in* the scene. */
  astraMeadow: asset("worlds/astra-meadow.png"),
  foreground: asset("worlds/meadow-foreground.png"),
};

/* Lesson spots (glowing flowers + a blue crystal) in frame-% over worlds/starfall-meadow-bg.jpg
   (cover-fit, 16:9): Lessons 1-2 left of the creek (left slope, center rise), Lessons 3-4
   right of it, set back in the meadow to mirror 1-2 (far right meadow, right meadow). Kept off the
   stream, the top HUD, and Astra + his tip bubble (bottom-left). The firefly jar lives in the HUD. */
const SPOTS: { x: number; y: number }[] = [
  { x: 25, y: 56 },
  { x: 46, y: 51 },
  { x: 73, y: 50 },
  { x: 87, y: 62 },
];
const ART_LIST = [ART.bg, ART.jar, ART.crystal, ART.crystalDone];

/** Preload art; true = loaded, false = missing (use the fallback), undefined = still loading. */
function useImagesOk(srcs: string[]) {
  const [ok, setOk] = useState<Record<string, boolean>>({});
  const key = srcs.join("|");
  useEffect(() => {
    let live = true;
    key.split("|").forEach((src) => {
      const im = new Image();
      im.onload = () => live && setOk((o) => ({ ...o, [src]: true }));
      im.onerror = () => live && setOk((o) => ({ ...o, [src]: false }));
      im.src = src;
    });
    return () => {
      live = false;
    };
  }, [key]);
  return ok;
}

const TIP = "Tap a glowing spot to start a lesson. Want coins? Catch word fireflies in the jar!";

/* ——— read aloud ———
   Lines recorded in Astra's own voice (Higgins "Astra-1") play from public/voice/.
   Anything not recorded yet (e.g. the sentence a student builds in the firefly jar)
   falls back to the browser's text-to-speech, preferring a boy/male voice to match Astra. */
const V = (name: string) => `voice/starfall-${name}.mp3`;
const VOICE: Record<string, string> = {
  [`Welcome to Starfall Meadow! ${TIP}`]: V("welcome"),
  [TIP]: V("tip"),
  "Starfall Meadow. Stellar Writers. Sentences that hold one clear idea.": V("world-name"),
  "Writing Sentences. Write three sentences that each say one whole idea.": V("lesson-1"),
  "Connecting Ideas. Join two short sentences without losing either idea.": V("lesson-2"),
  "Details & Evidence. Use details to bring a story to life, then choose strong evidence and quote it.": V("lesson-3"),
  "Vocabulary & Language. Pick strong, exact words that make your sentences shine.": V("lesson-4"),
  "Finish Writing Sentences first.": V("locked-2"),
  "Finish Connecting Ideas first.": V("locked-3"),
  "Finish Details & Evidence first.": V("locked-4"),
  "Catch word fireflies to build a sentence. A complete sentence tells who, and what they did.": V("jar-intro"),
  "Tap some fireflies first. Who is your sentence about?": V("jar-empty"),
  "That tells when or where. Who is it about, and what did they do?": V("jar-when-where"),
  "Almost! Who is this sentence about? Catch a who firefly.": V("jar-need-who"),
  "Almost! What did they do? Catch a doing firefly.": V("jar-need-what"),
  "Let’s keep one clear idea: one who and one doing part.": V("jar-one-idea"),
  "So close! Try putting the who part before the doing part.": V("jar-order"),
  "You built a complete thought, and you grew it with when or where!": V("jar-win-grew"),
  "You built a complete thought! It tells who and what they did.": V("jar-win"),
  "New fireflies! Build another complete sentence.": V("jar-new-round"),
  "Starfall Meadow is glowing! You finished all four lessons. Every clear sentence you wrote helped light it up!": V("celebrate"),
};

let playing: HTMLAudioElement | null = null;

export function speak(text: string) {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  synth?.cancel();
  if (playing) {
    playing.pause();
    playing = null;
  }
  const clip = VOICE[text];
  if (clip) {
    const a = new Audio(asset(clip));
    playing = a;
    a.play().catch(() => {
      /* autoplay blocked or file missing: fall back to the browser voice */
      if (playing === a) browserSpeak(text);
    });
    return;
  }
  browserSpeak(text);
}

export function stopSpeech() {
  window.speechSynthesis?.cancel();
  if (playing) {
    playing.pause();
    playing = null;
  }
}

function browserSpeak(text: string) {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  if (!synth) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.95;
  u.pitch = 1.15;
  const voices = synth.getVoices();
  const voice =
    voices.find((v) => /en[-_]US/i.test(v.lang) && /guy|davis|david|mark|aaron|alex|daniel|male|andrew|brian|eric/i.test(v.name) && !/female/i.test(v.name)) ??
    voices.find((v) => /^en/i.test(v.lang));
  if (voice) u.voice = voice;
  synth.speak(u);
}

function SpeakBtn({ text, label = "Read aloud", className = "" }: { text: string; label?: string; className?: string }) {
  return (
    <button
      type="button"
      className={`sf-speak ${className}`}
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
    >
      <Volume2 aria-hidden="true" />
    </button>
  );
}

/* ——— tiny seeded random so particles look organic but render the same every time ——— */
function seeded(n: number) {
  let s = n * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

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

/** ?demo=… can sit in the real query string or after the hash (#world/starfall?demo=complete). */
export function demoParams() {
  const out = new URLSearchParams(window.location.search);
  const q = window.location.hash.split("?")[1];
  if (q) new URLSearchParams(q).forEach((v, k) => out.set(k, v));
  return out;
}

type LessonState = "done" | "available" | "locked";

export function StarfallWorld({
  mod,
  done,
  setDone,
  defaultDone,
  coins,
  onEarn,
  onBack,
  autoSpeak,
}: {
  mod: WorldModule;
  done: string[];
  setDone: (list: string[]) => void;
  defaultDone: string[];
  coins: number;
  onEarn: (label: string, amount: number) => void;
  onBack: () => void;
  autoSpeak?: boolean;
}) {
  const reduce = useReducedMotion();
  const artOk = useImagesOk(ART_LIST);
  const bgUrl = artOk[ART.bg] === false ? ART.bgFallback : ART.bg;
  const params = useMemo(demoParams, []);
  const demoMode = params.has("demo");
  const sequential = params.get("sequential") === "1" || SEQUENTIAL_DEFAULT;

  const [cardIdx, setCardIdx] = useState<number | null>(null);
  const [soon, setSoon] = useState(false);
  const [jarOpen, setJarOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [tipOpen, setTipOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [demoMenu, setDemoMenu] = useState(false);
  const [bump, setBump] = useState(0);
  const coinRef = useRef<HTMLDivElement>(null);
  const prevDone = useRef(mod.lessons.slice(0, 4).filter((l) => done.includes(l.title)).length);

  const lessons = mod.lessons.slice(0, 4);
  const doneCount = lessons.filter((l) => done.includes(l.title)).length;
  const allDone = doneCount === lessons.length;

  const stateOf = (i: number): LessonState => {
    if (done.includes(lessons[i].title)) return "done";
    if (sequential && i > 0 && !done.includes(lessons[i - 1].title)) return "locked";
    return "available";
  };

  /* Demo hooks: ?demo=complete (finish all 4 + celebrate), ?demo=reset (back to the seeded state). */
  useEffect(() => {
    const d = params.get("demo");
    if (d === "complete") {
      if (lessons.every((l) => done.includes(l.title))) {
        const id = window.setTimeout(() => setCelebrate(true), reduce ? 150 : 650);
        return () => window.clearTimeout(id);
      }
      setDone(lessons.map((l) => l.title));
    }
    if (d === "reset") resetLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Celebrate when the 4th landmark lights up during this visit. */
  useEffect(() => {
    const was = prevDone.current;
    prevDone.current = doneCount;
    if (was < lessons.length && doneCount === lessons.length) window.setTimeout(() => setCelebrate(true), reduce ? 150 : 650);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneCount]);

  useEffect(() => {
    if (autoSpeak) speak(`Welcome to Starfall Meadow! ${TIP}`);
    return () => stopSpeech();
  }, [autoSpeak]);

  useEffect(() => {
    if (!tipOpen) return;
    const id = window.setTimeout(() => setTipOpen(false), 9000);
    return () => window.clearTimeout(id);
  }, [tipOpen]);

  const leave = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onBack, reduce ? 180 : 420);
  }, [leaving, onBack, reduce]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (celebrate) setCelebrate(false);
      else if (jarOpen) setJarOpen(false);
      else if (cardIdx !== null) setCardIdx(null);
      else if (demoMenu) setDemoMenu(false);
      else leave();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [celebrate, jarOpen, cardIdx, demoMenu, leave]);

  function toggleDone(title: string) {
    setDone(done.includes(title) ? done.filter((t) => t !== title) : [...done, title]);
  }

  function resetLessons() {
    setDone(defaultDone);
    try {
      const k = "astra-demo-alex-v1";
      const p = JSON.parse(localStorage.getItem(k) || "{}");
      delete p["details-and-evidence"];
      localStorage.setItem(k, JSON.stringify(p));
    } catch {
      /* ignore */
    }
  }

  function earn(label: string, amount: number) {
    onEarn(label, amount);
    setBump((b) => b + 1);
  }

  const fireflies = useMemo(() => {
    const r = seeded(7);
    return Array.from({ length: 30 }, (_, i) => ({
      left: 3 + r() * 94,
      top: 18 + r() * 78,
      size: 3 + r() * 4,
      dur: 7 + r() * 8,
      blink: 2.2 + r() * 2.8,
      delay: -r() * 12,
      dx: (r() - 0.5) * 120,
      dy: (r() - 0.5) * 90,
      warm: i % 3 !== 0,
    }));
  }, []);

  const card = cardIdx !== null ? lessons[cardIdx] : null;
  const cardState = cardIdx !== null ? stateOf(cardIdx) : null;

  return (
    <div
      className={`sf-world ${leaving ? "leaving" : "arriving"} ${reduce ? "reduce" : ""} ${celebrate ? "celebrating" : ""}`}
      style={{ ["--sf-accent" as string]: mod.accent }}
    >
      <div className={`sf-bg ${bgUrl === ART.bgFallback ? "legacy" : ""}`} aria-hidden="true" style={{ backgroundImage: `url(${bgUrl})` }}>
        {/* Animated meadow (Emily's Grok clip, looped with a 2.5s cross-fade). The still image
            above stays as the poster/fallback; motion is skipped for reduced-motion users. */}
        {!reduce && bgUrl === ART.bg ? (
          <video
            className="sf-bg-video"
            poster={bgUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            onCanPlay={(e) => e.currentTarget.classList.add("ready")}
          >
            <source src={ART.bgVideoWebm} type="video/webm" />
            <source src={ART.bgVideo} type="video/mp4" />
          </video>
        ) : null}
      </div>
      <div className="sf-tint" aria-hidden="true" />
      <div className="sf-glowpools" aria-hidden="true">
        <i style={{ left: "12%", top: "78%" }} />
        <i style={{ left: "33%", top: "88%", animationDelay: "-2s" }} />
        <i style={{ left: "70%", top: "84%", animationDelay: "-4s" }} />
        <i style={{ left: "90%", top: "72%", animationDelay: "-1s" }} />
        <i style={{ left: "47%", top: "60%", animationDelay: "-3s" }} />
      </div>
      <div className="sf-fireflies" aria-hidden="true">
        {fireflies.map((f, i) => (
          <i
            key={i}
            className={f.warm ? "warm" : "cool"}
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: f.size,
              height: f.size,
              animationDuration: `${f.dur}s, ${f.blink}s`,
              animationDelay: `${f.delay}s, ${f.delay / 2}s`,
              ["--dx" as string]: `${f.dx}px`,
              ["--dy" as string]: `${f.dy}px`,
            }}
          />
        ))}
      </div>
      <div className="sf-vignette" aria-hidden="true" />

      {/* ——— lesson landmarks ——— */}
      {lessons.map((l, i) => {
        const st = stateOf(i);
        const spot = SPOTS[i];
        return (
          <button
            key={l.title}
            type="button"
            className={`sf-mark gem ${st} ${allDone ? "alive" : ""}`}
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            onClick={() => {
              setSoon(false);
              setCardIdx(i);
              speak(st === "locked" ? `Finish ${lessons[i - 1].title} first.` : `${l.title}. ${l.task}`);
            }}
            aria-label={`Lesson ${i + 1}, ${l.title}, at the ${l.world}. ${st === "done" ? "Done" : st === "locked" ? "Locked" : "Ready"}`}
          >
            <span className="sf-mark-glow" aria-hidden="true" style={{ animationDelay: `${-i * 0.7}s` }} />
            {artOk[ART.crystal] === false ? (
              <span className="sf-gem-fallback" aria-hidden="true">
                <CrystalIcon lit />
              </span>
            ) : (
              <img
                className="sf-gem"
                src={st === "done" && artOk[ART.crystalDone] !== false ? ART.crystalDone : ART.crystal}
                alt=""
                draggable={false}
                style={{ animationDelay: `${-i * 0.9}s` }}
              />
            )}
            {st === "locked" ? (
              <span className="sf-mark-badge locked" aria-hidden="true">
                <Lock strokeWidth={3} />
              </span>
            ) : null}
            <span className="sf-label">
              <span className="sf-label-t">Lesson {i + 1}</span>
              <span className="sf-label-k">{l.title}</span>
            </span>
          </button>
        );
      })}

      {/* ——— HUD ——— */}
      <button type="button" className="sf-back sf-frost" onClick={leave}>
        <ArrowLeft aria-hidden="true" />
        Back to portals
      </button>

      <div className="sf-title sf-frost">
        <div>
          <h1>Starfall Meadow</h1>
          <p>Stellar Writers · Sentences</p>
        </div>
        <SpeakBtn text="Starfall Meadow. Stellar Writers. Sentences that hold one clear idea." label="Read the world name" />
      </div>

      <div className="sf-hud-right">
        <div ref={coinRef} key={bump} className={`sf-coins sf-frost ${bump ? "bump" : ""}`} aria-label={`${coins} coins`}>
          <CoinIcon />
          <b>{coins}</b>
        </div>
        <div className="sf-hud-col">
          <div className="sf-crystals sf-frost" aria-label={`${doneCount} of ${lessons.length} lessons done`}>
            {lessons.map((l, i) => (
              <CrystalIcon key={l.title} lit={done.includes(l.title)} delay={i * 0.25} />
            ))}
          </div>
          {/* ——— firefly jar (coin extra), tucked under the progress crystals ——— */}
          <button
            type="button"
            className={`sf-jar ${artOk[ART.jar] === false ? "" : "art"}`}
            onClick={() => {
              setJarOpen(true);
              setCardIdx(null);
            }}
            aria-label="Firefly jar: catch words to build sentences and earn coins"
          >
            <span className="sf-jar-glow" aria-hidden="true" />
            {artOk[ART.jar] === false ? <JarIcon /> : artOk[ART.jar] ? <img className="sf-jar-art" src={ART.jar} alt="" draggable={false} /> : null}
            <Sparkles className="sf-jar-spark" aria-hidden="true" />
            <span className="sf-jar-tag">Firefly jar</span>
          </button>
        </div>
      </div>

      {/* ——— Astra ——— */}
      <div className="sf-astra-wrap">
        <button
          type="button"
          className="sf-astra"
          onClick={() => {
            setTipOpen(true);
            speak(TIP);
          }}
          aria-label="Astra. Hear Astra’s tip"
        >
          <img src={ART.astraMeadow} alt="" draggable={false} />
        </button>
        <img className="sf-astra-fg" src={ART.foreground} alt="" aria-hidden="true" draggable={false} />
        {tipOpen ? (
          <div className="sf-bubble sf-frost" role="status">
            <span className="sf-bubble-k">✦ Astra</span>
            <span className="sf-bubble-t">{TIP}</span>
            <SpeakBtn text={TIP} label="Read Astra’s tip aloud" className="small" />
          </div>
        ) : null}
      </div>

      {/* ——— lesson card ——— */}
      {card && cardIdx !== null ? (
        <div className="sf-scrim" onClick={() => setCardIdx(null)}>
          <div className="sf-card sf-frost strong" role="dialog" aria-label={card.title} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="sf-x" onClick={() => setCardIdx(null)} aria-label="Close">
              <X aria-hidden="true" />
            </button>
            <p className="sf-card-k">
              Lesson {cardIdx + 1} · {card.world} · {card.minutes} min
            </p>
            <h2>
              {card.title} <SpeakBtn text={`${card.title}. ${card.task}`} className="small" />
            </h2>
            <p className="sf-card-task">{card.task}</p>
            {cardState === "locked" ? (
              <p className="sf-card-note">
                <Lock aria-hidden="true" /> Finish “{lessons[cardIdx - 1].title}” first.
              </p>
            ) : soon ? (
              <p className="sf-card-note">
                <Sparkles aria-hidden="true" /> This trail is still growing. Coming soon!
              </p>
            ) : null}
            <div className="sf-card-row">
              {cardState !== "locked" ? (
                card.title === DEMO_LESSON_TITLE ? (
                  <a className="sf-start" href={DEMO_LESSON_URL}>
                    {cardState === "done" ? "Play again" : "Start"}
                  </a>
                ) : (
                  <button type="button" className="sf-start" onClick={() => setSoon(true)}>
                    {cardState === "done" ? "Play again" : "Start"}
                  </button>
                )
              ) : null}
              {cardState === "done" ? (
                <span className="sf-card-done">
                  <Check aria-hidden="true" /> Crystal lit
                </span>
              ) : null}
              {demoMode ? (
                <button type="button" className="sf-demo-link" onClick={() => toggleDone(card.title)}>
                  {done.includes(card.title) ? "Mark not done (demo)" : "Mark done (demo)"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {jarOpen ? (
        <FireflyJar
          onClose={() => setJarOpen(false)}
          onEarn={earn}
          coinTarget={coinRef}
          reduce={reduce}
          bgUrl={bgUrl}
          jarArt={artOk[ART.jar] ? ART.jar : null}
        />
      ) : null}

      {celebrate ? <Celebration onClose={() => setCelebrate(false)} reduce={reduce} /> : null}

      {demoMode ? (
        <div className="sf-demo">
          {demoMenu ? (
            <div className="sf-demo-menu sf-frost strong">
              <button
                type="button"
                onClick={() => {
                  setDemoMenu(false);
                  if (allDone) setCelebrate(true);
                  else setDone(lessons.map((l) => l.title));
                }}
              >
                Finish all 4 → celebrate
              </button>
              <button
                type="button"
                onClick={() => {
                  setDemoMenu(false);
                  setCelebrate(true);
                }}
              >
                Play celebration
              </button>
              <button
                type="button"
                onClick={() => {
                  setDemoMenu(false);
                  resetLessons();
                }}
              >
                Reset lessons
              </button>
            </div>
          ) : null}
          <button type="button" className="sf-demo-btn sf-frost" onClick={() => setDemoMenu((v) => !v)} aria-expanded={demoMenu}>
            ✦ Demo
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ———————————————————————————————————————————————
   Firefly jar — build a complete sentence (who + did what), earn coins.
   No score, no wrong buzzer: a fragment just wiggles and Astra says what’s missing.
   ——————————————————————————————————————————————— */
type Part = "who" | "what" | "extra";
type Word = { text: string; part: Part };
const ROUNDS: Word[][] = [
  [
    { text: "the little fox", part: "who" },
    { text: "splashed in the creek", part: "what" },
    { text: "after supper", part: "extra" },
    { text: "my friend Mia", part: "who" },
    { text: "found a shiny rock", part: "what" },
  ],
  [
    { text: "under the old bridge", part: "extra" },
    { text: "a sleepy owl", part: "who" },
    { text: "hooted softly", part: "what" },
    { text: "Grandpa", part: "who" },
    { text: "baked warm bread", part: "what" },
  ],
  [
    { text: "the fireflies", part: "who" },
    { text: "danced over the grass", part: "what" },
    { text: "at sunset", part: "extra" },
    { text: "our class", part: "who" },
    { text: "planted a garden", part: "what" },
  ],
  [
    { text: "two rabbits", part: "who" },
    { text: "raced to the hill", part: "what" },
    { text: "before the rain", part: "extra" },
    { text: "Astra", part: "who" },
    { text: "read a story aloud", part: "what" },
  ],
];
const BOB_SPOTS = [
  { x: 14, y: 22 },
  { x: 56, y: 14 },
  { x: 33, y: 58 },
  { x: 78, y: 46 },
  { x: 62, y: 74 },
];

function sentenceOf(words: Word[]) {
  const s = words.map((w) => w.text).join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}

type FlyCoin = { id: number; sx: number; sy: number; dx: number; dy: number; delay: number };

function FireflyJar({
  onClose,
  onEarn,
  coinTarget,
  reduce,
  bgUrl,
  jarArt,
}: {
  onClose: () => void;
  onEarn: (label: string, amount: number) => void;
  coinTarget: RefObject<HTMLDivElement | null>;
  reduce: boolean;
  bgUrl: string;
  jarArt: string | null;
}) {
  const intro = "Catch word fireflies to build a sentence. A complete sentence tells who, and what they did.";
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [hint, setHint] = useState(intro);
  const [wiggle, setWiggle] = useState(0);
  const [lit, setLit] = useState<null | { sentence: string; amount: number }>(null);
  const [flying, setFlying] = useState<FlyCoin[]>([]);
  const lightRef = useRef<HTMLButtonElement>(null);
  const words = ROUNDS[round % ROUNDS.length];

  function pick(i: number) {
    if (lit) return;
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  }

  function nudge(msg: string) {
    setHint(msg);
    setWiggle((w) => w + 1);
    speak(msg);
  }

  function check() {
    const chosen = picked.map((i) => words[i]);
    const whos = chosen.filter((w) => w.part === "who").length;
    const whats = chosen.filter((w) => w.part === "what").length;
    if (!chosen.length) return nudge("Tap some fireflies first. Who is your sentence about?");
    if (whos === 0 && whats === 0) return nudge("That tells when or where. Who is it about, and what did they do?");
    if (whos === 0) return nudge("Almost! Who is this sentence about? Catch a who firefly.");
    if (whats === 0) return nudge("Almost! What did they do? Catch a doing firefly.");
    if (whos > 1 || whats > 1) return nudge("Let’s keep one clear idea: one who and one doing part.");
    const order = chosen.filter((w) => w.part !== "extra").map((w) => w.part).join(",");
    if (order !== "who,what") return nudge("So close! Try putting the who part before the doing part.");
    const grew = chosen.some((w) => w.part === "extra");
    const amount = grew ? 8 : 5;
    const sentence = sentenceOf(chosen);
    setLit({ sentence, amount });
    setHint(grew ? "You built a complete thought, and you grew it with when or where!" : "You built a complete thought! It tells who and what they did.");
    speak(sentence);
    launchCoins(amount, sentence);
  }

  function launchCoins(amount: number, sentence: string) {
    const from = lightRef.current?.getBoundingClientRect();
    const to = coinTarget.current?.getBoundingClientRect();
    const label = `Firefly sentence · “${sentence}”`;
    if (!from || !to || reduce) {
      onEarn(label, amount);
      return;
    }
    const sx = from.left + from.width / 2;
    const sy = from.top + from.height / 2;
    const ex = to.left + 22;
    const ey = to.top + to.height / 2;
    const coins = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      sx: sx + (i - 2.5) * 10,
      sy,
      dx: ex - sx - (i - 2.5) * 10,
      dy: ey - sy,
      delay: i * 0.07,
    }));
    setFlying(coins);
    window.setTimeout(() => onEarn(label, amount), 820);
    window.setTimeout(() => setFlying([]), 1400);
  }

  function nextRound() {
    setRound((r) => r + 1);
    setPicked([]);
    setLit(null);
    setHint("New fireflies! Build another complete sentence.");
  }

  return (
    <div className="sf-scrim dark" onClick={onClose}>
      <div className="sf-jarmodal sf-frost strong" role="dialog" aria-label="Firefly jar" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="sf-x" onClick={onClose} aria-label="Close firefly jar">
          <X aria-hidden="true" />
        </button>
        <header className="sf-jm-head">
          {jarArt ? <img className="sf-jm-jar" src={jarArt} alt="" /> : <JarIcon />}
          <div>
            <h2>
              Firefly Sentences <SpeakBtn text={intro} className="small" label="Read the directions" />
            </h2>
            <p>Tap fireflies to build a sentence that tells who and what they did.</p>
          </div>
        </header>

        <div
          className={`sf-jm-sky ${lit ? "lit" : ""}`}
          style={{
            backgroundImage: `linear-gradient(180deg, rgb(24 12 56 / 0.5), rgb(24 12 56 / 0.3)), url(${bgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center 70%",
          }}
        >
          {words.map((w, i) => {
            const on = picked.includes(i);
            const spot = BOB_SPOTS[i];
            return (
              <button
                key={`${round}-${i}`}
                type="button"
                className={`sf-fly ${on ? "picked" : ""}`}
                style={{ left: `${spot.x}%`, top: `${spot.y}%`, animationDelay: `${-i * 0.9}s` }}
                onClick={() => pick(i)}
                aria-pressed={on}
              >
                <i aria-hidden="true" />
                {w.text}
              </button>
            );
          })}
          {lit ? <div className="sf-jm-burst" aria-hidden="true" /> : null}
        </div>

        <div key={wiggle} className={`sf-tray ${wiggle ? "wiggle" : ""} ${lit ? "lit" : ""}`} aria-live="polite">
          {picked.length ? (
            lit ? (
              <span className="sf-tray-sentence">{lit.sentence}</span>
            ) : (
              picked.map((i, n) => (
                <button key={i} type="button" className="sf-tray-chip" onClick={() => pick(i)} aria-label={`Remove ${words[i].text}`}>
                  {n === 0 ? words[i].text.charAt(0).toUpperCase() + words[i].text.slice(1) : words[i].text}
                </button>
              ))
            )
          ) : (
            <span className="sf-tray-empty">Your sentence lands here…</span>
          )}
          {lit ? <SpeakBtn text={lit.sentence} className="small" label="Read my sentence" /> : null}
        </div>

        <div className="sf-jm-foot">
          <div className="sf-jm-hint">
            <img src={asset("worlds/astra-wave.jpg")} alt="" />
            <span>{hint}</span>
            <SpeakBtn text={hint} className="small" label="Read Astra’s hint" />
          </div>
          {lit ? (
            <div className="sf-jm-actions">
              <span className="sf-jm-earned">
                <CoinIcon /> +{lit.amount}
              </span>
              <button type="button" className="sf-start" onClick={nextRound}>
                More fireflies
              </button>
            </div>
          ) : (
            <button ref={lightRef} type="button" className="sf-start" onClick={check}>
              Light it up!
            </button>
          )}
        </div>
      </div>
      {flying.map((c) => (
        <span
          key={c.id}
          className="sf-flycoin"
          aria-hidden="true"
          style={{
            left: c.sx,
            top: c.sy,
            animationDelay: `${c.delay}s`,
            ["--dx" as string]: `${c.dx}px`,
            ["--dy" as string]: `${c.dy}px`,
          }}
        >
          <CoinIcon />
        </span>
      ))}
    </div>
  );
}

/* ———————————————————————————————————————————————
   Celebration (4/4): fireflies swirl in, burst, glowing petals fall, Astra cheers.
   Just for fun — no grade, no score.
   ——————————————————————————————————————————————— */
function Celebration({ onClose, reduce }: { onClose: () => void; reduce: boolean }) {
  const line = "Starfall Meadow is glowing! You finished all four lessons. Every clear sentence you wrote helped light it up!";
  const bits = useMemo(() => {
    const r = seeded(11);
    return {
      swirl: Array.from({ length: 22 }, (_, i) => ({ a: (360 / 22) * i, d: r() * 0.35, s: 5 + r() * 5 })),
      petals: Array.from({ length: 38 }, (_, i) => ({
        left: r() * 100,
        delay: 1.2 + r() * 2.4,
        dur: 4 + r() * 3,
        size: 10 + r() * 10,
        rot: r() * 360,
        sway: 20 + r() * 50,
        hue: i % 4,
      })),
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => speak(line), reduce ? 100 : 1500);
    return () => window.clearTimeout(id);
  }, [reduce]);

  return (
    <div className="sf-cele" role="dialog" aria-label="Starfall Meadow celebration" onClick={onClose}>
      <div className="sf-cele-glow" aria-hidden="true" />
      {!reduce ? (
        <>
          <div className="sf-swirl" aria-hidden="true">
            {bits.swirl.map((b, i) => (
              <i
                key={i}
                style={{ ["--a" as string]: `${b.a}deg`, animationDelay: `${b.d}s`, width: b.s, height: b.s }}
              />
            ))}
          </div>
          <div className="sf-burst" aria-hidden="true" />
          <div className="sf-petals" aria-hidden="true">
            {bits.petals.map((p, i) => (
              <i
                key={i}
                className={`h${p.hue}`}
                style={{
                  left: `${p.left}%`,
                  width: p.size,
                  height: p.size * 0.62,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.dur}s`,
                  ["--rot" as string]: `${p.rot}deg`,
                  ["--sway" as string]: `${p.sway}px`,
                }}
              />
            ))}
          </div>
        </>
      ) : null}
      <div className="sf-cele-card sf-frost strong" onClick={(e) => e.stopPropagation()}>
        <div className="sf-cele-astra">
          <img src={ART.astra} alt="Astra cheering" draggable={false} />
          <span className="sf-cele-yay" aria-hidden="true">
            Yay!
          </span>
        </div>
        <h2>Starfall Meadow is glowing!</h2>
        <p>You finished all 4 lessons. Every clear sentence you wrote helped light it up!</p>
        <div className="sf-cele-crystals" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <CrystalIcon key={i} lit delay={i * 0.15} big />
          ))}
        </div>
        <div className="sf-card-row center">
          <SpeakBtn text={line} label="Read aloud" />
          <button type="button" className="sf-start" onClick={onClose}>
            Hooray!
          </button>
        </div>
      </div>
    </div>
  );
}

/* ——— little hand-drawn icons ——— */
function JarIcon() {
  return (
    <svg viewBox="0 0 48 48" className="sf-jar-ico" aria-hidden="true">
      <rect x="15" y="5" width="18" height="6" rx="2" className="lid" />
      <path d="M14 13h20c2 3 4 6 4 12v12c0 4-3 6-7 6H17c-4 0-7-2-7-6V25c0-6 2-9 4-12z" className="glass" />
      <circle cx="20" cy="28" r="2.4" className="bug" />
      <circle cx="28" cy="34" r="2" className="bug b2" />
      <circle cx="29" cy="23" r="1.7" className="bug b3" />
    </svg>
  );
}
function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="sf-coin-ico" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#f4c541" stroke="#a8711b" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="6.6" fill="none" stroke="#fff3b0" strokeWidth="1.3" />
      <path d="M12 7.8l1.2 2.7 2.9.3-2.2 1.9.7 2.9-2.6-1.5-2.6 1.5.7-2.9-2.2-1.9 2.9-.3z" fill="#fff6c8" />
    </svg>
  );
}
function CrystalIcon({ lit, delay = 0, big }: { lit: boolean; delay?: number; big?: boolean }) {
  return (
    <svg viewBox="0 0 24 32" className={`sf-crystal ${lit ? "lit" : ""} ${big ? "big" : ""}`} style={{ animationDelay: `${delay}s` }} aria-hidden="true">
      <path d="M12 1 21 10 12 31 3 10z" className="body" />
      <path d="M3 10h18M12 1 8.5 10 12 31 15.5 10z" className="facet" />
    </svg>
  );
}
