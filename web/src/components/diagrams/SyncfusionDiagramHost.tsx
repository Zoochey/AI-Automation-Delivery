import '@syncfusion/ej2-diagrams/styles/material.css'

import {
  ComplexHierarchicalTree,
  DataBinding,
  DiagramComponent,
  FlowchartLayout,
  HierarchicalTree,
  Inject,
  MindMap,
  RadialTree,
  Snapping,
} from '@syncfusion/ej2-react-diagrams'
import type { LayoutModel } from '@syncfusion/ej2-diagrams'
import type { ConnectorModel, NodeModel } from '@syncfusion/ej2-react-diagrams'
import { useCallback, useMemo } from 'react'

import type { BoundHierarchyRow } from '../../services/diagramMapper.ts'
import {
  hierarchyDataManager,
  type MappedHierarchy,
  type MappedManualGraph,
  type MappedSyncfusionDiagram,
} from '../../services/diagramMapper.ts'
import { diagramDomStableKey } from '../../utils/diagramDomKey.ts'
import {
  applyWhiteConnectorStyle,
  DIAGRAM_TOOL_SELECT_AND_PAN,
} from './diagramConnectorStyle.ts'
import { FAINT_GRID_SNAP } from './diagramSnapSettings.ts'

const HIERARCHY_FILLS: Record<string, string> = {
  Executive: '#0b5cab',
  Finance: '#107c10',
  IT: '#8764b8',
  entity: '#8764b8',
  attribute: '#038387',
  root: '#0b5cab',
  default: '#6CA0DC',
}

type SelectionArgs = {
  newValue?: unknown[]
}

function selectionToDiagramNodeId(args: SelectionArgs): string | null {
  const raw = args.newValue?.[0] as
    | { id?: string; data?: { Name?: string } }
    | undefined
  if (!raw) return null
  if (raw.data && typeof raw.data.Name === 'string') return raw.data.Name
  if (typeof raw.id === 'string') return raw.id
  return null
}

type Props = {
  mapped: MappedSyncfusionDiagram
  diagramKey: string
  height?: string
  'aria-label'?: string
  onNodeSelect?: (nodeId: string | null) => void
}

export function SyncfusionDiagramHost({
  mapped,
  diagramKey,
  height = '560px',
  'aria-label': ariaLabel,
  onNodeSelect,
}: Props) {
  const onSelectionChange = useCallback(
    (args: SelectionArgs) => {
      onNodeSelect?.(selectionToDiagramNodeId(args))
    },
    [onNodeSelect],
  )

  const stableDomKey = useMemo(
    () =>
      diagramDomStableKey([
        mapped.kind,
        mapped.diagramId,
        diagramKey,
      ]),
    [mapped.kind, mapped.diagramId, diagramKey],
  )

  if (mapped.kind === 'manual-graph') {
    return (
      <ManualGraphHost
        mapped={mapped}
        stableDomKey={stableDomKey}
        height={height}
        aria-label={ariaLabel}
        onSelectionChange={onSelectionChange}
      />
    )
  }

  if (mapped.kind === 'flowchart') {
    return (
      <div className="syncfusion-diagram-host diagram-host-inner" role="presentation">
        <DiagramComponent
          key={stableDomKey}
          id={`sf-flow-${stableDomKey}`}
          width="100%"
          height={height}
          tool={DIAGRAM_TOOL_SELECT_AND_PAN}
          snapSettings={FAINT_GRID_SNAP}
          nodes={mapped.nodes}
          connectors={mapped.connectors}
          layout={mapped.layout}
          selectionChange={onSelectionChange}
          getNodeDefaults={(node: NodeModel) => {
            node.width = node.width ?? 220
            node.height = node.height ?? 72
            const flowShape = node.shape as { type?: string; shape?: string } | undefined
            if (flowShape?.type === 'Flow' && flowShape.shape === 'Terminator') {
              node.height = 56
            }
            return node
          }}
          getConnectorDefaults={(connector: ConnectorModel) => {
            connector.type = 'Orthogonal'
            applyWhiteConnectorStyle(connector)
            return connector
          }}
        >
          <Inject services={[FlowchartLayout, Snapping]} />
        </DiagramComponent>
      </div>
    )
  }

  return (
    <BoundHierarchyHost
      mapped={mapped}
      stableDomKey={stableDomKey}
      height={height}
      aria-label={ariaLabel}
      onSelectionChange={onSelectionChange}
    />
  )
}

