export function DefinitionsPage() {
  return (
    <>
      <header className="page-header">
        <h1>Definitions &amp; document control</h1>
        <p className="lede">
          Common language and document control for this framework.
        </p>
      </header>

      <section className="section">
        <h2>Key definitions</h2>
        <div className="grid-2">
          <div className="card">
            <h4>Artificial Intelligence (AI)</h4>
            <p>
              Technology that enables systems to perform tasks that typically
              require human intelligence.
            </p>
          </div>
          <div className="card">
            <h4>Machine Learning (ML)</h4>
            <p>
              A subset of AI where systems learn from data to detect patterns or
              make predictions.
            </p>
          </div>
          <div className="card">
            <h4>Prompt</h4>
            <p>
              A structured instruction given to an AI model to guide its
              output.
            </p>
          </div>
          <div className="card">
            <h4>RAG</h4>
            <p>
              Retrieval-Augmented Generation — responses grounded in approved
              internal content or data.
            </p>
          </div>
          <div className="card">
            <h4>AI Agent</h4>
            <p>
              A solution capable of taking actions or coordinating steps across
              systems within defined rules.
            </p>
          </div>
          <div className="card">
            <h4>Human-in-the-Loop</h4>
            <p>
              A control point where a person reviews, approves, or overrides AI
              output before action is taken.
            </p>
          </div>
          <div className="card">
            <h4>Automation</h4>
            <p>
              Technology used to reduce or remove manual effort through
              repeatable workflows, rules, or integrations.
            </p>
          </div>
          <div className="card">
            <h4>API</h4>
            <p>
              Application Programming Interface — a method for systems to
              exchange data or actions in a controlled way.
            </p>
          </div>
          <div className="card">
            <h4>Hybrid solution</h4>
            <p>A solution that combines automation, AI, and human review.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Document control</h2>
        <div className="table-wrap">
          <table className="simple">
            <tbody>
              <tr>
                <th scope="row">Document name</th>
                <td>AI &amp; Automation Delivery Framework</td>
              </tr>
              <tr>
                <th scope="row">Version</th>
                <td>v1.0</td>
              </tr>
              <tr>
                <th scope="row">Status</th>
                <td>Draft</td>
              </tr>
              <tr>
                <th scope="row">Owner</th>
                <td>AI / Automation Function</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>Version history</h2>
        <div className="table-wrap">
          <table className="simple">
            <thead>
              <tr>
                <th>Version</th>
                <th>Date</th>
                <th>Author</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>v1.0</td>
                <td>8 April 2026</td>
                <td>Craig Heywood</td>
                <td>Initial draft</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
