'use babel'

/* @flow */

import DebuggerController from './debugger-controller'

export type BreakPoint = {
  type: string,
  condition?: string,
  bufferRow?: number,
  filePath?: string
}

export type DebuggerTarget = {
  filePath: string,
  arguments: ?string
}

export type Notification = string | Object

export type DebuggerView = {

  activate(controller: DebuggerController): void,

  dispose(): void
}

export type Debugger = {

  name(): string,

  onIsRunning(callback: Function): void,

  onStoppedExecution(callback: Function): void,

  onDidEndSession(callback: Function): void,

  onTriggeredBreakpoint(callback: Function): void,

  startLocally(target: DebuggerTarget): void,

  stop(): void,

  resume(): void,

  pause(): void,

  stepInto(): void,

  stepOver(): void
}
