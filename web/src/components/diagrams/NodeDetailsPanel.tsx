import type { DiagramNode } from '../../models/diagramTypes.ts'

type Props = {
  node: DiagramNode | null
  diagramTitle: string
}

export function NodeDetailsPanel({ node, diagramTitle }: Props) {
  return (
    <aside className="diagram-node-panel" aria-label="Selected node details">
      <h3 className="diagram-node-panel__heading">Node details</h3>
      <p className="diagram-node-panel__context">
        <span className="diagram-node-panel__muted">Diagram:</span> {diagramTitle}
      </p>
      {!node ? (
        <p className="diagram-node-panel__empty">
          Select a shape on the diagram to view label, category, and metadata.
        </p>
      ) : (
        <div className="diagram-node-panel__body">
          <dl className="diagram-node-panel__dl">
            <dt>Label</dt>
            <dd>{node.label}</dd>
            <dt>Id</dt>
            <dd>
              <code>{node.id}</code>
            </dd>
            {node.category ? (
              <>
                <dt>Category</dt>
                <dd>{node.category}</dd>
              </>
            ) : null}
            {node.description ? (
              <>
                <dt>Description</dt>
                <dd>{node.description}</dd>
              </>
            ) : null}
          </dl>
          {node.metadata && Object.keys(node.metadata).length > 0 ? (
            <>
              <h4 className="diagram-node-panel__sub">Metadata</h4>
              <ul className="diagram-node-panel__meta">
                {Object.entries(node.metadata).map(([k, v]) => (
                  <li key={k}>
                    <span className="diagram-node-panel__mk">{k}</span>
                    <span className="diagram-node-panel__mv">{String(v)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      )}
    </aside>
  )
}
