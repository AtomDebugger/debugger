/* @flow */

import { CompositeDisposable } from 'atom'

import DebuggerDelegate from './delegate'
import validateDebugger from './validate/debugger'
import type { Debugger } from './types'

export default class DelegateRegistry {
  delegates: Set<DebuggerDelegate>;
  subscriptions: CompositeDisposable;

  constructor() {
    this.delegates = new Set()
    this.subscriptions = new CompositeDisposable()
  }
  register(debugProvider: Debugger): DebuggerDelegate {
    if (validateDebugger(debugProvider)) {
      throw new Error('Invalid debugger provided')
    }
    const delegate = new DebuggerDelegate(debugProvider)
    this.delegates.add(delegate)
    delegate.onDidDestroy(() => {
      this.delegates.delete(delegate)
    })
    return delegate
  }
  dispose() {
    for (const delegate of this.delegates) {
      delegate.dispose()
    }
    this.subscriptions.dispose()
  }
}
