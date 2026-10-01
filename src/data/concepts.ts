export type ConceptId = 'A' | 'B' | 'C'

export interface Concept {
  id: ConceptId
  label: string
  shortName: string
  theme: 'immersion' | 'desk' | 'journal'
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

/** Brand lock: every concept is the enchanted forest. Differentiation is density of immersion vs clarity vs journal-as-woods — never leaving the forest. */
export const concepts: Concept[] = [
  {
    id: 'A',
    label: 'Concept A',
    shortName: 'Deep forest immersion',
    theme: 'immersion',
    hook: {
      oneLiner: 'You are fully in the woodland — writing opens paths, bridges, and gates.',
      body:
        'Most magical of the three. Moss and other forest characters lead quests through regions that feel like real places. Instruction is woven into story scenes. Writing is the gameplay: no mini-games, no side arcade — the kid’s sentences change the woods.',
    },
    worldHome: {
      firstLook:
        'Deep canopy, soft dusk light, a living map of clearings and streams. Moss waits at the trailhead. Today’s writing unlocks the next stretch of forest.',
      notes: [
        'Home = woodland hub / region map — not a dashboard.',
        'Characters (Moss, etc.) invite the next beat; the kid answers by writing.',
        'Progress = paths lit, bridges built, gates opened — always tied to the short response, never to a separate “game.”',
        'Regions have place-names and moods; the kid feels somewhere, not in a menu.',
      ],
    },
    lessonSlice: {
      skill: 'Evidence or Examples',
      gradeBand: 'Grades 4–5 Short Responses',
      framing:
        'Same skill spine as B and C — delivered as a woodland challenge the forest characters need resolved. Skill language can wear story names; the rigor stays explicit.',
      steps: [
        {
          name: 'Warm-up',
          beat: 'Moss points to a broken bridge: what clue in the scene would count as proof?',
        },
        {
          name: 'Learn',
          beat: 'In-scene: how a claim needs a trail of evidence before the gate will open.',
        },
        {
          name: 'Notice',
          beat: 'Spot strong vs weak examples along two forest paths (short passages).',
        },
        {
          name: 'Try',
          beat: 'Choose one piece of evidence that lights a stepping-stone across the stream.',
        },
        {
          name: 'Build',
          beat: 'Draft the short response; finishing it raises the gate / mends the bridge.',
        },
        {
          name: 'Apply',
          beat: 'New woodland prompt, same skill — a different region needs the same kind of proof.',
        },
        {
          name: 'Reflect',
          beat: 'What made your evidence strong enough for the forest to change?',
        },
      ],
    },
    videoRethink: {
      summary:
        'No Luna talking-head dump. Instruction lives inside story scenes, character beats, and short interactive reveals in the woods.',
      ideas: [
        'Moss demonstrates “evidence” by tracing glowing trails through the undergrowth.',
        'Micro-clips (15–30s) tied to Warm-up / Learn — skippable, rewatchable, always in-forest.',
        'Kid pauses the scene to mark an example; play resumes when the marking is done.',
        'Voice + illustration in place — not an avatar lecture over a blank studio.',
      ],
    },
    keepAddCut: {
      keep: [
        'Clear skill labels (Evidence / Examples) under the story wrapping.',
        'Short-response rigor and TEKS-aligned framing.',
        'Reflective close that names what the writer did.',
      ],
      add: [
        'Full woodland immersion as the default surface.',
        'Character-led quests where writing = the only verb that moves the world.',
        'Regions-as-places so progress feels geographic, not XP-shaped.',
      ],
      cut: [
        'Long talking-head video as the default Learn beat.',
        'Any mini-game or tap-tap diversion that isn’t writing.',
        'Studio chrome that pulls the kid out of the forest before they’ve been invited in.',
      ],
    },
    whyNotesPlaceholder:
      'Emily’s notes: why Deep forest immersion might win for Kennady… (client-side only)',
  },
  {
    id: 'B',
    label: 'Concept B',
    shortName: 'Forest with a clear desk',
    theme: 'desk',
    hook: {
      oneLiner:
        'Same enchanted woodland home — when it’s time to learn, a calm desk opens in a clearing.',
      body:
        'Forest frames; desk does the work. Characters set up the moment, then step aside. Mid-lesson, instructional clarity wins: cream cards, plain skill names first, world names second. Still 100% enchanted forest brand — never a sterile SaaS app without trees.',
    },
    worldHome: {
      firstLook:
        'The same living woodland map as A. Tap today’s clearing and a soft cream writing desk settles under the canopy — mossy edges, birdsong optional, skill card unmistakable.',
      notes: [
        'Home / map = enchanted forest (shared brand with A and C).',
        'Lesson mode = calm cards over forest backdrop; world names appear after plain skill names.',
        'Characters (Moss, etc.) introduce, then give space so the kid can think.',
        'Cognitive load stays low; navigation stays honest — still leaves and lanterns, not blank gray UI.',
      ],
    },
    lessonSlice: {
      skill: 'Evidence or Examples',
      gradeBand: 'Grades 4–5 Short Responses',
      framing:
        'Same skill spine — presented on clear desk cards inside the woodland. Story flavor is secondary labels; the skill name leads.',
      steps: LESSON_STEPS_BASE.map((name) => {
        const beats: Record<string, string> = {
          'Warm-up':
            'On the cream card: underline what would count as evidence. (Forest name: “trail clues,” shown second.)',
          Learn:
            'Short scannable model — claim + evidence / example — with soft woodland margin art, not a full scene takeover.',
          Notice:
            'Side-by-side weak vs strong short responses; Moss has stepped to the edge of the clearing.',
          Try: 'Fill one evidence blank from the text; a lantern glows when it’s solid.',
          Build:
            'Write the short response on the clear desk editor; canopy stays in the frame.',
          Apply: 'New passage, same skill checklist — still in today’s forest clearing.',
          Reflect:
            'Checklist first: Did I include clear evidence or examples? Optional: which part of the woods helped you notice?',
        }
        return { name, beat: beats[name] }
      }),
    },
    videoRethink: {
      summary:
        'Instruction is desk-native inside the forest: annotated models, callouts, optional micro-video — characters introduce, then the card teaches.',
      ideas: [
        'Moss opens the clearing, then the Learn card expands a worked example next to the prompt.',
        'Optional 20s in-forest clip for Learn; default path is text + annotation on cream cards.',
        'Mentor tip cards with leaf motifs — not an avatar monologue.',
        'World names (e.g. “gate proof”) appear as secondary labels under “Evidence or Examples.”',
      ],
    },
    keepAddCut: {
      keep: [
        'Writing-first clarity instincts from LoneStar Writing Studio.',
        'Transparent lesson steps kids and teachers can name.',
        'Evidence / Examples skill language in plain English first.',
      ],
      add: [
        'Enchanted forest home/map shared with A and C — brand lock.',
        'Calm desk-in-a-clearing lesson surface (cream cards over woods).',
        'Characters who set up, then step aside mid-lesson.',
      ],
      cut: [
        'Quest UI that buries the writing surface during Learn → Build.',
        'Mandatory long video before kids can write.',
        'Any direction that drops the forest and looks like a generic edtech tool.',
      ],
    },
    whyNotesPlaceholder:
      'Emily’s notes: why Forest with a clear desk might be the week-1 bet… (client-side only)',
  },
  {
    id: 'C',
    label: 'Concept C',
    shortName: 'Living forest journal',
    theme: 'journal',
    hook: {
      oneLiner:
        'The Writer’s Journal grows through the forest — pages are clearings; collecting changes the woods.',
      body:
        'Less “quest gate,” more authorship. Pieces the kid writes become pages that alter clearings, trails, and weather. Mentor-as-editor lives in the trees. Still enchanted forest end-to-end — the journal is how the forest remembers the writer.',
    },
    worldHome: {
      firstLook:
        'An open journal resting on a stump in a mossy clearing. Pages map to places in the woods. Today’s entry can grow a new fern, quiet a stream, or open a thin path — not by quest checkbox, but by the writing itself.',
      notes: [
        'Home = journal spread woven into the forest (today / recent / growth).',
        'Path = sequence of journal entries as clearings, not a quest board of gates.',
        'Mentor appears as editorial voice among the trees — margin notes, not quest NPC.',
        'Collecting pieces (evidence, examples, revised lines) visibly changes the woodland.',
      ],
    },
    lessonSlice: {
      skill: 'Evidence or Examples',
      gradeBand: 'Grades 4–5 Short Responses',
      framing:
        'Same skill spine — framed as a journal page the forest mentor helps revise; stronger evidence grows the clearing.',
      steps: LESSON_STEPS_BASE.map((name) => {
        const beats: Record<string, string> = {
          'Warm-up':
            'Mentor in the leaves asks: What are you trying to prove on this page / in this clearing?',
          Learn:
            'Margin note on the journal: how writers plant evidence or examples so the woods can “see” the claim.',
          Notice:
            'Compare two journal drafts under the canopy — which one shows, not just tells?',
          Try: 'Add one concrete example to today’s draft; a fern unfurls at the page edge.',
          Build:
            'Full short response lives as a journal entry that reshapes today’s clearing.',
          Apply: 'New entry, same skill — a neighboring clearing needs the same kind of proof.',
          Reflect:
            'Mentor prompt: Star your strongest piece of evidence. Why did the forest answer?',
        }
        return { name, beat: beats[name] }
      }),
    },
    videoRethink: {
      summary:
        'Instruction via annotated journal pages and notice-the-forest metaphors — never a stage-center talking head.',
      ideas: [
        'Before/after journal pages as the “video” — animated reveal of revision growing moss on the page.',
        'Short mentor voice note pinned to a paragraph (“this claim needs an example”), birdsong under.',
        'Kid notices a forest metaphor (trail = evidence chain) then applies it on the page.',
        'Optional: kid records a reflect note instead of watching a lecture.',
      ],
    },
    keepAddCut: {
      keep: [
        'Revision and reflection habits from writing studio practice.',
        'Skill clarity: Evidence or Examples stays explicit on the page.',
        'Artifacts kids can look back on (journal history = forest memory).',
      ],
      add: [
        'Writer’s Journal as living map of the enchanted forest.',
        'Mentor-as-editor in the trees (not quest-giver).',
        'Collecting / revising pieces that visibly change the woods.',
      ],
      cut: [
        'Quest / gate checklist as the primary navigation metaphor.',
        'Gamey progression that hides the writing behind map pins.',
        'Luna talking-head as the main Learn modality.',
      ],
    },
    whyNotesPlaceholder:
      'Emily’s notes: why Living forest journal is worth a serious look… (client-side only)',
  },
]

export function notesStorageKey(id: ConceptId): string {
  return `astra-explorations-why-${id}`
}
