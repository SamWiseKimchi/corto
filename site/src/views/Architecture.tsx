import type { ReactNode } from 'react'
import Reveal from '../Reveal.tsx'

function Card({
  title,
  lines = [],
  children,
}: {
  title: string
  lines?: string[]
  children?: ReactNode
}) {
  return (
    <div className="arch-card">
      <Reveal className="arch-title">{title}</Reveal>
      {lines.map((line) => (
        <Reveal key={line} className="arch-muted">
          {line}
        </Reveal>
      ))}
      {children}
    </div>
  )
}

export default function Architecture() {
  return (
    <section className="architecture" aria-label="Storefront architecture">
      <p className="arch-sr">
        Storefront architecture. JSP builds the root elements. Preact, a
        React-compat wrapper, and jQuery run in the page. A pub/sub shares pet
        profile between agnostic codebases. A versioned React component library
        and Storybook are deployed to GCP and pulled into the main project. The
        page calls Java microservices through Swagger contracts. Constructor.io
        sits on one of those services. Unleash flags and Optimizely experiments
        wrap the recommendation UI.
      </p>
      <div className="arch-heading">
        <div>
          <Reveal as="h1">Storefront architecture</Reveal>
          <Reveal as="p">Page, library, and services</Reveal>
        </div>
        <ul className="arch-legend">
          <li>
            <span className="swatch swatch-blue" />
            Browser page
          </li>
          <li>
            <span className="swatch swatch-purple" />
            Shared library
          </li>
        </ul>
      </div>

      <article className="arch-region arch-region-blue" aria-label="Browser page">
        <div>
          <Reveal>Browser page</Reveal>
          <Reveal className="arch-muted">JSP builds root elements</Reveal>
        </div>
        <div className="arch-peers">
          <Card
            title="Preact + TypeScript"
            lines={['Runs in JSP roots', 'Typed recommendation props']}
          />
          <Card title="React-compat wrapper" lines={['React-shaped Preact API']} />
          <Card title="jQuery" lines={['Same page runtime']} />
        </div>
        <div className="arch-peers">
          <Card title="Storefront codebase" />
          <Card
            title="Pet-profile pub/sub"
            lines={['Species, age, diet', 'No shared component state']}
          />
          <Card title="Other page codebase" />
        </div>
        <Card
          title="Search and recommendations"
          lines={['Cards, carousels, skeletons']}
        />
      </article>

      <div className="arch-deps">
        <article
          className="arch-region arch-region-purple"
          aria-label="Shared component library"
        >
          <div>
            <Reveal>React component library</Reveal>
            <Reveal className="arch-muted">TypeScript, own versions</Reveal>
          </div>
          <Card title="Storybook" />
          <Reveal className="arch-muted">Deployed to GCP</Reveal>
          <Reveal className="arch-muted">Pulled into main project</Reveal>
        </article>
        <article className="arch-region" aria-label="Java microservices">
          <div>
            <Reveal>Java microservices</Reveal>
            <Reveal className="arch-muted">Swagger API contracts</Reveal>
            <Reveal className="arch-muted">Called by the page</Reveal>
          </div>
          <Card title="Constructor.io" lines={['On one microservice']} />
        </article>
        <article className="arch-region" aria-label="Unleash">
          <Reveal>Unleash</Reveal>
          <Reveal className="arch-muted">Feature flags</Reveal>
          <Reveal className="arch-muted">Recommendation rollout</Reveal>
        </article>
        <article className="arch-region" aria-label="Optimizely">
          <Reveal>Optimizely</Reveal>
          <Reveal className="arch-muted">A/B experiments</Reveal>
          <Reveal className="arch-muted">Recommendation rollout</Reveal>
        </article>
      </div>
    </section>
  )
}
