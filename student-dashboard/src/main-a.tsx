import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route } from './routes/plan-a'
import './styles.css'

const StudentHome = Route.options.component

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudentHome />
  </StrictMode>,
)
