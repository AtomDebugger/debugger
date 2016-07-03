'use babel'

/* @flow */

export type FunctionBreakpoint = { function: string }
export type LineBreakpoint     = { filePath: string, bufferRow: number }
export type BreakpointLocation = LineBreakpoint | FunctionBreakpoint

export default class Breakpoint {
  location:        BreakpointLocation;
  enabled:         boolean;
  condition:       ?string;
  activeBufferRow: ?number;

  constructor(location: BreakpointLocation, condition?: string) {

    if (!location.function && (!location.filePath || !location.bufferRow)) {
      throw new TypeError('location must be BreakpointLocation')
    }

    this.location        = location
    this.condition       = (condition) ? condition : null
    this.enabled         = true
    this.activeBufferRow = null
  }

  getLocation(): BreakpointLocation {
    return this.location
  }

  isEnabled(): bool {
    return this.enabled
  }

  equals(other: Breakpoint): bool {

    if (this.location.function && other.location.function) {

      return (this.location.function === other.location.function)
    } else if (this.location.filePath && other.location.filePath) {
      const same_file = (this.location.filePath === other.location.filePath)

      if (same_file && this.location.bufferRow && other.location.bufferRow) {
        return (this.location.bufferRow === other.location.bufferRow)
      }
    }

    return false
  }
}
