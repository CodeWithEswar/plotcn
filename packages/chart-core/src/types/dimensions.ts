export interface ChartMargins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ChartDimensions {
  width: number
  height: number
}

export interface InnerChartDimensions extends ChartDimensions {
  innerWidth: number
  innerHeight: number
  margins: ChartMargins
}

export interface Bounds {
  x: number
  y: number
  width: number
  height: number
}
