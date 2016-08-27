/* @flow */

import { CompositeDisposable } from 'atom'

import Editors from './editors'
import Commands from './commands'
import DebuggerRegistry from './debugger-registry'

export default class AtomDebugger {
  editors: Editors;
  commands: Commands;
  debuggerRegistry: DebuggerRegistry;
  subscriptions: CompositeDisposable;

  constructor() {
    this.editors = new Editors()
    this.commands = new Commands()
    this.debuggerRegistry = new DebuggerRegistry()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.editors)
    this.subscriptions.add(this.commands)
    this.subscriptions.add(this.debuggerRegistry)
  }
  activate() {
    this.editors.activate()
    this.commands.activate()
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
