'use babel'

/* @flow */

import Breakpoint from './breakpoint'

export type BreakpointEventType = 'inserted' | 'removed' | 'enabled' |
                                  'disabled' | 'moved' |
                                  'condition-added' | 'condition-removed'

export default class BreakpointEvent {
  type: BreakpointEventType;
  breakpoint: Breakpoint;
  bufferRow: ?number;

  constructor(type: BreakpointEventType,
              breakpoint: Breakpoint,
              bufferRow?: number) {
    this.type = type
    this.breakpoint = breakpoint

    if (type === 'moved') {
      if (bufferRow == null || typeof bufferRow !== 'number') {
        throw new Error('bufferRow must be a number')
      }

      this.bufferRow = bufferRow
    }
  }
}
