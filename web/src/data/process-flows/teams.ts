export type TeamProcessFlow = {
  id: string
  label: string
  notes?: string
}

/**
 * High-level delivery segments (org chart “Team” line). Keep ids stable: used in
 * `catalog.json`, `public/process-flows/<id>/`, and diagram `teamId`.
 */
export const TEAM_PROCESS_FLOWS: TeamProcessFlow[] = [
  {
    id: 'executive',
    label: 'Executive',
    notes: 'Executive business process maps.',
  },
  {
    id: 'finance',
    label: 'Finance',
    notes: 'Finance business process maps.',
  },
  {
    id: 'internal-it-systems',
    label: 'Internal IT / Systems',
    notes: 'Internal IT and systems business process maps.',
  },
  {
    id: 'product-technology',
    label: 'Product & Technology',
    notes: 'Product and technology business process maps.',
  },
  {
    id: 'network-delivery-construction',
    label: 'Network Delivery / Construction',
    notes: 'Network delivery and construction business process maps.',
  },
  {
    id: 'customer-operations',
    label: 'Customer Operations',
    notes: 'Customer operations business process maps.',
  },
  {
    id: 'governance-risk',
    label: 'Governance & Risk',
    notes: 'Governance and risk business process maps.',
  },
  {
    id: 'hr-workforce',
    label: 'HR / Workforce',
    notes: 'HR and workforce business process maps.',
  },
  {
    id: 'retail-delivery',
    label: 'Retail Delivery',
    notes: 'Retail delivery business process maps.',
  },
]

export function teamLabel(teamId: string): string {
  return TEAM_PROCESS_FLOWS.find((t) => t.id === teamId)?.label ?? teamId
}