function hierarchyLayoutInject(layoutType: LayoutModel['type'] | undefined) {
  switch (layoutType) {
    case 'MindMap':
      return [MindMap, DataBinding, Snapping]
    case 'RadialTree':
      return [RadialTree, DataBinding, Snapping]
    case 'ComplexHierarchicalTree':
      return [ComplexHierarchicalTree, DataBinding, Snapping]
    default:
      return [HierarchicalTree, DataBinding, Snapping]
  }
}

function ManualGraphHost({
  mapped,
  stableDomKey,
  height,
  'aria-label': ariaLabel,
  onSelectionChange,
}: {
  mapped: MappedManualGraph
  stableDomKey: string
  height: string
  'aria-label'?: string
  onSelectionChange: (args: SelectionArgs) => void
}) {
  return (
    <div
      className="syncfusion-diagram-host diagram-host-inner json-manual-diagram"
      role="img"
      aria-label={ariaLabel ?? 'Diagram'}
    >
      <DiagramComponent
        key={stableDomKey}
        id={`sf-manual-${stableDomKey}`}
        width="100%"
        height={height}
        tool={DIAGRAM_TOOL_SELECT_AND_PAN}
        snapSettings={FAINT_GRID_SNAP}
        nodes={mapped.nodes}
        connectors={mapped.connectors}
        layout={{ type: 'None' }}
        selectionChange={onSelectionChange}
        getNodeDefaults={(node: NodeModel) => {
          if (node.width == null) node.width = 200
          if (node.height == null) node.height = 76
          return node
        }}
        getConnectorDefaults={(connector: ConnectorModel) => {
          connector.type = 'Orthogonal'
          applyWhiteConnectorStyle(connector)
          return connector
        }}
      >
        <Inject services={[Snapping]} />
      </DiagramComponent>
    </div>
  )
}

function BoundHierarchyHost({
  mapped,
  stableDomKey,
  height,
  'aria-label': ariaLabel,
  onSelectionChange,
}: {
  mapped: MappedHierarchy
  stableDomKey: string
  height: string
  'aria-label'?: string
  onSelectionChange: (args: SelectionArgs) => void
}) {
  const dataManager = useMemo(() => {
    return hierarchyDataManager(mapped.rows)
  }, [mapped.rows])

  return (
    <div
      className="syncfusion-diagram-host diagram-host-inner ownership-org-diagram"
      role="img"
      aria-label={ariaLabel ?? 'Organisation diagram'}
    >
      <DiagramComponent
        key={stableDomKey}
        id={`sf-hier-${stableDomKey}`}
        width="100%"
        height={height}
        tool={DIAGRAM_TOOL_SELECT_AND_PAN}
        snapSettings={FAINT_GRID_SNAP}
        dataSourceSettings={{
          id: 'Name',
          parentId: 'ReportingPerson',
          dataManager,
        }}
        layout={mapped.layout}
        selectionChange={onSelectionChange}
        getNodeDefaults={(node: NodeModel) => {
          const data = node.data as BoundHierarchyRow | undefined
          node.width = 200
          node.height = 76
          if (data) {
            const fill = HIERARCHY_FILLS[data.Role] ?? HIERARCHY_FILLS.default
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
        <Inject services={hierarchyLayoutInject(mapped.layout.type)} />
      </DiagramComponent>
    </div>
  )
}
