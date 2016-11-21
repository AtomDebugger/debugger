'use babel'

/* @flow */

import { CompositeDisposable } from 'atom'
import DebuggerController from './debugger-controller'
import type { DebuggerView } from './types'

export default class ViewRegistry {
  controller: DebuggerController;
  providers: Set<DebuggerView>;
  subscriptions: CompositeDisposable;

  constructor(controller: DebuggerController) {
    this.controller = controller
    this.providers = new Set()
    this.subscriptions = new CompositeDisposable()
  }

  add(view: DebuggerView) {
    if (this.providers.has(view)) {
      return
    }

    this.providers.add(view)
    this.subscriptions.add(view)
    view.activate(this.controller)
  }

  delete(view: DebuggerView): boolean {
    if (!this.providers.has(view)) {
      return false
    }

    view.dispose()
    this.providers.delete(view)
    return true
  }
}
