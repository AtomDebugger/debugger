/* @flow */

import { CompositeDisposable } from 'atom'
import type DebuggerDelegate from './debugger-delegate'

export default class Commands {
  active: ?DebuggerDelegate;
  subscriptions: CompositeDisposable;

  constructor() {
    this.active = null
    this.subscriptions = new CompositeDisposable()
  }
  activate() {
    this.subscriptions.add(atom.commands.add('atom-text-editor:no([mini])', {
      'debugger:start': () => this.start(),
      'debugger:stop': () => this.stop(),
      'debugger:resume': 'resume',
      'debugger:pause': 'pause',
      'debugger:step-into': 'stepInto',
      'debugger:step-over': 'stepOver',
      'debugger:toggle-breakpoint-at-current-line': 'toggleBreakpointAtCurrentLine',
    }))
  }
  async start() {
    if (this.active !== null) {
      return
    }
  }
  stop() {
    const active = this.active
    if (active === null) {
      return
    }
  }
  dispose() {
    if (this.active) {
      this.stop()
    }
    this.subscriptions.dispose()
  }
}
