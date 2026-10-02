import { useEffect, useState } from 'react'
import { concepts, notesStorageKey, type Concept, type ConceptId } from './data/concepts'

const LESSON_STEP_ORDER = [
  'Warm-up',
  'Learn',
  'Notice',
  'Try',
  'Build',
  'Apply',
  'Reflect',
] as const

function loadNotes(id: ConceptId): string {
  try {
    return localStorage.getItem(notesStorageKey(id)) ?? ''
  } catch {
    return ''
  }
}

function saveNotes(id: ConceptId, value: string) {
  try {
    localStorage.setItem(notesStorageKey(id), value)
  } catch {
    /* ignore quota / private mode */
  }
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  )
}

function ConceptPanel({ concept }: { concept: Concept }) {
  const [notes, setNotes] = useState(() => loadNotes(concept.id))

  useEffect(() => {
    setNotes(loadNotes(concept.id))
  }, [concept.id])

  const onNotesChange = (value: string) => {
    setNotes(value)
    saveNotes(concept.id, value)
  }

  return (
    <div className={`concept-panel theme-${concept.theme}`}>
      <Section title="1. Hook">
        <p className="one-liner">{concept.hook.oneLiner}</p>
        <p className="body-copy">{concept.hook.body}</p>
      </Section>

      <Section title="2. World + home">
        <p className="body-copy">
          <strong>What the kid sees first:</strong> {concept.worldHome.firstLook}
        </p>
        <ul className="bullet-list">
          {concept.worldHome.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </Section>

      <Section title="3. Lesson slice">
        <p className="skill-line">
          <span className="pill">{concept.lessonSlice.skill}</span>
          <span className="muted">{concept.lessonSlice.gradeBand}</span>
        </p>
        <p className="body-copy">{concept.lessonSlice.framing}</p>
        <ol className="lesson-steps">
          {LESSON_STEP_ORDER.map((stepName) => {
            const step = concept.lessonSlice.steps.find((s) => s.name === stepName)
            return (
              <li key={stepName} className="lesson-step">
                <span className="step-name">{stepName}</span>
                <span className="step-beat">{step?.beat ?? '—'}</span>
              </li>
            )
          })}
        </ol>
      </Section>

      <Section title="4. Video rethink">
        <p className="body-copy">{concept.videoRethink.summary}</p>
        <ul className="bullet-list">
          {concept.videoRethink.ideas.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ul>
      </Section>

      <Section title="5. Keep / add / cut">
        <p className="muted small">
          vs current LoneStar Writing Studio / Luna Nook (placeholders)
        </p>
        <div className="keep-grid">
          <div className="keep-col">
            <h3>Keep</h3>
            <ul>
              {concept.keepAddCut.keep.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="keep-col">
            <h3>Add</h3>
            <ul>
              {concept.keepAddCut.add.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="keep-col">
            <h3>Cut</h3>
            <ul>
              {concept.keepAddCut.cut.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="6. Why this one">
        <p className="muted small">
          Emily’s recommendation notes — saved in this browser only.
        </p>
        <textarea
          className="notes-area"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={concept.whyNotesPlaceholder}
          rows={6}
          aria-label={`Why this one notes for ${concept.label}`}
        />
      </Section>
    </div>
  )
}

function TopBar() {
  return (
    <header className="topbar">
      <a className="logo-chip" href="./" title="Astra home">
        <span className="logo-mark" aria-hidden>
          ✦
        </span>
        <span className="logo-text">
          <small>CLEAR</small>
          <b>ASTRA</b>
        </span>
      </a>

      <div className="topbar-spacer" />

      <nav className="version-pick" aria-label="Package versions">
        <span className="lbl">Versions</span>
        <a className="version-link" href="./package-a-skeleton/">
          Package A
        </a>
        <a className="version-link" href="./package-b-skeleton/">
          Package B
        </a>
      </nav>

      <div className="topbar-spacer" />
    </header>
  )
}

export default function App() {
  const [active, setActive] = useState<ConceptId>('A')
  const concept = concepts.find((c) => c.id === active)!

  return (
    <div className="app-shell">
      <TopBar />

      <div className="app">
        <header className="site-header">
          <div className="header-inner">
            <h1>Astra Writing Adventure</h1>
            <p className="subtitle">
              Enchanted-forest writing trails — tap Package A or B in the top bar to enter a
              student walkthrough. Concept notes below are design directions, not the final product.
            </p>
          </div>
        </header>

        <nav className="tab-bar" aria-label="Concept tabs">
          {concepts.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`tab ${active === c.id ? 'active' : ''} theme-${c.theme}`}
              onClick={() => setActive(c.id)}
              aria-pressed={active === c.id}
            >
              <span className="tab-label">{c.label}</span>
              <span className="tab-short">{c.shortName}</span>
            </button>
          ))}
        </nav>

        <main className="main">
          <ConceptPanel concept={concept} />
        </main>

        <footer className="site-footer">
          <p>
            Enchanted forest brand end-to-end · same lesson skill on every tab · edit copy in{' '}
            <code>src/data/concepts.ts</code>
          </p>
          <p>
            <a href="./package-a-skeleton/">Package A skeleton</a>
            {' · '}
            <a href="./package-b-skeleton/">Package B skeleton</a>
            {' '}
            (wireframe student click-throughs · Details and Evidence)
          </p>
        </footer>
      </div>
    </div>
  )
}
