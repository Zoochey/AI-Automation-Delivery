import { useMemo } from 'react'

import type { DiagramDefinition } from '../../models/diagramTypes.ts'
import {
  mapDiagramToSyncfusion,
  type MappedSyncfusionDiagram,
} from '../../services/diagramMapper.ts'
import { SyncfusionDiagramHost } from './SyncfusionDiagramHost.tsx'

type Props = {
  definition: DiagramDefinition
  /** When set (e.g. JSON → diagram page), overrides catalogue mapping */
  mapDefinition?: (def: DiagramDefinition) => MappedSyncfusionDiagram
  /** Remount diagram when definition identity changes */
  instanceKey?: string
  height?: string
  'aria-label'?: string
  onNodeSelect?: (nodeId: string | null) => void
}

export function DiagramCanvas({
  definition,
  mapDefinition,
  instanceKey,
  height,
  'aria-label': ariaLabel,
  onNodeSelect,
}: Props) {
  const mapped = useMemo(
    () => (mapDefinition ?? mapDiagramToSyncfusion)(definition),
    [definition, mapDefinition],
  )

  const diagramKey = instanceKey ?? definition.id

  return (
    <SyncfusionDiagramHost
      mapped={mapped}
      diagramKey={diagramKey}
      height={height}
      aria-label={ariaLabel ?? definition.title}
      onNodeSelect={onNodeSelect}
    />
  )
}
