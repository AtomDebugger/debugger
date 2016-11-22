'use babel'

/* @flow */

import type { Disposable } from 'atom'

import DebuggerController from './debugger-controller'
import Breakpoint from './breakpoint'

import type { StackFrame } from './stack-frame'
import type { Variable } from './variable'

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

  onSessionEvent(callback: Function): Disposable,

  onBreakpointEvent(callback: Function): Disposable,

  onTargetEvent(callback: Function): Disposable,

  start(target: DebuggerTarget): void,

  stop(): void,

  resume(): void,

  pause(): void,

  stepInto(): void,

  stepOver(): void,

  insertBreakpoint(breakpoint: Breakpoint): void,

  getCallStack(): Promise<Array<StackFrame>>,

  getSelectedFrame(): Promise<StackFrame>,

  setSelectedFrame(level: number): void,

  getVariableList(): Promise<Array<Variable>>
}
