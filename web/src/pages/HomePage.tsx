import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="home-landing">
      <header className="page-header home-landing__hero">
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

      <div className="home-landing__quick" aria-label="Quick links">
        <p className="home-landing__quick-intro">
          Start here — open a standard, diagram, or process map without using the
          sidebar.
        </p>

        <section className="section home-landing__link-block">
          <h2>Core standards (at a glance)</h2>
          <div className="grid-2 home-landing__grid">
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

        <section className="section home-landing__link-block">
          <h2>Business process flows &amp; diagrams (at a glance)</h2>
          <p className="home-landing__link-block-lede">
            PDFs by executive segment, Syncfusion views, JSON and Mermaid source
            tools — import, export, team catalogues, and dev save to repo where
            supported.
          </p>
          <div className="grid-2 home-landing__grid">
            <Link
              className="card card--interactive"
              to="/business-process-flows"
            >
              <h4>Business process flows</h4>
              <p>
                Team segments, PDF import/export, full screen, dev save to{' '}
                <code>public/process-flows</code> / <code>catalog.json</code>.
              </p>
            </Link>
            <Link
              className="card card--interactive"
              to="/organizational-ownership"
            >
              <h4>Organizational ownership (Syncfusion)</h4>
              <p>
                Executive-line org scenarios; explore ownership in the diagram.
              </p>
            </Link>
            <Link className="card card--interactive" to="/portal/diagrams">
              <h4>Diagram standards repository</h4>
              <p>
                JSON catalogue with category and team filters; Mermaid for
                sketches.
              </p>
            </Link>
            <Link className="card card--interactive" to="/portal/json-diagram">
              <h4>JSON → diagram</h4>
              <p>
                Tree layouts and grid views; team-scoped repo files; import,
                export, dev save to <code>diagram-sources</code>.
              </p>
            </Link>
            <Link
              className="card card--interactive"
              to="/portal/mermaid-diagram"
            >
              <h4>Mermaid diagram</h4>
              <p>
                Native Mermaid preview or Syncfusion flow; same team catalogue
                and dev save as JSON sources.
              </p>
            </Link>
            <Link className="card card--interactive" to="/kpi">
              <h4>KPI snapshot</h4>
              <p>
                Core standards count and per-team totals for PDFs, JSON, Mermaid,
                and diagram library entries.
              </p>
            </Link>
          </div>
        </section>
      </div>

      <div className="home-landing__narrative">
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
      </div>
    </div>
  )
}
