'use babel'

/* @flow */

import { Disposable } from 'atom'
import BreakpointEvent from './breakpoint-event'
import DebuggerController from './debugger-controller'
import SessionEvent from './session-event'
import TargetEvent from './target-event'
import VariableEvent from './variable-event'
import type { Debugger, DebuggerView } from './types'

module.exports = {
  instance: DebuggerController,

  activate(): void {
    this.instance = new DebuggerController()
  },

  provideEventDefs(): Object {
    return {
      BreakpointEvent,
      SessionEvent,
      TargetEvent,
      VariableEvent,
    }
  },

  consumeView(view: DebuggerView): Disposable {
    this.instance.addView(view)

    return new Disposable(() => {
      this.instance.deleteView(view)
    })
  },

  consumeDebugger(debug: Debugger): Disposable {
    this.instance.addDebugger(debug)

    return new Disposable(() => {
      this.instance.deleteDebugger(debug)
    })
  },
}
