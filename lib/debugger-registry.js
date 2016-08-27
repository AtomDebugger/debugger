/* @flow */

import { CompositeDisposable } from 'atom'

import DebuggerDelegate from './debugger-delegate'
import validateDebugger from './validate/debugger'
import type { Debugger } from './types'

export default class DebuggerRegistry {
  debuggers: Set<DebuggerDelegate>;
  subscriptions: CompositeDisposable;

  constructor() {
    this.debuggers = new Set()
    this.subscriptions = new CompositeDisposable()
  }
  register(debugProvider: Debugger): DebuggerDelegate {
    if (validateDebugger(debugProvider)) {
      throw new Error('Invalid debugger provided')
    }
    const delegate = new DebuggerDelegate(debugProvider)
    this.debuggers.add(delegate)
    delegate.onDidDestroy(() => {
      this.debuggers.delete(delegate)
    })
    return delegate
  }
  forEach(callback: ((delegate: DebuggerDelegate) => any)) {
    this.debuggers.forEach(callback)
  }
  dispose() {
    for (const delegate of this.debuggers) {
      delegate.dispose()
    }
    this.subscriptions.dispose()
  }
}
