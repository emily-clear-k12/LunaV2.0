export type ConceptId = 'A' | 'B' | 'C'

export interface Concept {
  id: ConceptId
  label: string
  shortName: string
  theme: 'twilight' | 'studio' | 'journal'
  hook: {
    oneLiner: string
    body: string
  }
  worldHome: {
    firstLook: string
    notes: string[]
  }
  lessonSlice: {
    skill: string
    gradeBand: string
    framing: string
    steps: { name: string; beat: string }[]
  }
  videoRethink: {
    summary: string
    ideas: string[]
  }
  keepAddCut: {
    keep: string[]
    add: string[]
    cut: string[]
  }
  whyNotesPlaceholder: string
}

const LESSON_STEPS_BASE = [
  'Warm-up',
  'Learn',
  'Notice',
  'Try',
  'Build',
  'Apply',
  'Reflect',
] as const

export const concepts: Concept[] = [
  {
    id: 'A',
    label: 'Concept A',
    shortName: 'Soft world',
    theme: 'twilight',
    hook: {
      oneLiner: 'Writing opens gates in an enchanted twilight woodland.',
      body:
        'Kids arrive in a soft, story-soaked world where characters invite them into writing — not a menu of lessons. The adventure is real; the skill work is woven into what the woodland needs next. Placeholder vibe: wonder first, rigor held gently.',
    },
    worldHome: {
      firstLook:
        'A quiet glade at dusk. Soft lanterns. A familiar guide waits near a gate that only opens when the writer is ready.',
      notes: [
        'Home = woodland hub, not a dashboard.',
        'Characters lead the next beat; the kid chooses with writing, not with tabs.',
        'Progress feels like paths lit, gates unlocked — not XP meters (placeholder).',
      ],
    },
    lessonSlice: {
      skill: 'Evidence or Examples',
      gradeBand: 'Grades 4–5 Short Responses',
      framing:
        'Same skill spine as B and C — delivered as a woodland challenge the characters need resolved.',
      steps: [
        { name: 'Warm-up', beat: 'Notice a clue the woodland left — what counts as proof here?' },
        { name: 'Learn', beat: 'Guide shows how a claim needs a trail of evidence.' },
        { name: 'Notice', beat: 'Spot strong vs weak examples in a short passage.' },
        { name: 'Try', beat: 'Pick one piece of evidence that opens a small gate.' },
        { name: 'Build', beat: 'Draft a short response: claim + evidence / example.' },
        { name: 'Apply', beat: 'Use the same skill on a new woodland prompt.' },
        { name: 'Reflect', beat: 'What made your evidence strong enough to open the gate?' },
      ],
    },
    videoRethink: {
      summary:
        'No Luna talking-head dump. Instruction lives in scene, character beats, and short interactive reveals.',
      ideas: [
        'Character demonstrates “evidence” by pointing to glowing trails in the world.',
        'Micro-clips (15–30s) tied to Warm-up / Learn — skippable, rewatchable.',
        'Kid pauses the scene to annotate; play resumes when they mark an example.',
        'Placeholder: voice + illustration over full avatar lecture.',
      ],
    },
    keepAddCut: {
      keep: [
        'Clear skill labels (Evidence / Examples) from LoneStar Writing Studio.',
        'Short-response rigor and TEKS-aligned framing.',
        'Reflective close that names what the writer did.',
      ],
      add: [
        'Character-led entry into the lesson.',
        'World feedback (gates / paths) tied to writing quality — carefully, not gamified fluff.',
        'Softer emotional tone for first sessions.',
      ],
      cut: [
        'Long talking-head video as the default Learn beat.',
        'Studio chrome that feels like a tool before the kid feels invited.',
        'Anything that makes Luna Nook feel like “watch then write” only.',
      ],
    },
    whyNotesPlaceholder:
      'Emily’s notes: why Soft world might win for Kennady’s week-1 direction… (client-side only)',
  },
  {
    id: 'B',
    label: 'Concept B',
    shortName: 'Clear studio',
    theme: 'studio',
    hook: {
      oneLiner: 'Calm writing tool first; world as a light frame around the work.',
      body:
        'The kid lands in a clean, focused writing space. Story and world are present but secondary — a light frame, not the product. Placeholder vibe: clarity, breathability, “I know what to do.”',
    },
    worldHome: {
      firstLook:
        'A quiet desk / studio surface. Soft world motifs in the margins. Today’s skill and prompt are obvious within one glance.',
      notes: [
        'Home = writing surface + today’s lesson card.',
        'World is garnish: ambient art, light character presence, optional.',
        'Cognitive load stays low; navigation is flat and honest.',
      ],
    },
    lessonSlice: {
      skill: 'Evidence or Examples',
      gradeBand: 'Grades 4–5 Short Responses',
      framing:
        'Same skill spine — presented as a clear studio lesson with optional world flavor.',
      steps: LESSON_STEPS_BASE.map((name) => {
        const beats: Record<string, string> = {
          'Warm-up': 'Quick prompt: underline what would count as evidence.',
          Learn: 'Short, scannable model of claim + evidence / example.',
          Notice: 'Side-by-side: weak vs strong short responses.',
          Try: 'Fill one evidence blank with support from the text.',
          Build: 'Write the short response in the studio editor.',
          Apply: 'New passage, same skill checklist.',
          Reflect: 'Checklist: Did I include clear evidence or examples?',
        }
        return { name, beat: beats[name] }
      }),
    },
    videoRethink: {
      summary:
        'Instruction is tool-native: annotated models, callouts, and optional micro-video — never a long Luna lecture.',
      ideas: [
        'Inline “show me” expands a worked example next to the prompt.',
        'Optional 20s clip for Learn; default path is text + annotation.',
        'Teacher/mentor tip cards instead of avatar monologue.',
        'Placeholder: studio chrome that teaches without leaving the page.',
      ],
    },
    keepAddCut: {
      keep: [
        'Writing-first UI instincts from LoneStar Writing Studio.',
        'Transparent lesson steps kids (and teachers) can name.',
        'Evidence / Examples skill language.',
      ],
      add: [
        'Lighter world frame so it still feels like Astra, not a generic editor.',
        'Better visual hierarchy for Warm-up → Reflect.',
        'Optional character presence that doesn’t interrupt typing.',
      ],
      cut: [
        'Quest UI that buries the writing surface.',
        'Mandatory video before kids can write.',
        'Dense Luna Nook chrome that competes with the prompt.',
      ],
    },
    whyNotesPlaceholder:
      'Emily’s notes: why Clear studio might be the safer week-1 bet… (client-side only)',
  },
  {
    id: 'C',
    label: 'Concept C',
    shortName: 'Journal-as-map',
    theme: 'journal',
    hook: {
      oneLiner: 'No quests. The Writer’s Journal is the map; the mentor is an editor.',
      body:
        'Wild card. Progress is pages in a journal, not levels on a path. A mentor-as-editor helps the kid see their writing grow. Placeholder vibe: authorship, ownership, less “game,” more “my book.”',
    },
    worldHome: {
      firstLook:
        'An open Writer’s Journal. Today’s page. Margins for mentor notes. A thin sense of place — not a quest board.',
      notes: [
        'Home = journal spread (today / recent / growth).',
        'No quest list; the path is the sequence of journal entries.',
        'Mentor appears as editorial voice, not quest-giver.',
      ],
    },
    lessonSlice: {
      skill: 'Evidence or Examples',
      gradeBand: 'Grades 4–5 Short Responses',
      framing:
        'Same skill spine — framed as a journal page the mentor helps revise toward stronger evidence.',
      steps: LESSON_STEPS_BASE.map((name) => {
        const beats: Record<string, string> = {
          'Warm-up': 'Mentor asks: What are you trying to prove on this page?',
          Learn: 'Margin note: how writers plant evidence or examples.',
          Notice: 'Compare two journal drafts — which one shows, not just tells?',
          Try: 'Add one concrete example to today’s draft.',
          Build: 'Full short response lives as a journal entry.',
          Apply: 'New entry, same skill — different topic.',
          Reflect: 'Mentor prompt: Star your strongest piece of evidence. Why?',
        }
        return { name, beat: beats[name] }
      }),
    },
    videoRethink: {
      summary:
        'Mentor-as-editor voice notes and margin video — never a stage-center talking head.',
      ideas: [
        'Short mentor voice note pinned to a paragraph (“this claim needs an example”).',
        'Before/after journal pages as the “video” — animated reveal of revision.',
        'Kid records their own reflect note (optional) instead of watching.',
        'Placeholder: editorial feedback over lecture format.',
      ],
    },
    keepAddCut: {
      keep: [
        'Revision and reflection habits from writing studio practice.',
        'Skill clarity: Evidence or Examples stays explicit.',
        'Artifacts kids can look back on (journal history).',
      ],
      add: [
        'Persistent Writer’s Journal as the spine of the product.',
        'Mentor-as-editor relationship (not quest NPC).',
        'Growth visible as pages filled and revised.',
      ],
      cut: [
        'Quest / gate / map metaphor as the primary navigation.',
        'Gamey progression that hides the writing.',
        'Luna talking-head as the main Learn modality.',
      ],
    },
    whyNotesPlaceholder:
      'Emily’s notes: why Journal-as-map is worth a serious look… (client-side only)',
  },
]

export function notesStorageKey(id: ConceptId): string {
  return `astra-explorations-why-${id}`
}
