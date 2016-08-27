/* @flow */

import { Emitter, CompositeDisposable } from 'atom'
import type { Debugger } from './types'

export default class DebuggerDelegate {
  emitter: Emitter;
  provider: Debugger;
  subscriptions: CompositeDisposable;

  constructor(provider: Debugger) {
    this.provider = provider
    this.emitter = new Emitter()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
  }
  get(): Debugger {
    return this.provider
  }
  // Real stuff -- starts
  start() {
    console.log('start debugger')
  }
  stop() {
    console.log('stop debugger')
  }
  // Real stuff -- ends
  onDidDestroy(callback: (() => any)) {
    return this.emitter.on('did-destroy', callback)
  }
  dispose() {
    if (this.subscriptions.isDisposed()) {
      return
    }
    this.emitter.emit('did-destroy')
    this.subscriptions.dispose()
  }
}
