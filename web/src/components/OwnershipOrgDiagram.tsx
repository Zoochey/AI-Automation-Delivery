import '@syncfusion/ej2-diagrams/styles/material.css'

import { DataManager } from '@syncfusion/ej2-data'
import {
  DataBinding,
  DiagramComponent,
  HierarchicalTree,
  Inject,
  Snapping,
} from '@syncfusion/ej2-react-diagrams'
import type { ConnectorModel, NodeModel } from '@syncfusion/ej2-react-diagrams'
import { useMemo } from 'react'

import type { OrgChartRow } from '../data/orgOwnershipPacks.ts'
import {
  applyWhiteConnectorStyle,
  DIAGRAM_TOOL_SELECT_AND_PAN,
} from './diagrams/diagramConnectorStyle.ts'
import { FAINT_GRID_SNAP } from './diagrams/diagramSnapSettings.ts'

const ROLE_COLORS: Record<string, string> = {
  Executive: '#0b5cab',
  Finance: '#107c10',
  IT: '#8764b8',
  Technology: '#c239b3',
  Operations: '#ca5010',
  Customer: '#038387',
  Legal: '#5c2d91',
  HR: '#e81123',
  Retail: '#0078d4',
  Component: '#6CA0DC',
}

type Props = {
  rows: OrgChartRow[]
  /** Changing this remounts the diagram so new data binds reliably. */
  diagramKey: string
}

export function OwnershipOrgDiagram({ rows, diagramKey }: Props) {
  const dataManager = useMemo(
    () => new DataManager(rows as unknown as JSON[]),
    [rows],
  )

  return (
    <div
      className="syncfusion-diagram-host ownership-org-diagram"
      role="img"
      aria-label="Organizational ownership chart aligned to executive roles"
    >
      <DiagramComponent
        key={diagramKey}
        id={`ownership-org-${diagramKey}`}
        width="100%"
        height="560px"
        tool={DIAGRAM_TOOL_SELECT_AND_PAN}
        snapSettings={FAINT_GRID_SNAP}
        dataSourceSettings={{
          id: 'Name',
          parentId: 'ReportingPerson',
          dataManager,
        }}
        layout={{
          type: 'OrganizationalChart',
          orientation: 'TopToBottom',
          horizontalSpacing: 28,
          verticalSpacing: 44,
          margin: { top: 20, left: 20, right: 20, bottom: 20 },
        }}
        getNodeDefaults={(node: NodeModel) => {
          const data = node.data as OrgChartRow | undefined
          node.width = 200
          node.height = 76
          if (data) {
            const fill = ROLE_COLORS[data.Role] ?? ROLE_COLORS.Component
            node.style = { ...node.style, fill }
            node.annotations = [
              {
                content: `${data.Title}\n${data.Domain}`,
                style: { color: 'white', fontSize: 11 },
              },
            ]
          }
          return node
        }}
        getConnectorDefaults={(connector: ConnectorModel) => {
          connector.type = 'Orthogonal'
          connector.cornerRadius = 6
          applyWhiteConnectorStyle(connector)
          return connector
        }}
      >
        <Inject services={[HierarchicalTree, DataBinding, Snapping]} />
      </DiagramComponent>
    </div>
  )
}
