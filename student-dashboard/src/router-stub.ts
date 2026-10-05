// Minimal stand-in for @tanstack/react-router's createFileRoute so the route file builds standalone.
import type { ComponentType } from 'react'

export function createFileRoute(_path: string) {
  return (options: { component: ComponentType }) => ({ options })
}
