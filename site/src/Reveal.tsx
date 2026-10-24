import { useEffect, useRef, type ElementType, type ReactNode } from 'react'

type Props = {
  as?: ElementType
  className?: string
  children: ReactNode
}

function showInView(el: HTMLElement) {
  const visible = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)'))
    .filter((node) => {
      const box = node.getBoundingClientRect()
      return box.bottom > 0 && box.top < window.innerHeight * 0.92
    })
    .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)

  visible.forEach((node, index) => {
    node.style.setProperty('--reveal-delay', `${Math.min(index, 8) * 70}ms`)
    node.classList.add('is-in')
  })

  if (!el.classList.contains('is-in')) {
    el.classList.add('is-in')
  }
}

export default function Reveal({ as: Tag = 'div', className, children }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        showInView(el)
        io.disconnect()
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={className ? `reveal ${className}` : 'reveal'}>
      <span className="reveal-inner">{children}</span>
    </Tag>
  )
}
