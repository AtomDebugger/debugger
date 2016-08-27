/* @flow */

import type Delegate from './delegate'

export type Debugger = {
  name: string,
  grammarScopes: Array<string>,
  start(): void,
  stop(): void,
}

export type UI = {
  activate(): void,
  didStart(delegate: Delegate): void,
  didStop(delegate: Delegate): void,
  dispose(): void,
}
