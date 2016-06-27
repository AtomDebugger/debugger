'use babel'

/* @flow */

import DebuggerController from './debugger-controller'
import type { Debugger, DebuggerView } from './types'
import { Disposable } from 'atom'

module.exports = {
  instance: DebuggerController,

  activate(): void {
    this.instance = new DebuggerController()
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
  }
}
