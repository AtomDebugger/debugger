/* @flow */

import { CompositeDisposable } from 'atom'

import Editors from './editors'
import Commands from './commands'

export default class AtomDebugger {
  editors: Editors;
  commands: Commands;
  subscriptions: CompositeDisposable;

  constructor() {
    this.editors = new Editors()
    this.commands = new Commands()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.editors)
    this.subscriptions.add(this.commands)
  }
  activate() {
    this.editors.activate()
    this.commands.activate()
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
