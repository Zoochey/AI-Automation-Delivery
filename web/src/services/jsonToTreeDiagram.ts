import type { DiagramDefinition, DiagramNode } from '../models/diagramTypes.ts'

/**
 * Flattens arbitrary JSON into a tree-view DiagramDefinition (parentId links).
 * Suited for Syncfusion HierarchicalTree / org-style layouts.
 */
export function jsonToTreeDiagramDefinition(
  data: unknown,
  options?: { title?: string; id?: string; rootLabel?: string },
): DiagramDefinition {
  const nodes: DiagramNode[] = []
  let counter = 0
  const nextId = () => `j${++counter}`

  function addNode(
    label: string,
    parentId: string | undefined,
    category: string,
  ): string {
    const id = nextId()
    nodes.push({ id, label, parentId, category })
    return id
  }

  function walk(
    value: unknown,
    keyName: string,
    parentId: string | undefined,
  ): void {
    if (value === null || value === undefined) {
      addNode(`${keyName}: ${String(value)}`, parentId, 'null')
      return
    }

    const prim = typeof value
    if (prim !== 'object') {
      const display =
        prim === 'string'
          ? `"${value}"`
          : prim === 'number' || prim === 'boolean'
            ? String(value)
            : String(value)
      addNode(`${keyName}: ${display}`, parentId, prim)
      return
    }

    if (Array.isArray(value)) {
      const pid = addNode(`${keyName} · [${value.length}]`, parentId, 'array')
      value.forEach((item, i) => {
        walk(item, `[${i}]`, pid)
      })
      return
    }

    const o = value as Record<string, unknown>
    const keys = Object.keys(o)
    const pid = addNode(
      keys.length ? `${keyName} · ${keys.length} keys` : `${keyName} · {}`,
      parentId,
      'object',
    )
    for (const k of keys) {
      walk(o[k], k, pid)
    }
  }

  walk(data, options?.rootLabel ?? 'JSON', undefined)

  return {
    id: options?.id ?? 'json-tree',
    title: options?.title ?? 'JSON structure',
    type: 'tree-view',
    description: 'Generated from JSON for hierarchical layout.',
    layout: {
      orientation: 'LeftToRight',
      horizontalSpacing: 44,
      verticalSpacing: 36,
    },
    nodes,
    edges: [],
    metadata: { generator: 'jsonToTreeDiagramDefinition' },
  }
}
