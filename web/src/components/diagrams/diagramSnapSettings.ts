import {
  SnapConstraints,
  type SnapSettingsModel,
} from '@syncfusion/ej2-react-diagrams'

/** Light, non-distracting diagram background grid (requires `Snapping` in Inject). */
export const FAINT_GRID_SNAP: SnapSettingsModel = {
  constraints: SnapConstraints.ShowLines,
  horizontalGridlines: {
    lineColor: 'rgba(100, 116, 139, 0.07)',
    lineDashArray: '1 6',
  },
  verticalGridlines: {
    lineColor: 'rgba(100, 116, 139, 0.07)',
    lineDashArray: '1 6',
  },
}
