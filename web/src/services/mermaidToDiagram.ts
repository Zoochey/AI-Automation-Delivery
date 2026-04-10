/**
 * Starter Mermaid → DiagramDefinition converter (flowchart-style only).
 *
 * Supported:
 * - Headers: flowchart TB|TD|BT|LR|RL  or  graph TB|...
 * - Node shapes on their own line: id[Label], id(Label), id{Label}
 * - Chains: A --> B --> C
 * - Labeled edges: A -->|text| B (one label per segment when chained)
 * - Blank lines and %% comments ignored
 *
 * Unsupported (ignored or breaks parsing): subgraphs, classDef, links, styling,
 * multiple edges with & on one line, sequence/state diagrams, etc.
 */
import type {
  DiagramDefinition,
  DiagramEdge,
  DiagramLayoutHint,
  DiagramNode,
  FlowShapeHint,
} from '../models/diagramTypes.ts'

type NodeAcc = { label: string; flowShape?: FlowShapeHint }

function parseOrientation(line: string): DiagramLayoutHint {
  const m = line.match(/\s+(tb|td|bt|lr|rl)\s*$/i)
  const dir = m?.[1]?.toUpperCase()
  if (dir === 'LR') return { orientation: 'LeftToRight' }
  if (dir === 'RL') return { orientation: 'RightToLeft' }
  if (dir === 'BT') return { orientation: 'BottomToTop' }
  return { orientation: 'TopToBottom' }
}

function parseEdgeChain(
  line: string,
  nodes: Map<string, NodeAcc>,
  edges: DiagramEdge[],
  nextEdgeId: { n: number },
) {
  let rest = line.trim()
  while (rest.length > 0) {
    const m = rest.match(/^(\w+)\s*-->\s*(?:\|([^|]*)\|\s*)?(\w+)/)
    if (!m) break
    const from = m[1]
    const label = m[2]?.trim() || undefined
    const to = m[3]
    edges.push({
      id: `mmd-e-${++nextEdgeId.n}`,
      source: from,
      target: to,
      label,
    })
    if (!nodes.has(from)) nodes.set(from, { label: from })
    if (!nodes.has(to)) nodes.set(to, { label: to })
    rest = rest.slice(m[0].length).trimStart()
    if (/^-->/.test(rest)) {
      rest = `${to} ${rest}`
    } else {
      break
    }
  }
}

export function mermaidToDiagram(
  source: string,
  options?: {
    id?: string
    title?: string
    description?: string
  },
): DiagramDefinition {
  const nodeMap = new Map<string, NodeAcc>()
  const edges: DiagramEdge[] = []
  const nextEdgeId = { n: 0 }
  let layout: DiagramLayoutHint = { orientation: 'TopToBottom' }

  const lines = source
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('%%'))

  for (const line of lines) {
    if (/^(flowchart|graph)\s+/i.test(line)) {
      layout = { ...layout, ...parseOrientation(line) }
      continue
    }

    const rect = line.match(/^(\w+)\[([^\]]*)\]\s*$/)
    if (rect) {
      nodeMap.set(rect[1], {
        label: rect[2].trim() || rect[1],
        flowShape: 'Process',
      })
      continue
    }

    const stadium = line.match(/^(\w+)\(([^)]*)\)\s*$/)
    if (stadium) {
      nodeMap.set(stadium[1], {
        label: stadium[2].trim() || stadium[1],
        flowShape: 'Terminator',
      })
      continue
    }

    const diamond = line.match(/^(\w+)\{([^}]*)\}\s*$/)
    if (diamond) {
      nodeMap.set(diamond[1], {
        label: diamond[2].trim() || diamond[1],
        flowShape: 'Decision',
      })
      continue
    }

    if (line.includes('-->')) {
      parseEdgeChain(line, nodeMap, edges, nextEdgeId)
      continue
    }
  }

  const nodes: DiagramNode[] = Array.from(nodeMap.entries()).map(([id, v]) => ({
    id,
    label: v.label,
    styleHint: v.flowShape ? { flowShape: v.flowShape } : undefined,
  }))

  return {
    id: options?.id ?? 'mermaid-import',
    title: options?.title ?? 'Imported flowchart',
    type: 'flowchart',
    description: options?.description,
    layout,
    nodes,
    edges,
    metadata: { source: 'mermaid', converter: 'mermaidToDiagram v1' },
  }
}

/** Built-in sample for docs and portal catalog */
export const MERMAID_WORKSHOP_SAMPLE = `flowchart TB
  A[Start] --> B[Review Request]
  B --> C[Approve]
  B --> D[Reject]`
