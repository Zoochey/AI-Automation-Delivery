import { useMemo, useState } from 'react'

type TeamFlow = {
  id: string
  label: string
  source: 'lucidchart' | 'mermaid-link'
  embedUrl?: string
  linkUrl: string
  notes?: string
}

const TEAM_FLOWS: TeamFlow[] = [
  {
    id: 'finance',
    label: 'Finance',
    source: 'lucidchart',
    embedUrl:
      'https://lucid.app/lucidchart/a93232f6-cb53-4940-ad2e-f6cd9e851b71/embed',
    linkUrl:
      'https://lucid.app/lucidchart/a93232f6-cb53-4940-ad2e-f6cd9e851b71/edit?viewport_loc=1283%2C30%2C4293%2C2116%2C0_0&invitationId=inv_e60f3a9f-02a6-4926-a099-a573701b7c2b',
    notes: 'Finance business process map.',
  },
  {
    id: 'commercial',
    label: 'Commercial',
    source: 'lucidchart',
    // Replace with your Lucidchart embed URL for Commercial.
    embedUrl: '',
    linkUrl: 'https://lucid.app/',
    notes: 'Commercial business process map.',
  },
]

export function BusinessProcessFlowsPage() {
  const [selectedTeamId, setSelectedTeamId] = useState(TEAM_FLOWS[0].id)

  const selectedFlow = useMemo(
    () => TEAM_FLOWS.find((flow) => flow.id === selectedTeamId) ?? TEAM_FLOWS[0],
    [selectedTeamId],
  )

  return (
    <>
      <header className="page-header">
        <h1>Business process flows</h1>
        <p className="lede">
          Choose a team and view its process flow directly in-page, so people do
          not need to search for the right diagram.
        </p>
      </header>

      <section className="section">
        <h2>Select team</h2>
        <label className="flow-selector" htmlFor="team-flow-select">
          Team
          <select
            id="team-flow-select"
            value={selectedTeamId}
            onChange={(event) => setSelectedTeamId(event.target.value)}
          >
            {TEAM_FLOWS.map((flow) => (
              <option key={flow.id} value={flow.id}>
                {flow.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="section">
        <h2>{selectedFlow.label} flow</h2>
        <p>
          Source: <strong>{selectedFlow.source}</strong>
          {selectedFlow.notes ? ` - ${selectedFlow.notes}` : ''}
        </p>

        {selectedFlow.embedUrl ? (
          <div className="flow-embed-wrap">
            <iframe
              title={`${selectedFlow.label} business process flow`}
              src={selectedFlow.embedUrl}
              className="flow-embed"
              loading="lazy"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="card">
            <p>
              Add the {selectedFlow.label} embed URL in
              <code>TEAM_FLOWS</code> to show the diagram directly here.
            </p>
          </div>
        )}

        <p>
          <a href={selectedFlow.linkUrl} target="_blank" rel="noreferrer">
            Open {selectedFlow.label} flow in a new tab
          </a>
        </p>
      </section>
    </>
  )
}
