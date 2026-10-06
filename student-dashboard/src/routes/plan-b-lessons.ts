/* ———————————————————————————————————————————————
   Plan B lesson names (Emily, Oct 2026). Shown everywhere as "Lesson N: <name>".
   Plan B only: Plan A (plan-a.tsx / world-starfall.tsx) keeps its own module data.
   The lists are complete even where a world's art has fewer pedestals than lessons
   (world pages render min(lessons, positions); see WORLDS[].spots in plan-b-worlds.tsx).
   ——————————————————————————————————————————————— */

export type PlanBLesson = { title: string; task?: string };

const names = (...titles: string[]): PlanBLesson[] => titles.map((title) => ({ title }));

/** Visible label for a lesson: "Lesson 1: Central Idea and Claim". */
export const lessonLabel = (index: number, title: string) => `Lesson ${index + 1}: ${title}`;

/* ——— M1 (Fairy Hollow): four teacher-selectable variants ——— */
export type M1Variant = "ace" | "scr" | "race" | "rac";

/** Teacher setting. Default for everyone unless changed by ?m1= or the localStorage key below. */
export const M1_DEFAULT: M1Variant = "ace";
/** localStorage key holding the chosen variant ("ace" | "scr" | "race" | "rac"). */
export const M1_STORAGE_KEY = "astra.planb.m1Variant";

export const M1_VARIANTS: Record<M1Variant, { label: string; lessons: PlanBLesson[] }> = {
  ace: {
    label: "ACE",
    lessons: names("A: Answer the Question", "C: Citing Evidence", "E: Explain and Elaborate", "ACE"),
  },
  scr: {
    label: "SCR",
    lessons: names("Topic Sentence", "Evidence or Examples", "Explanation", "Concluding Sentence", "Complete SCR"),
  },
  race: {
    label: "RACE",
    lessons: names(
      "R: Restate the Answer",
      "A: Answer the Question",
      "C: Citing Evidence",
      "E: Explain and Elaborate",
      "RACE",
    ),
  },
  rac: {
    label: "RAC",
    lessons: names("R: Restate the Answer", "A: Answer the Question", "C: Citing Evidence", "RAC"),
  },
};

const isVariant = (v: string | null | undefined): v is M1Variant => !!v && v in M1_VARIANTS;

/** ?m1=scr|race|ace|rac (in the query or after the hash) picks a variant for demos and is
    remembered in localStorage; otherwise the saved choice, otherwise M1_DEFAULT. */
export function readM1Variant(): M1Variant {
  try {
    const params = new URLSearchParams(window.location.search);
    const hashQuery = window.location.hash.split("?")[1];
    if (hashQuery) new URLSearchParams(hashQuery).forEach((v, k) => params.set(k, v));
    const fromUrl = params.get("m1")?.toLowerCase();
    if (isVariant(fromUrl)) {
      localStorage.setItem(M1_STORAGE_KEY, fromUrl);
      return fromUrl;
    }
    const saved = localStorage.getItem(M1_STORAGE_KEY);
    if (isVariant(saved)) return saved;
  } catch {
    /* ignore */
  }
  return M1_DEFAULT;
}

export const M1_VARIANT = readM1Variant();

/* ——— M2–M6 ——— */
export const PLAN_B_LESSONS: Record<string, PlanBLesson[]> = {
  scr: M1_VARIANTS[M1_VARIANT].lessons,
  ecr: names(
    "Central Idea and Claim",
    "Effective Organization",
    "Selecting Evidence",
    "Expression of Ideas",
    "Conventions",
    "Write an Extended Constructed Response",
  ),
  sentences: [
    { title: "Writing Sentences", task: "Write three sentences that each say one whole idea." },
    { title: "Connecting Ideas", task: "Join two short sentences without losing either idea." },
    { title: "Details & Evidence", task: "Use details to bring a story to life, then choose strong evidence and quote it." },
    { title: "Vocabulary & Language", task: "Pick strong, exact words that make your sentences shine." },
  ],
  plan: names(
    "Topic, Audience, Purpose",
    "Annotating & Gathering Information",
    "Writing an Outline",
    "From Outline to Draft",
    "Revise and Edit",
  ),
  revise: names(
    "Expanding Sentences",
    "Adding and Removing Sentences",
    "Elaborate, Combine, and Rearrange Thoughts",
    "Vocabulary and Language Skills",
  ),
  edit: names("Capitalization", "Usage", "Punctuation", "Spelling"),
};
