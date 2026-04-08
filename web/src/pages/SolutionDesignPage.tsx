export function SolutionDesignPage() {
  return (
    <>
      <header className="page-header">
        <h1>AI Solution Design Standard</h1>
        <p className="lede">
          Design AI solutions in a consistent, explainable, and controlled way.
        </p>
      </header>

      <section className="section">
        <h2>AI solution types</h2>
        <ul className="class-tags">
          <li>Chat</li>
          <li>RAG</li>
          <li>Agent</li>
          <li>Predictive</li>
          <li>Classification</li>
          <li>Hybrid</li>
        </ul>
      </section>

      <section className="section">
        <h2>Prompt standard</h2>
        <p>Each prompt should define:</p>
        <ul>
          <li>Instruction</li>
          <li>Context</li>
          <li>Task</li>
          <li>Constraints</li>
          <li>Output format</li>
        </ul>
      </section>

      <section className="section">
        <h2>Prompt control</h2>
        <p>Prompts are reusable assets and should include:</p>
        <ul>
          <li>Prompt name</li>
          <li>Version</li>
          <li>Owner</li>
          <li>Approval status</li>
          <li>Last updated date</li>
        </ul>
      </section>

      <section className="section">
        <h2>Human-in-the-loop</h2>
        <p>
          Higher-risk outputs should require human review before final action is
          taken.
        </p>
      </section>

      <section className="section">
        <h2>Fallback logic</h2>
        <p>Each AI solution should define what happens if:</p>
        <ul>
          <li>The model fails</li>
          <li>Confidence is low</li>
          <li>Required context is unavailable</li>
          <li>Output is unsafe or incomplete</li>
        </ul>
      </section>

      <section className="section">
        <h2>Risks</h2>
        <ul>
          <li>Hallucinations</li>
          <li>Inconsistent output</li>
          <li>Poor prompt control</li>
          <li>Overreliance on AI</li>
        </ul>
      </section>

      <section className="section">
        <h2>Benefits</h2>
        <ul>
          <li>More predictable solutions</li>
          <li>Better governance</li>
          <li>Reusability and easier improvement</li>
        </ul>
      </section>

      <section className="section">
        <h2>Exclusions</h2>
        <ul>
          <li>Advanced model training standards</li>
          <li>Research experimentation frameworks</li>
        </ul>
      </section>
    </>
  )
}
