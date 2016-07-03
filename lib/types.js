'use babel'

/* @flow */

import DebuggerController from './debugger-controller'
import Breakpoint         from './breakpoint'

export type DebuggerTarget = {
  filePath: string,
  arguments: ?string
}

export type DebuggerView = {

  activate(controller: DebuggerController): void,

  dispose(): void
}

export type Debugger = {

  name(): string,

  onSessionEvent(callback: Function): void,

  onBreakpointEvent(callback: Function): void,

  start(target: DebuggerTarget): void,

  stop(): void,

  resume(): void,

  pause(): void,

  stepInto(): void,

  stepOver(): void,

  insertBreakpoint(breakpoint: Breakpoint): void
}
