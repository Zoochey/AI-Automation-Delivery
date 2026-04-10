import type { ConnectorModel, NodeModel } from '@syncfusion/ej2-react-diagrams'
import type { LayoutModel } from '@syncfusion/ej2-diagrams'

import type { DiagramDefinition, DiagramNode } from '../models/diagramTypes.ts'
import type {
  BoundHierarchyRow,
  MappedHierarchy,
  MappedManualGraph,
  MappedSyncfusionDiagram,
} from './diagramMapper.ts'

const CATEGORY_FILLS: Record<string, string> = {
  Executive: '#0b5cab',
  Finance: '#107c10',
  entity: '#8764b8',
  attribute: '#038387',
  root: '#0b5cab',
  object: '#5c2d91',
  array: '#8764b8',
  string: '#107c10',
  number: '#038387',
  boolean: '#ca5010',
  null: '#6CA0DC',
  default: '#6CA0DC',
}

function fillFor(node: DiagramNode): string {
  return (
    node.styleHint?.fill ??
    (node.category ? CATEGORY_FILLS[node.category] : undefined) ??
    CATEGORY_FILLS.default
  )
}

function toBoundRows(def: DiagramDefinition): BoundHierarchyRow[] {
  return def.nodes.map((n) => ({
    Name: n.id,
    ReportingPerson: n.parentId ?? '',
    Title: n.label,
    Domain: n.description ?? n.category ?? '',
    Role: n.category ?? 'default',
  }))
}

function boundHierarchy(
  def: DiagramDefinition,
  layout: LayoutModel,
): MappedHierarchy {
  return {
    kind: 'bound-hierarchy',
    diagramId: def.id,
    rows: toBoundRows(def),
    layout,
  }
}

function nodeDepthMap(nodes: DiagramNode[]): Map<string, number> {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const memo = new Map<string, number>()

  function depthOf(id: string): number {
    if (memo.has(id)) return memo.get(id)!
    const n = byId.get(id)
    if (!n || !n.parentId) {
      memo.set(id, 0)
      return 0
    }
    const d = depthOf(n.parentId) + 1
    memo.set(id, d)
    return d
  }

  nodes.forEach((n) => depthOf(n.id))
  return memo
}

function levelsFromNodes(nodes: DiagramNode[]): DiagramNode[][] {
  const depths = nodeDepthMap(nodes)
  const maxD = Math.max(0, ...depths.values())
  const levels: DiagramNode[][] = Array.from({ length: maxD + 1 }, () => [])
  for (const n of nodes) {
    levels[depths.get(n.id) ?? 0].push(n)
  }
  return levels
}

export type JsonDiagramLayoutId =
  | 'hierarchical-lr'
  | 'hierarchical-tb'
  | 'organizational'
  | 'mindmap-horizontal'
  | 'mindmap-vertical'
  | 'radial'
  | 'complex'
  | 'grid-cards'
  | 'matrix'
  | 'swimlane'
  | 'wireframe'

export const JSON_DIAGRAM_LAYOUT_CARDS: {
  id: JsonDiagramLayoutId
  title: string
  description: string
}[] = [
  {
    id: 'hierarchical-lr',
    title: 'Tree (left → right)',
    description: 'Classic hierarchical tree; good for deep JSON.',
  },
  {
    id: 'hierarchical-tb',
    title: 'Tree (top → bottom)',
    description: 'Vertical tree; familiar org-style reading order.',
  },
  {
    id: 'organizational',
    title: 'Organizational chart',
    description: 'Syncfusion org layout from the same parent/child data.',
  },
  {
    id: 'mindmap-horizontal',
    title: 'Mind map (horizontal)',
    description: 'Root centered; branches spread left and right.',
  },
  {
    id: 'mindmap-vertical',
    title: 'Mind map (vertical)',
    description: 'Root centered; branches above and below.',
  },
  {
    id: 'radial',
    title: 'Radial',
    description: 'Levels on concentric rings from the root.',
  },
  {
    id: 'complex',
    title: 'Complex hierarchical',
    description: 'Alternative layered routing for wide trees.',
  },
  {
    id: 'grid-cards',
    title: 'Grid cards',
    description: 'Each depth as a row; siblings as card columns.',
  },
  {
    id: 'matrix',
    title: 'Matrix (layer columns)',
    description: 'Depth as columns; siblings stack vertically.',
  },
  {
    id: 'swimlane',
    title: 'Swimlane (by depth)',
    description: 'Rows per depth with lane labels; hybrid table feel.',
  },
  {
    id: 'wireframe',
    title: 'Wireframe grid',
    description: 'Same positions as grid cards; outline-only nodes.',
  },
]

