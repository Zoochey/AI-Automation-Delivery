import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <>
      <header className="page-header">
        <h1>Executive summary</h1>
        <p className="lede">
          Minimum baseline standards for how AI and automation solutions are
          identified, assessed, designed, delivered, and governed across the
          organisation.
        </p>
        <div className="badge-row">
          <span className="badge">Draft v1.0</span>
          <span className="badge">AI / Automation Function</span>
        </div>
      </header>

      <section className="section">
        <h2>Intent</h2>
        <p>
          This framework supports safe, practical, and scalable adoption of AI
          and automation with clear guidance on data handling, use case
          prioritisation, solution design, integration, and governance. It is
          intentionally lightweight and will evolve as adoption matures.
        </p>
      </section>

      <section className="section">
        <h2>Objectives</h2>
        <ul>
          <li>Reduce manual effort through practical automation</li>
          <li>Introduce AI in a controlled and trusted way</li>
          <li>Standardise how use cases are captured and prioritised</li>
          <li>Ensure data is handled safely and appropriately</li>
          <li>Establish consistent delivery and governance practices</li>
        </ul>
      </section>

      <section className="section">
        <h2>Core principles</h2>
        <ul>
          <li>Start with business value, not technology</li>
          <li>Use automation before AI where appropriate</li>
          <li>Keep humans in the loop for higher-risk scenarios</li>
          <li>Treat prompts, workflows, and data rules as governed assets</li>
          <li>Log and monitor all production solutions</li>
          <li>Keep standards practical, lightweight, and iterative</li>
        </ul>
      </section>

      <section className="section">
        <h2>Core standards (at a glance)</h2>
        <div className="grid-2">
          <Link className="card card--interactive" to="/standards/data">
            <h4>1. AI Data Standard</h4>
            <p>Classification, AI usage boundaries, readiness, handling.</p>
          </Link>
          <Link className="card card--interactive" to="/standards/use-case">
            <h4>2. AI Use Case Standard</h4>
            <p>Intake, problem definition, types, prioritisation.</p>
          </Link>
          <Link className="card card--interactive" to="/standards/automation">
            <h4>3. Automation &amp; Integration</h4>
            <p>API-first design, naming, logging, version control.</p>
          </Link>
          <Link
            className="card card--interactive"
            to="/standards/solution-design"
          >
            <h4>4. AI Solution Design</h4>
            <p>Patterns, prompts, model choice, HITL, fallbacks.</p>
          </Link>
          <Link className="card card--interactive" to="/standards/governance">
            <h4>5. Governance &amp; Risk</h4>
            <p>Risk levels, restricted areas, auditability, voice handling.</p>
          </Link>
          <Link className="card card--interactive" to="/standards/definitions">
            <h4>6. Definitions &amp; document control</h4>
            <p>Shared language and framework versioning.</p>
          </Link>
        </div>
      </section>
    </>
  )
}
