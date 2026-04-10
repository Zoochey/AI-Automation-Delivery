import type { ChangeEvent, RefObject } from 'react'

import type { DiagramSourceDocument } from '../data/diagram-sources/types.ts'
import { TEAM_PROCESS_FLOWS, teamLabel } from '../data/process-flows/teams.ts'

type Props = {
  teamId: string
  onTeamIdChange: (id: string) => void
  repoDocs: DiagramSourceDocument[]
  selectedDocId: string
  onRepoDocChange: (id: string) => void
  loadBusy: boolean
  exportName: string
  onExportNameChange: (v: string) => void
  onImportClick: () => void
  fileInputRef: RefObject<HTMLInputElement | null>
  onFileChange: (ev: ChangeEvent<HTMLInputElement>) => void
  accept: string
  importLabel: string
  onExportDownload: () => void
  exportButtonLabel: string
  saveToRepoLabel: string
  onSaveToRepo: () => void
  onDeleteFromRepo: () => void
  saveBusy: boolean
  deleteBusy: boolean
  isDev: boolean
  saveError: string | null
  selectedRepoDoc: DiagramSourceDocument | null
}

export function TeamDiagramSourceToolbar({
  teamId,
  onTeamIdChange,
  repoDocs,
  selectedDocId,
  onRepoDocChange,
  loadBusy,
  exportName,
  onExportNameChange,
  onImportClick,
  fileInputRef,
  onFileChange,
  accept,
  importLabel,
  onExportDownload,
  exportButtonLabel,
  saveToRepoLabel,
  onSaveToRepo,
  onDeleteFromRepo,
  saveBusy,
  deleteBusy,
  isDev,
  saveError,
  selectedRepoDoc,
}: Props) {
  return (
    <>
      <div className="json-diagram-page__toolbar json-diagram-page__toolbar--wrap">
        <label className="json-diagram-page__team-label">
          Team
          <select
            className="json-diagram-page__team-select"
            value={teamId}
            onChange={(e) => onTeamIdChange(e.target.value)}
            aria-label="Executive segment / team"
          >
            {TEAM_PROCESS_FLOWS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="json-diagram-page__team-label">
          From repo ({teamLabel(teamId)})
          <select
            className="json-diagram-page__team-select json-diagram-page__team-select--wide"
            value={selectedDocId}
            onChange={(e) => onRepoDocChange(e.target.value)}
            disabled={loadBusy}
            aria-label="Load file from team catalogue"
          >
            <option value="">— Editor only —</option>
            {repoDocs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="json-diagram-page__btn"
          onClick={onImportClick}
        >
          {importLabel}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="json-diagram-page__file-input"
          onChange={onFileChange}
          aria-hidden
        />

        <label className="json-diagram-page__filename-label">
          File name
          <input
            type="text"
            className="json-diagram-page__filename-input"
            value={exportName}
            onChange={(e) => onExportNameChange(e.target.value)}
            aria-label="File name for export or save"
          />
        </label>

        <button
          type="button"
          className="json-diagram-page__btn json-diagram-page__btn--primary"
          onClick={onExportDownload}
        >
          {exportButtonLabel}
        </button>

        {isDev ? (
          <>
            <button
              type="button"
              className="json-diagram-page__btn json-diagram-page__btn--primary"
              onClick={onSaveToRepo}
              disabled={saveBusy}
            >
              {saveBusy ? 'Saving…' : saveToRepoLabel}
            </button>
            <button
              type="button"
              className="json-diagram-page__btn"
              onClick={onDeleteFromRepo}
              disabled={deleteBusy || !selectedRepoDoc}
            >
              {deleteBusy ? 'Removing…' : 'Delete from repo'}
            </button>
          </>
        ) : null}
      </div>

      {saveError ? (
        <p className="json-diagram-page__save-err" role="alert">
          {saveError}
        </p>
      ) : null}

      {isDev ? (
        <p className="json-diagram-page__hint json-diagram-page__hint--dev">
          Dev server: Save writes to{' '}
          <code>public/diagram-sources/&lt;team&gt;/</code> and updates{' '}
          <code>src/data/diagram-sources/catalog.json</code>.
        </p>
      ) : (
        <p className="json-diagram-page__hint">
          Production build: use Export, then add the file under{' '}
          <code>public/diagram-sources</code> and register it in{' '}
          <code>catalog.json</code> to list it for your team.
        </p>
      )}
    </>
  )
}
