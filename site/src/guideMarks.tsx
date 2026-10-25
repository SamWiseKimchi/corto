import type { ReactNode } from 'react'
import {
  Boxes,
  ClipboardCheck,
  Code,
  Flag,
  Layers,
  ListChecks,
  Map,
  MessagesSquare,
  Palette,
  Search,
  Share2,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

const marks: Record<string, LucideIcon> = {
  'Pet-Profile State-Sync and Personalisation': Share2,
  'Situation & Context': Map,
  Task: ListChecks,
  Action: Wrench,
  'Result & Reflection': Flag,
  'Design & User Experience': Palette,
  'Frontend Engineering': Code,
  'Collaboration, Ownership & Outcomes': Users,
  'Architectural Complexity': Layers,
  'Product & UX Impact': Search,
  Architecture: Boxes,
  'The Problem': Map,
  'Key Challenge + Complexity': Layers,
  'Scope & Ownership': ListChecks,
  'Team & Stakeholders': Users,
  'User Experience & Interaction': Palette,
  'Frontend Engineering Architecture': Code,
  'State Synchronization': Share2,
  'TypeScript & React': Code,
  'Deployment & Strategy': Flag,
  Outcomes: Flag,
  'Reflections & Future Improvements': MessagesSquare,
  'Handling Asynchronous UX': Palette,
  'Design System Integration': Layers,
  'Accessibility (a11y)': Search,
  'State Management Architecture': Share2,
  'Type Safety': Code,
  'Performance & Experimentation': Flag,
  'Cross-Team Adoption': Users,
  'A/B Testing Alignment': Search,
  'Trade-Offs': Wrench,
}

export function markFor(label: string): LucideIcon | undefined {
  const clean = label.replace(/:$/, '').trim()
  if (clean.startsWith('Phase 3')) return MessagesSquare
  if (clean.startsWith('Phase 4')) return ClipboardCheck
  return marks[clean]
}

export function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    const props = node.props as { children?: ReactNode }
    return textOf(props.children)
  }
  return ''
}

export function GuideMark({ label, size = 18 }: { label: string; size?: number }) {
  const Icon = markFor(label)
  if (!Icon) return null
  return <Icon className="guide-mark" size={size} aria-hidden="true" />
}

export function DiagramMark({
  icon: Icon,
  x,
  y,
  size = 14,
}: {
  icon: LucideIcon
  x: number
  y: number
  size?: number
}) {
  return <Icon x={x} y={y} width={size} height={size} color="#f2efe6" aria-hidden="true" />
}
