import { Link } from 'react-router-dom'

export function OperatingModelPage() {
  return (
    <>
      <header className="page-header">
        <h1>Operating model overview</h1>
        <p className="lede">
          All initiatives follow a single high-level flow from problem
          identification through to production use and continuous intake.
        </p>
      </header>

      <section className="section">
        <h2>End-to-end flow</h2>
        <p className="flow-inline">
          Business Problem / Opportunity → Discovery Workshop → People / Process
          / Technology Capture → Use Case Intake → Data Classification → Solution
          Decision → Design → Build → Monitoring → Governance → Production Use
        </p>
      </section>

      <section className="section">
        <h2>Delivery lanes</h2>
        <div className="lanes">
          <div className="lane">
            <span className="lane__dot lane__dot--1" aria-hidden />
            Business Discovery
          </div>
          <div className="lane">
            <span className="lane__dot lane__dot--2" aria-hidden />
            Assessment and Classification
          </div>
          <div className="lane">
            <span className="lane__dot lane__dot--3" aria-hidden />
            Design and Delivery
          </div>
          <div className="lane">
            <span className="lane__dot lane__dot--4" aria-hidden />
            Control and Operations
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Visual flow</h2>
        <p>
          Appendix A maps the same journey as a lane-based flowchart. Open the{' '}
          <Link to="/portal/mermaid-diagram">Mermaid diagram</Link> page to edit
          and explore it interactively.
        </p>
      </section>
    </>
  )
}
