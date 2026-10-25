import { useLayoutEffect, useRef, useState } from 'react'
import { Boxes, Database, LayoutTemplate, PanelTop, Radio } from 'lucide-react'
import { DiagramMark } from '../guideMarks.tsx'

type Box = { x: number; y: number; w: number; h: number }

type Wire = { x1: number; y1: number; x2: number; y2: number }

type Layout = {
  w: number
  h: number
  frameH: number
  header: Box
  body: Box
  headerTree: Box
  bodyTree: Box
  ctx: Box
  stop: Wire | null
  stopCap: Wire | null
  channelY: number
  channelH: number
  wires: Wire[]
}

function buildLayout(w: number): Layout {
  const stacked = w < 400
  const framePad = 16
  const rootGap = stacked ? 16 : 40
  const rootPad = 12
  const rootH = 168
  const innerX = framePad
  const innerW = w - framePad * 2
  const header: Box = { x: innerX, y: 40, w: innerW, h: rootH }
  const body: Box = { x: innerX, y: 40, w: innerW, h: rootH }

  if (!stacked) {
    const rootW = (innerW - rootGap) / 2
    header.w = rootW
    body.x = innerX + rootW + rootGap
    body.w = rootW
  } else {
    body.y = header.y + rootH + rootGap
  }

  const frameH = (stacked ? body.y + body.h : header.y + header.h) + framePad
  const channelY = frameH + 32
  const channelH = 68
  const treeOf = (box: Box): Box => ({
    x: box.x + rootPad,
    y: box.y + 34,
    w: box.w - rootPad * 2,
    h: box.h - 34 - rootPad,
  })
  const headerTree = treeOf(header)
  const bodyTree = treeOf(body)
  const ctx: Box = {
    x: headerTree.x + 10,
    y: headerTree.y + 30,
    w: Math.min(120, Math.max(88, headerTree.w - 108)),
    h: 40,
  }
  const stopY = ctx.y + ctx.h / 2
  const stopX = header.x + header.w - 10
  const lineStart = ctx.x + ctx.w + 8
  const showStop = stopX - lineStart > 18
  const wires: Wire[] = []

  if (!stacked) {
    const fromY = header.y + header.h
    const leftX = header.x + header.w / 2
    const rightX = body.x + body.w / 2
    wires.push({ x1: leftX, y1: fromY, x2: leftX, y2: channelY })
    wires.push({ x1: rightX, y1: fromY, x2: rightX, y2: channelY })
  } else {
    const busX = 8
    const headerMid = header.y + header.h / 2
    const bodyMid = body.y + body.h / 2
    wires.push({ x1: busX, y1: headerMid, x2: header.x, y2: headerMid })
    wires.push({ x1: busX, y1: bodyMid, x2: body.x, y2: bodyMid })
    wires.push({ x1: busX, y1: headerMid, x2: busX, y2: channelY })
  }

  return {
    w,
    h: channelY + channelH,
    frameH,
    header,
    body,
    headerTree,
    bodyTree,
    ctx,
    stop: showStop ? { x1: lineStart, y1: stopY, x2: stopX, y2: stopY } : null,
    stopCap: showStop
      ? { x1: stopX, y1: stopY - 8, x2: stopX, y2: stopY + 8 }
      : null,
    channelY,
    channelH,
    wires,
  }
}

function Mount({ box, title }: { box: Box; title: string }) {
  return (
    <g>
      <rect className="roots-mount" x={box.x} y={box.y} width={box.w} height={box.h} rx={8} />
      <DiagramMark
        icon={title === 'Header root' ? PanelTop : LayoutTemplate}
        x={box.x + 10}
        y={box.y + 6}
      />
      <text x={box.x + 28} y={box.y + 18} textAnchor="start">
        {title}
      </text>
    </g>
  )
}

function Tree({ box }: { box: Box }) {
  return (
    <g>
      <rect className="roots-tree" x={box.x} y={box.y} width={box.w} height={box.h} rx={8} />
      <text x={box.x + box.w / 2} y={box.y + 16} textAnchor="middle">
        Preact
      </text>
    </g>
  )
}

