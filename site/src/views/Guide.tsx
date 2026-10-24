import { createContext, useContext, type ClassAttributes, type HTMLAttributes } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import guide from '../../../interview_preparation_guide.md?raw'
import IsolatedPreactRoots from '../components/IsolatedPreactRoots.tsx'
import Reveal from '../Reveal.tsx'

type BlockProps = ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement>

const InsideList = createContext(false)

type Card = { n: string; title: string; body: string }

type Piece =
  | { type: 'md'; text: string }
  | { type: 'stack'; cards: Card[] }

function splitGuide(source: string): Piece[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const pieces: Piece[] = []
  let md: string[] = []
  let stack: Card[] | null = null

  const flushMd = () => {
    const text = md.join('\n').trim()
    if (text) pieces.push({ type: 'md', text })
    md = []
  }

  const flushStack = () => {
    if (stack?.length) pieces.push({ type: 'stack', cards: stack })
    stack = null
  }

  for (const line of lines) {
    const heading = /^###\s+(\d+)\.\s+(.+?)\s*$/.exec(line)
    if (heading) {
      flushMd()
      stack ??= []
      stack.push({ n: heading[1], title: heading[2], body: '' })
      continue
    }

    if (stack && (/^#{1,2}\s/.test(line) || /^---\s*$/.test(line))) {
      flushStack()
    }

    if (stack) {
      const current = stack[stack.length - 1]
      current.body += `${current.body ? '\n' : ''}${line}`
      continue
    }

    md.push(line)
  }

  flushMd()
  flushStack()
  return pieces
}

function block(as: 'h1' | 'h2' | 'h3' | 'h4') {
  return function MarkdownBlock({ children, className }: BlockProps) {
    return (
      <Reveal as={as} className={className}>
        {children}
      </Reveal>
    )
  }
}

function Paragraph({ children, className }: BlockProps) {
  const inside = useContext(InsideList)
  if (inside) return <p className={className}>{children}</p>
  return (
    <Reveal as="p" className={className}>
      {children}
    </Reveal>
  )
}

function ProseItem({ children, className }: HTMLAttributes<HTMLLIElement>) {
  const inside = useContext(InsideList)
  if (inside) {
    return (
      <li className={className}>
        <div className="guide-number-body">{children}</div>
      </li>
    )
  }
  return (
    <Reveal as="li" className={className}>
      {children}
    </Reveal>
  )
}

function OrderedList({ children }: HTMLAttributes<HTMLOListElement>) {
  return (
    <InsideList.Provider value={true}>
      <Reveal>
        <ol className="guide-numbers">{children}</ol>
      </Reveal>
    </InsideList.Provider>
  )
}

function BulletList({ children, className }: HTMLAttributes<HTMLUListElement>) {
  return <ul className={['guide-points', className].filter(Boolean).join(' ')}>{children}</ul>
}

function PointItem({ children, className }: HTMLAttributes<HTMLLIElement>) {
  return <li className={['guide-point', className].filter(Boolean).join(' ')}>{children}</li>
}

const prose: Components = {
  h1: block('h1'),
  h2: block('h2'),
  h3: block('h3'),
  h4: block('h4'),
  p: Paragraph,
  li: ProseItem,
  ol: OrderedList,
}

const cards: Components = {
  p: 'p',
  ul: BulletList,
  li: PointItem,
  ol: OrderedList,
}

const pieces = splitGuide(guide)

function GuideCard({ card }: { card: Card }) {
  const body = card.body.trim()
  return (
    <Reveal>
      <section className="guide-card">
        <div className="guide-rail" aria-hidden="true">
          {card.n}
        </div>
        <div className="guide-card-main">
          <h3 className="guide-card-title">
            <span className="sr-only">{card.n}. </span>
            {card.title}
          </h3>
          {body ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={cards}>
              {body}
            </ReactMarkdown>
          ) : null}
        </div>
      </section>
    </Reveal>
  )
}

function CardStack({ items }: { items: Card[] }) {
  const situation = items.find((card) => card.title === 'Situation & Context')
  const rest = items.filter((card) => card !== situation)

  return (
    <>
      {situation ? (
        <div className="guide-situation">
          <GuideCard card={situation} />
          <IsolatedPreactRoots />
        </div>
      ) : null}
      {rest.length ? (
        <div className="guide-stack">
          {rest.map((card) => (
            <GuideCard key={`${card.n}-${card.title}`} card={card} />
          ))}
        </div>
      ) : null}
    </>
  )
}

export default function Guide() {
  return (
    <article className="guide">
      {pieces.map((piece, index) =>
        piece.type === 'md' ? (
          <ReactMarkdown key={index} remarkPlugins={[remarkGfm]} components={prose}>
            {piece.text}
          </ReactMarkdown>
        ) : (
          <CardStack key={index} items={piece.cards} />
        ),
      )}
    </article>
  )
}
