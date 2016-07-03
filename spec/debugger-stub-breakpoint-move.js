'use babel'

import DebuggerStub    from './debugger-stub'
import Breakpoint      from '../lib/breakpoint'
import BreakpointEvent from '../lib/breakpoint-event'
import SessionEvent    from '../lib/session-event'

export default class DebuggerStubBreakpointMove extends DebuggerStub {

  start(target: DebuggerTarget, breakpoints: Array<Breakpoint>) {
    this.emitSessionEvent(new SessionEvent('launched'))

    let event = new BreakpointEvent(
                  'moved', breakpoints[0], breakpoints[0].location.bufferRow + 1)

    this.emitBreakpointEvent(event)
  }
}
