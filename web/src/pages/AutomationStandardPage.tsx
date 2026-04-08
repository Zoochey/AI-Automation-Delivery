export function AutomationStandardPage() {
  return (
    <>
      <header className="page-header">
        <h1>Automation &amp; Integration Standard</h1>
        <p className="lede">
          Ensure automation solutions are scalable, reliable, supportable, and
          consistent.
        </p>
      </header>

      <section className="section">
        <h2>API-first approach</h2>
        <p>
          Use APIs wherever possible before considering direct system access or
          manual file movement.
        </p>
      </section>

      <section className="section">
        <h2>Naming conventions</h2>
        <p>
          Automations, prompts, APIs, datasets, and workflows should follow
          consistent naming standards. Examples:
        </p>
        <ul>
          <li>
            <code>AI-RAG-FinanceInsights-v1</code>
          </li>
          <li>
            <code>AUTO-ReportDistribution-v2</code>
          </li>
          <li>
            <code>API-ERP-Invoice-POST</code>
          </li>
        </ul>
      </section>

      <section className="section">
        <h2>Logging and monitoring</h2>
        <p>Production automations should capture:</p>
        <ul>
          <li>Start time</li>
          <li>End time</li>
          <li>Execution status</li>
          <li>Errors</li>
          <li>Key inputs / outputs where appropriate</li>
        </ul>
      </section>

      <section className="section">
        <h2>Version control</h2>
        <p>The following should be version-controlled:</p>
        <ul>
          <li>Code</li>
          <li>Workflow definitions</li>
          <li>Prompts</li>
          <li>Templates</li>
          <li>Configuration files</li>
        </ul>
      </section>

      <section className="section">
        <h2>Analytics integration</h2>
        <p>
          Operational logs and usage metrics should be captured into an analytics
          layer where practical.
        </p>
      </section>

      <section className="section">
        <h2>Risks</h2>
        <ul>
          <li>Fragile integrations</li>
          <li>Unclear support ownership</li>
          <li>Inconsistent naming and deployment</li>
          <li>Low visibility of failures</li>
        </ul>
      </section>

      <section className="section">
        <h2>Benefits</h2>
        <ul>
          <li>Better maintainability</li>
          <li>Easier troubleshooting</li>
          <li>More scalable delivery</li>
        </ul>
      </section>

      <section className="section">
        <h2>Exclusions</h2>
        <ul>
          <li>Full DevOps policy</li>
          <li>Infrastructure design standards</li>
          <li>Vendor-specific build standards</li>
        </ul>
      </section>
    </>
  )
}
