import { DataManager } from '@syncfusion/ej2-data'
import type { ConnectorModel, NodeModel } from '@syncfusion/ej2-react-diagrams'
import type { LayoutModel } from '@syncfusion/ej2-diagrams'

import type { DiagramDefinition, DiagramNode } from '../models/diagramTypes.ts'

const DEFAULT_FLOW_FILL = '#6CA0DC'

const CATEGORY_FILLS: Record<string, string> = {
  Executive: '#0b5cab',
  Finance: '#107c10',
  discovery: '#0b5cab',
  assessment: '#107c10',
  design: '#8764b8',
  operate: '#c239b3',
  source: '#038387',
  transform: '#8764b8',
  publish: '#107c10',
  gate: '#0b5cab',
  standard: '#5c2d91',
  control: '#ca5010',
  entity: '#8764b8',
  attribute: '#038387',
  root: '#0b5cab',
  activity: '#6CA0DC',
  event: '#107c10',
  default: '#6CA0DC',
}

export type BoundHierarchyRow = {
  Name: string
  ReportingPerson: string
  Title: string
  Domain: string
  Role: string
}

export type MappedFlowchart = {
  kind: 'flowchart'
  diagramId: string
  nodes: NodeModel[]
  connectors: ConnectorModel[]
  layout: LayoutModel
}

export type MappedHierarchy = {
  kind: 'bound-hierarchy'
  diagramId: string
  rows: BoundHierarchyRow[]
  layout: LayoutModel
}

/** Fixed-position nodes (e.g. JSON tool grid / swimlane); layout type None in Syncfusion */
export type MappedManualGraph = {
  kind: 'manual-graph'
  diagramId: string
  nodes: NodeModel[]
  connectors: ConnectorModel[]
}

export type MappedSyncfusionDiagram =
  | MappedFlowchart
  | MappedHierarchy
  | MappedManualGraph

function flowShapeFor(node: DiagramNode): { type: 'Flow'; shape: string } {
  const hint = node.styleHint?.flowShape ?? 'Process'
  const map: Record<string, string> = {
    Process: 'Process',
    Terminator: 'Terminator',
    Decision: 'Decision',
    Data: 'Parallelogram',
  }
  return { type: 'Flow', shape: map[hint] ?? 'Process' }
}

function mapFlowchartLike(def: DiagramDefinition): MappedFlowchart {
  const hint = def.layout
  const orientation = hint?.orientation ?? 'TopToBottom'

  const nodes: NodeModel[] = def.nodes.map((n) => {
    const fill =
      n.styleHint?.fill ??
      (n.category ? CATEGORY_FILLS[n.category] : undefined) ??
      DEFAULT_FLOW_FILL
    return {
      id: n.id,
      shape: flowShapeFor(n),
      annotations: [{ content: n.label }],
      style: { fill },
      width: n.styleHint?.width,
      height: n.styleHint?.height,
      addInfo: { diagramNodeId: n.id },
    }
  })

  const connectors: ConnectorModel[] = def.edges.map((e) => ({
    id: e.id,
    sourceID: e.source,
    targetID: e.target,
    annotations: e.label ? [{ content: e.label }] : undefined,
    addInfo: { diagramEdgeId: e.id },
  }))

  const layout: LayoutModel = {
    type: 'Flowchart',
    orientation,
    horizontalSpacing: hint?.horizontalSpacing ?? 50,
    verticalSpacing: hint?.verticalSpacing ?? 40,
    margin: { left: 24, top: 24, right: 24, bottom: 24 },
  }

  return {
    kind: 'flowchart',
    diagramId: def.id,
    nodes,
    connectors,
    layout,
  }
}

function mapHierarchy(
  def: DiagramDefinition,
  layoutType: 'OrganizationalChart' | 'HierarchicalTree',
): MappedHierarchy {
  const hint = def.layout
  const rows: BoundHierarchyRow[] = def.nodes.map((n) => ({
    Name: n.id,
    ReportingPerson: n.parentId ?? '',
    Title: n.label,
    Domain: n.description ?? n.category ?? '',
    Role: n.category ?? 'default',
  }))

  const layout: LayoutModel = {
    type: layoutType,
    orientation: hint?.orientation ?? 'TopToBottom',
    horizontalSpacing: hint?.horizontalSpacing ?? 28,
    verticalSpacing: hint?.verticalSpacing ?? 44,
    margin: { top: 20, left: 20, right: 20, bottom: 20 },
  }

  return {
    kind: 'bound-hierarchy',
    diagramId: def.id,
    rows,
    layout,
  }
}

export function mapDiagramToSyncfusion(def: DiagramDefinition): MappedSyncfusionDiagram {
  switch (def.type) {
    case 'org-chart':
      return mapHierarchy(def, 'OrganizationalChart')
    case 'tree-view':
      return mapHierarchy(def, 'HierarchicalTree')
    case 'flowchart':
    case 'process-map':
    case 'report-lineage':
      return mapFlowchartLike(def)
  }
}

export function hierarchyDataManager(rows: BoundHierarchyRow[]) {
  return new DataManager(rows as unknown as JSON[])
}

export function findDiagramNode(
  def: DiagramDefinition,
  nodeId: string | null,
) {
  if (!nodeId) return null
  return def.nodes.find((n) => n.id === nodeId) ?? null
}
