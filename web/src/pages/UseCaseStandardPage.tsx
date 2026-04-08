export function UseCaseStandardPage() {
  return (
    <>
      <header className="page-header">
        <h1>AI Use Case Standard</h1>
        <p className="lede">
          Standardise how automation and AI opportunities are captured,
          classified, assessed, and prioritised.
        </p>
      </header>

      <section className="section">
        <h2>Required use case fields</h2>
        <ul>
          <li>Title</li>
          <li>Department</li>
          <li>Stakeholder</li>
          <li>Business problem</li>
          <li>Current process summary</li>
          <li>People involved</li>
          <li>Systems involved</li>
          <li>Data involved</li>
          <li>Desired outcome</li>
          <li>Risks / constraints</li>
          <li>Expected value</li>
        </ul>
      </section>

      <section className="section">
        <h2>Use case types</h2>
        <ul className="class-tags">
          <li>Automation</li>
          <li>AI-Assisted</li>
          <li>AI-Driven</li>
          <li>Agent-Based</li>
          <li>Hybrid</li>
        </ul>
      </section>

      <section className="section">
        <h2>AI categories</h2>
        <ul className="class-tags">
          <li>Chat</li>
          <li>RAG</li>
          <li>Predictive</li>
          <li>Classification</li>
          <li>Agent</li>
          <li>Hybrid</li>
        </ul>
      </section>

      <section className="section">
        <h2>Scoring criteria</h2>
        <ul>
          <li>Business value</li>
          <li>Effort</li>
          <li>Data readiness</li>
          <li>Risk</li>
          <li>Stakeholder support</li>
          <li>Speed to deliver</li>
        </ul>
      </section>

      <section className="section">
        <h2>Risks</h2>
        <ul>
          <li>Low-value ideas consuming time</li>
          <li>Overuse of AI where simple automation is enough</li>
          <li>Poor prioritisation</li>
        </ul>
      </section>

      <section className="section">
        <h2>Benefits</h2>
        <ul>
          <li>Structured delivery pipeline</li>
          <li>Better prioritisation</li>
          <li>Faster identification of quick wins</li>
        </ul>
      </section>

      <section className="section">
        <h2>Exclusions</h2>
        <ul>
          <li>Detailed project planning</li>
          <li>Resource costing</li>
          <li>Formal portfolio governance</li>
        </ul>
      </section>
    </>
  )
}
