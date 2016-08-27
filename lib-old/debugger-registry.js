'use babel'

/* @flow */

import Breakpoint                                   from './breakpoint'
import DebuggerProxy                                from './debugger-proxy'
import type { Debugger }                            from './types'
import { CompositeDisposable, Disposable, Emitter } from 'atom'

export default class DebuggerRegistry {
  proxy:         DebuggerProxy;
  subscriptions: CompositeDisposable;
  emitter:       Emitter;
  debuggers:     Set<Debugger>;

  constructor() {

    this.proxy         = new DebuggerProxy()
    this.subscriptions = new CompositeDisposable()
    this.emitter       = new Emitter()
    this.debuggers     = new Set()
  }

  dispose(): void {
    this.subscriptions.dispose()
  }

  add(debug: Debugger): void {

    this.debuggers.add(debug)
  }

  has(name: string): boolean {

    if (!name) {
      return false
    }

    for (let debug of this.debuggers.values()) {

      if (debug.name() == name) {
        return true
      }
    }

    return false
  }

  get(name: string): Debugger {

    for (let debug of this.debuggers.values()) {
      if (debug.name() == name) {
        return debug
      }
    }

    throw new RangeError('Debugger not found')
  }

  getDebuggerProxy(): DebuggerProxy {
    return this.proxy
  }
}
