'use babel'

import { Emitter } from 'atom'

export default class DebbugerStub {

  constructor() {
    this.emitter = new Emitter
  }

  /* Interface */
  name() {
    return 'DebuggerStub'
  }

  start(target, breakpoints) {

  }

  onSessionEvent(callback) {
    return this.emitter.on('session', callback)
  }

  onBreakpointEvent(callback) {
    return this.emitter.on('breakpoint', callback)
  }

  /* For tests */
  emitSessionEvent(notification) {
    this.emitter.emit('session', notification)
  }

  emitBreakpointEvent(notification) {
    this.emitter.emit('breakpoint', notification)
  }
}
