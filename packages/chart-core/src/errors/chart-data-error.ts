/**
 * Represents a fatal data error within visualization logic
 * (e.g. invalid domain bounds, unsupported coordinate conversion).
 */
export class ChartDataError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = "ChartDataError"
    this.code = code
    Object.setPrototypeOf(this, ChartDataError.prototype)
  }
}
