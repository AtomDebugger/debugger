/* @flow */

import { CompositeDisposable, Emitter } from 'atom'
import type DebuggerDelegate from './delegate'

export default class Commands {
  active: ?DebuggerDelegate;
  emitter: Emitter;
  subscriptions: CompositeDisposable;

  constructor() {
    this.active = null
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
  }
  activate() {
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'debugger:start': () => this.start(),
      'debugger:stop': () => this.stop(),
    }))
  }
  start() {
    if (this.active) {
      return
    }
    const delegate = this.requestDelegate()
    if (!delegate) {
      return
    }
    this.active = delegate
    this.active.start()
  }
  stop() {
    if (this.active) {
      this.active.stop()
      this.emitter.emit('did-stop', this.active)
      this.active = null
    }
  }
  requestDelegate(): ?DebuggerDelegate {
    const event = { delegate: null }
    this.emitter.emit('request-delegate', event)
    return event.delegate
  }
  onShouldProvideDelegate(callback: (() => ?DebuggerDelegate)): void {
    this.emitter.on('request-delegate', function(event) {
      event.delegate = event.delegate || callback()
    })
  }
  onDidStart(callback: ((delegate: DebuggerDelegate) => any)): void {
    this.emitter.on('did-start', callback)
  }
  onDidStop(callback: ((delegate: DebuggerDelegate) => any)): void {
    this.emitter.on('did-stop', callback)
  }
  dispose() {
    if (this.active) {
      this.stop()
    }
    this.subscriptions.dispose()
  }
}
