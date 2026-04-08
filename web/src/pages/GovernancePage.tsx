export function GovernancePage() {
  return (
    <>
      <header className="page-header">
        <h1>AI Governance &amp; Risk Standard</h1>
        <p className="lede">
          Use AI safely, responsibly, and within defined business boundaries.
        </p>
      </header>

      <section className="section">
        <h2>Restricted / excluded areas</h2>
        <p>The following are excluded unless separately approved:</p>
        <ul>
          <li>Facial recognition</li>
          <li>Biometric identification</li>
          <li>Unapproved personal surveillance use cases</li>
          <li>Unapproved use of highly sensitive data in external AI tools</li>
        </ul>
      </section>

      <section className="section">
        <h2>AI risk levels</h2>
        <div className="table-wrap">
          <table className="simple">
            <thead>
              <tr>
                <th>Level</th>
                <th>Expectation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Low Risk</strong>
                </td>
                <td>Minimal oversight</td>
              </tr>
              <tr>
                <td>
                  <strong>Medium Risk</strong>
                </td>
                <td>Approval required</td>
              </tr>
              <tr>
                <td>
                  <strong>High Risk</strong>
                </td>
                <td>Governance review required</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>Auditability</h2>
        <p>
          AI solutions should be designed so outputs and actions are traceable
          where practical.
        </p>
      </section>

      <section className="section">
        <h2>Voice / speech handling</h2>
        <p>Where speech-to-text or text-to-speech is used, define:</p>
        <ul>
          <li>Whether audio is stored</li>
          <li>Whether transcripts are stored</li>
          <li>Retention period</li>
          <li>Access controls</li>
          <li>Consent requirements where applicable</li>
        </ul>
      </section>

      <section className="section">
        <h2>Risks</h2>
        <ul>
          <li>Loss of trust</li>
          <li>Security and privacy breaches</li>
          <li>Poorly controlled AI use</li>
          <li>Unclear accountability</li>
        </ul>
      </section>

      <section className="section">
        <h2>Benefits</h2>
        <ul>
          <li>Safer adoption</li>
          <li>Greater business trust</li>
          <li>Reduced operational risk</li>
        </ul>
      </section>

      <section className="section">
        <h2>Exclusions</h2>
        <ul>
          <li>Full legal framework</li>
          <li>Enterprise privacy policy</li>
          <li>HR or surveillance policy</li>
        </ul>
      </section>
    </>
  )
}
