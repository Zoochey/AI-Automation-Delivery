export function DataStandardPage() {
  return (
    <>
      <header className="page-header">
        <h1>AI Data Standard</h1>
        <p className="lede">
          How data is classified, managed, and safely used in automation and AI
          solutions.
        </p>
      </header>

      <section className="section">
        <h2>What it covers</h2>
        <ul>
          <li>Data classification</li>
          <li>AI usage boundaries</li>
          <li>Field-level sensitivity</li>
          <li>Data readiness for AI</li>
          <li>Storage and handling expectations</li>
        </ul>
      </section>

      <section className="section">
        <h2>Data classification</h2>
        <div className="table-wrap">
          <table className="simple">
            <thead>
              <tr>
                <th>Class</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>A</strong>
                </td>
                <td>Highly sensitive / restricted</td>
              </tr>
              <tr>
                <td>
                  <strong>B</strong>
                </td>
                <td>Sensitive internal</td>
              </tr>
              <tr>
                <td>
                  <strong>C</strong>
                </td>
                <td>General internal</td>
              </tr>
              <tr>
                <td>
                  <strong>D</strong>
                </td>
                <td>Public / low sensitivity</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>AI usage rules</h2>
        <ul>
          <li>A data must not be used in external AI tools</li>
          <li>B data may require masking or approval</li>
          <li>C data is generally suitable for internal AI use</li>
          <li>D data is low risk and broadly usable</li>
        </ul>
      </section>

      <section className="section">
        <h2>Classification levels</h2>
        <p>Classify where practical at:</p>
        <ul className="class-tags">
          <li>Dataset level</li>
          <li>Table level</li>
          <li>Column / field level</li>
        </ul>
      </section>

      <section className="section">
        <h2>Data pipeline pattern</h2>
        <p>AI-ready data should ideally follow:</p>
        <div className="pipeline">
          Source → Extract → Clean → Transform → AI-Ready Dataset
        </div>
      </section>

      <section className="section">
        <h2>Risks</h2>
        <ul>
          <li>Data leakage</li>
          <li>Inappropriate AI usage</li>
          <li>Poor data quality</li>
          <li>Unclear ownership</li>
        </ul>
      </section>

      <section className="section">
        <h2>Benefits</h2>
        <ul>
          <li>Safer AI adoption</li>
          <li>Clear data boundaries</li>
          <li>Better trust and compliance</li>
        </ul>
      </section>

      <section className="section">
        <h2>Exclusions</h2>
        <ul>
          <li>Full enterprise data governance framework</li>
          <li>Legal policy detail</li>
          <li>Regulatory interpretations</li>
        </ul>
      </section>
    </>
  )
}
