'use babel'

/* @flow */

import { CompositeDisposable, Emitter } from 'atom'
import type { Disposable } from 'atom'
import type { Debugger, Notification } from './types'

export default class DebuggerRegistry {
  subscriptions: CompositeDisposable;
  emitter: Emitter;
  debuggers: Set<Debugger>;

  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.emitter = new Emitter()
    this.debuggers = new Set()
  }

  dispose(): void {
    this.subscriptions.dispose()
  }

  add(debug: Debugger): void {
    this.debuggers.add(debug)

    const emitter = this.emitter

    this.subscriptions.add(
      debug.onIsRunning((notification: Notification) => {
        emitter.emit('is-running', notification)
      })
    )

    this.subscriptions.add(
      debug.onStoppedExecution((notification: Notification) => {
        emitter.emit('stopped-execution', notification)
      })
    )

    this.subscriptions.add(
      debug.onDidEndSession((notification: Notification) => {
        emitter.emit('did-end-session', notification)
      })
    )

    this.subscriptions.add(
      debug.onTriggeredBreakpoint((notification: Notification) => {
        emitter.emit('triggered-breakpoint', notification)
      })
    )
  }

  has(name: string): boolean {
    for (let debug of this.debuggers.values()) {
      if (debug.name() == name) {
        return true
      }
    }

    return false
  }

  get(name: string): Debugger | null {
    for (let debug of this.debuggers.values()) {
      if (debug.name() == name) {
        return debug
      }
    }

    return null
  }

  onIsRunning(callback: Function): Disposable {
    return this.emitter.on('is-running', callback)
  }

  onStoppedExecution(callback: Function): Disposable {
    return this.emitter.on('stopped-execution', callback)
  }

  onDidEndSession(callback: Function): Disposable {
    return this.emitter.on('did-end-session', callback)
  }

  onTriggeredBreakpoint(callback: Function): Disposable {
    return this.emitter.on('triggered-breakpoint', callback)
  }
}