export default function IsolatedPreactRoots() {
  const frameRef = useRef<HTMLElement>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const apply = () => {
      const next = Math.round(el.getBoundingClientRect().width)
      setWidth((prev) => (prev === next ? prev : next))
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const layout = width >= 40 ? buildLayout(width) : null

  return (
    <figure className="roots" ref={frameRef} aria-label="Isolated Preact roots">
      <p className="arch-sr">
        JSP builds separate header and body roots, Preact renders an isolated tree in each, and
        the modules share state through localStorage and events because a context provider cannot
        cross those roots.
      </p>
      <div className="roots-heading">
        <h2>
          <Boxes className="guide-mark" size={18} aria-hidden="true" />
          Isolated Preact roots
        </h2>
        <p>Context stays in one tree</p>
      </div>
      <ul className="arch-legend roots-legend">
        <li>
          <span className="swatch swatch-blue" />
          Preact tree
        </li>
        <li>
          <span className="swatch swatch-purple" />
          Browser bridge
        </li>
      </ul>
      {layout ? (
        <svg
          className="roots-svg"
          role="img"
          aria-label="JSP header and body roots. Context stops at the header tree. localStorage and events connect the modules."
          viewBox={`0 0 ${layout.w} ${layout.h}`}
        >
          <rect className="roots-frame" x={1} y={1} width={layout.w - 2} height={layout.frameH - 2} rx={12} />
          <text x={16} y={20} textAnchor="start">
            JSP document
          </text>
          <Mount box={layout.header} title="Header root" />
          <Mount box={layout.body} title="Body root" />
          <Tree box={layout.headerTree} />
          <Tree box={layout.bodyTree} />
          <rect
            className="roots-provider"
            x={layout.ctx.x}
            y={layout.ctx.y}
            width={layout.ctx.w}
            height={layout.ctx.h}
            rx={8}
          />
          <DiagramMark icon={Boxes} x={layout.ctx.x + 6} y={layout.ctx.y + 13} size={12} />
          <text x={layout.ctx.x + layout.ctx.w / 2 + 8} y={layout.ctx.y + 14} textAnchor="middle">
            Context
          </text>
          <text x={layout.ctx.x + layout.ctx.w / 2 + 8} y={layout.ctx.y + 28} textAnchor="middle">
            provider
          </text>
          {layout.stop ? (
            <line className="roots-stop" x1={layout.stop.x1} y1={layout.stop.y1} x2={layout.stop.x2} y2={layout.stop.y2} />
          ) : null}
          {layout.stopCap ? (
            <line
              className="roots-wall"
              x1={layout.stopCap.x1}
              y1={layout.stopCap.y1}
              x2={layout.stopCap.x2}
              y2={layout.stopCap.y2}
            />
          ) : null}
          <text x={layout.ctx.x} y={layout.ctx.y + layout.ctx.h + 16} textAnchor="start">
            Stops at root edge
          </text>
          <text
            x={layout.bodyTree.x + layout.bodyTree.w / 2}
            y={layout.bodyTree.y + layout.bodyTree.h / 2 - 4}
            textAnchor="middle"
          >
            No context ancestor
          </text>
          <text
            x={layout.bodyTree.x + layout.bodyTree.w / 2}
            y={layout.bodyTree.y + layout.bodyTree.h / 2 + 18}
            textAnchor="middle"
          >
            No shared store
          </text>
          <rect
            className="roots-channel"
            x={1}
            y={layout.channelY}
            width={layout.w - 2}
            height={layout.channelH}
            rx={12}
          />
          <text x={layout.w / 2} y={layout.channelY + 24} textAnchor="middle">
            Pub/sub between modules
          </text>
          <DiagramMark icon={Database} x={layout.w * 0.32 - 58} y={layout.channelY + 38} />
          <text x={layout.w * 0.32 - 40} y={layout.channelY + 48} textAnchor="start">
            localStorage
          </text>
          <DiagramMark icon={Radio} x={layout.w * 0.68 - 34} y={layout.channelY + 38} />
          <text x={layout.w * 0.68 - 16} y={layout.channelY + 48} textAnchor="start">
            events
          </text>
          {layout.wires.map((wire) => (
            <line
              key={`${wire.x1}-${wire.y1}-${wire.x2}-${wire.y2}`}
              className="roots-wire"
              x1={wire.x1}
              y1={wire.y1}
              x2={wire.x2}
              y2={wire.y2}
            />
          ))}
        </svg>
      ) : null}
    </figure>
  )
}
