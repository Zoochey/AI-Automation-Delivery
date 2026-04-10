import type { ConnectorModel } from '@syncfusion/ej2-react-diagrams'
import { DiagramTools } from '@syncfusion/ej2-react-diagrams'

/** Selection + drag-pan on empty canvas (left-drag moves the viewport). */
export const DIAGRAM_TOOL_SELECT_AND_PAN =
  DiagramTools.Default | DiagramTools.ZoomPan

const CONNECTOR_STROKE = '#ffffff'

/**
 * White connectors and arrowheads for visibility on coloured nodes / dark fills.
 */
export function applyWhiteConnectorStyle(connector: ConnectorModel): void {
  connector.style = {
    ...connector.style,
    strokeColor: CONNECTOR_STROKE,
    strokeWidth: 2,
  }
  const prev = connector.targetDecorator
  connector.targetDecorator = {
    ...prev,
    style: {
      ...prev?.style,
      fill: CONNECTOR_STROKE,
      strokeColor: CONNECTOR_STROKE,
    },
  }
}
