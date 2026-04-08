import { MermaidDiagram } from '../components/MermaidDiagram.tsx'

const APPENDIX_A_FLOW = `flowchart TD
  subgraph lane_L1[Business Discovery]
  A["Business Problem / Opportunity"]
  B["Discovery Workshop"]
  C["People / Process / Technology"]
  end

  subgraph lane_L2[Assessment]
  D["Use Case Intake"]
  E["Classification"]
  F["Data Classification"]
  G["Automation / AI / Hybrid Decision"]
  end

  subgraph lane_L3[Design & Build]
  H["Solution Design"]
  I["Prompt / Model / Integration"]
  J["Build & Release"]
  end

  subgraph lane_L4[Operate & Control]
  K["Monitoring & Reporting"]
  L["Governance & Risk"]
  M["Production Use"]
  end

  A --> B --> C --> D --> E --> F --> G --> H --> I --> J --> K --> L --> M
  M --> D`

export function VisualFlowPage() {
  return (
    <>
      <header className="page-header">
        <h1>Appendix A – visual flow</h1>
        <p className="lede">
          Lane-based view of the delivery journey, including the feedback loop
          from production back to use case intake.
        </p>
      </header>

      <section className="section">
        <h2>Diagram</h2>
        <p>
          Rendered locally in the browser with{' '}
          <a href="https://mermaid.js.org/" target="_blank" rel="noreferrer">
            Mermaid
          </a>
          . No external diagram API is required for this view.
        </p>
        <MermaidDiagram
          chart={APPENDIX_A_FLOW}
          aria-label="Delivery framework flow across four lanes from business discovery through production use"
        />
      </section>
    </>
  )
}