function manualGraph(
  def: DiagramDefinition,
  variant: 'grid-cards' | 'matrix' | 'swimlane' | 'wireframe',
): MappedManualGraph {
  const levels = levelsFromNodes(def.nodes)
  const cellW = 228
  const cellH = 92
  const pad = 36
  const labelCol = variant === 'swimlane' ? 96 : 0
  const laneGap = variant === 'swimlane' ? 20 : 0

  const nodes: NodeModel[] = []
  const connectors: ConnectorModel[] = []

  const placeNode = (
    n: DiagramNode,
    centerX: number,
    centerY: number,
    wireframe: boolean,
  ) => {
    const fill = fillFor(n)
    nodes.push({
      id: n.id,
      shape: { type: 'Basic', shape: 'Rectangle' },
      width: 200,
      height: 76,
      offsetX: centerX,
      offsetY: centerY,
      annotations: [
        {
          content: n.label,
          style: { color: wireframe ? '#333' : '#fff', fontSize: 11 },
        },
      ],
      style: wireframe
        ? {
            fill: 'transparent',
            strokeColor: '#6b6b6b',
            strokeWidth: 1.5,
            strokeDashArray: '5 4',
          }
        : { fill },
      addInfo: { diagramNodeId: n.id },
    })
  }

  if (variant === 'swimlane') {
    levels.forEach((row, L) => {
      const y0 = pad + L * (cellH + laneGap)
      const laneCenterY = y0 + cellH / 2
      nodes.push({
        id: `__lane_${L}`,
        shape: { type: 'Basic', shape: 'Rectangle' },
        width: labelCol - 18,
        height: cellH + 4,
        offsetX: pad + (labelCol - 18) / 2,
        offsetY: laneCenterY,
        annotations: [
          {
            content: `Depth ${L}`,
            style: { color: '#333', fontSize: 10 },
          },
        ],
        style: { fill: '#ececec', strokeColor: '#c8c8c8' },
      })
      row.forEach((n, i) => {
        const cx = pad + labelCol + i * cellW + cellW / 2
        placeNode(n, cx, laneCenterY, false)
      })
    })
  } else if (variant === 'matrix') {
    levels.forEach((row, L) => {
      row.forEach((n, i) => {
        const cx = pad + L * cellW + cellW / 2
        const cy = pad + i * cellH + cellH / 2
        placeNode(n, cx, cy, false)
      })
    })
  } else {
    // grid-cards + wireframe
    levels.forEach((row, L) => {
      row.forEach((n, i) => {
        const cx = pad + labelCol + i * cellW + cellW / 2
        const cy = pad + L * cellH + cellH / 2
        placeNode(n, cx, cy, variant === 'wireframe')
      })
    })
  }

  for (const n of def.nodes) {
    if (!n.parentId) continue
    connectors.push({
      id: `e-${n.id}`,
      sourceID: n.parentId,
      targetID: n.id,
      type: 'Orthogonal',
    })
  }

  return {
    kind: 'manual-graph',
    diagramId: def.id,
    nodes,
    connectors,
  }
}

const BASE_MARGIN = { top: 20, left: 20, right: 20, bottom: 20 }

/**
 * Maps JSON-derived tree definitions to Syncfusion models, including layouts not used by the portal catalogue.
 */
export function mapJsonTreeDefinitionToSyncfusion(
  def: DiagramDefinition,
  layoutId: JsonDiagramLayoutId,
): MappedSyncfusionDiagram {
  const hint = def.layout

  switch (layoutId) {
    case 'hierarchical-lr':
      return boundHierarchy(def, {
        type: 'HierarchicalTree',
        orientation: 'LeftToRight',
        horizontalSpacing: hint?.horizontalSpacing ?? 44,
        verticalSpacing: hint?.verticalSpacing ?? 36,
        margin: BASE_MARGIN,
      })
    case 'hierarchical-tb':
      return boundHierarchy(def, {
        type: 'HierarchicalTree',
        orientation: 'TopToBottom',
        horizontalSpacing: hint?.horizontalSpacing ?? 36,
        verticalSpacing: hint?.verticalSpacing ?? 44,
        margin: BASE_MARGIN,
      })
    case 'organizational':
      return boundHierarchy(def, {
        type: 'OrganizationalChart',
        orientation: hint?.orientation ?? 'TopToBottom',
        horizontalSpacing: hint?.horizontalSpacing ?? 28,
        verticalSpacing: hint?.verticalSpacing ?? 44,
        margin: BASE_MARGIN,
      })
    case 'mindmap-horizontal':
      return boundHierarchy(def, {
        type: 'MindMap',
        orientation: 'Horizontal',
        horizontalSpacing: hint?.horizontalSpacing ?? 48,
        verticalSpacing: hint?.verticalSpacing ?? 28,
        margin: BASE_MARGIN,
      })
    case 'mindmap-vertical':
      return boundHierarchy(def, {
        type: 'MindMap',
        orientation: 'vertical',
        horizontalSpacing: hint?.horizontalSpacing ?? 36,
        verticalSpacing: hint?.verticalSpacing ?? 40,
        margin: BASE_MARGIN,
      })
    case 'radial':
      return boundHierarchy(def, {
        type: 'RadialTree',
        orientation: hint?.orientation ?? 'TopToBottom',
        horizontalSpacing: hint?.horizontalSpacing ?? 36,
        verticalSpacing: hint?.verticalSpacing ?? 36,
        margin: BASE_MARGIN,
      })
    case 'complex':
      return boundHierarchy(def, {
        type: 'ComplexHierarchicalTree',
        orientation: hint?.orientation ?? 'TopToBottom',
        horizontalSpacing: hint?.horizontalSpacing ?? 40,
        verticalSpacing: hint?.verticalSpacing ?? 44,
        margin: BASE_MARGIN,
      })
    case 'grid-cards':
      return manualGraph(def, 'grid-cards')
    case 'matrix':
      return manualGraph(def, 'matrix')
    case 'swimlane':
      return manualGraph(def, 'swimlane')
    case 'wireframe':
      return manualGraph(def, 'wireframe')
  }
}
