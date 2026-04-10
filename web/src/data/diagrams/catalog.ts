import type { DiagramCatalogEntry, DiagramDefinition } from '../../models/diagramTypes.ts'
import {
  MERMAID_WORKSHOP_SAMPLE,
  mermaidToDiagram,
} from '../../services/mermaidToDiagram.ts'

import bpmnPlaceholder from './bpmn-placeholder.json'
import dataTreeSample from './data-tree-sample.json'
import deliveryFramework from './delivery-framework.json'
import orgFinance from './org-finance.json'
import processDelivery from './process-delivery.json'
import reportLineageSample from './report-lineage-sample.json'
import standardsControlsSample from './standards-controls-sample.json'

function def(json: unknown): DiagramDefinition {
  return json as DiagramDefinition
}

const mermaidWorkshop = mermaidToDiagram(MERMAID_WORKSHOP_SAMPLE, {
  id: 'mermaid-workshop-sample',
  title: 'Mermaid workshop sample',
  description: 'Generated from MERMAID_WORKSHOP_SAMPLE via mermaidToDiagram.',
})

export const DIAGRAM_CATALOG: DiagramCatalogEntry[] = [
  {
    definition: def(deliveryFramework),
    category: 'appendices',
    teamId: 'executive',
    tags: ['delivery', 'framework', 'appendix-a'],
    summary: 'End-to-end delivery journey with production feedback loop.',
    owner: 'AI / Automation function',
    department: 'Enterprise',
    version: '1.0',
    status: 'published',
    createdAt: '2026-04-01',
    updatedAt: '2026-04-10',
    sourceType: 'manual',
  },
  {
    definition: def(orgFinance),
    category: 'organisation-maps',
    teamId: 'finance',
    tags: ['finance', 'org', 'reporting'],
    summary: 'Sample CFO line for reporting-pack ownership.',
    owner: 'Finance CoE',
    department: 'Finance',
    version: '0.2',
    status: 'draft',
    createdAt: '2026-04-05',
    updatedAt: '2026-04-09',
    sourceType: 'manual',
  },
  {
    definition: def(processDelivery),
    category: 'process-flows',
    teamId: 'product-technology',
    tags: ['handoff', 'gates', 'delivery'],
    summary: 'Checkpoint map from intake through monitoring.',
    owner: 'Delivery lead',
    department: 'Technology',
    version: '0.1',
    status: 'review',
    createdAt: '2026-04-08',
    updatedAt: '2026-04-10',
    sourceType: 'manual',
  },
  {
    definition: def(reportLineageSample),
    category: 'report-lineage',
    teamId: 'finance',
    tags: ['pbi', 'lineage', 'executive'],
    summary: 'Illustrative path from sources to published pack.',
    owner: 'Analytics',
    department: 'Finance',
    version: '0.1',
    status: 'draft',
    createdAt: '2026-04-09',
    updatedAt: '2026-04-10',
    sourceType: 'manual',
  },
  {
    definition: mermaidWorkshop,
    category: 'process-flows',
    teamId: 'internal-it-systems',
    tags: ['mermaid', 'import', 'workshop'],
    summary: 'Converted from Mermaid for rapid client sketching.',
    owner: 'Facilitator',
    department: 'Any',
    version: '0.1',
    status: 'draft',
    createdAt: '2026-04-10',
    updatedAt: '2026-04-10',
    sourceType: 'mermaid',
  },
  {
    definition: def(bpmnPlaceholder),
    category: 'bpmn-models',
    teamId: 'customer-operations',
    tags: ['bpmn', 'roadmap'],
    summary: 'Flow placeholder until BPMN shapes are mapped in diagramMapper.',
    owner: 'Process architecture',
    department: 'Operations',
    version: '0.0',
    status: 'draft',
    createdAt: '2026-04-10',
    updatedAt: '2026-04-10',
    sourceType: 'manual',
  },
  {
    definition: def(dataTreeSample),
    category: 'data-structures',
    teamId: 'internal-it-systems',
    tags: ['taxonomy', 'data'],
    summary: 'Tree layout for nested structures and glossaries.',
    owner: 'Data governance',
    department: 'IT',
    version: '0.1',
    status: 'draft',
    createdAt: '2026-04-10',
    updatedAt: '2026-04-10',
    sourceType: 'manual',
  },
  {
    definition: def(standardsControlsSample),
    category: 'standards-controls',
    teamId: 'governance-risk',
    tags: ['governance', 'controls', 'standards'],
    summary: 'Map standards to control themes for audits and design.',
    owner: 'Risk & compliance',
    department: 'Legal',
    version: '0.1',
    status: 'review',
    createdAt: '2026-04-10',
    updatedAt: '2026-04-10',
    sourceType: 'manual',
  },
]

export function getCatalogEntry(id: string): DiagramCatalogEntry | undefined {
  return DIAGRAM_CATALOG.find((e) => e.definition.id === id)
}
