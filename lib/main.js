/* @flow */

import { CompositeDisposable } from 'atom'

import Editors from './editors'
import Commands from './commands'
import DelegateRegistry from './delegate-registry'

export default class AtomDebugger {
  editors: Editors;
  commands: Commands;
  delegateRegistry: DelegateRegistry;
  subscriptions: CompositeDisposable;

  constructor() {
    this.editors = new Editors()
    this.commands = new Commands()
    this.delegateRegistry = new DelegateRegistry()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.editors)
    this.subscriptions.add(this.commands)
    this.subscriptions.add(this.delegateRegistry)

    this.commands.onShouldProvideDelegate(() => {
      // TODO: Have a good way to choose between the delegate
      for (const delegate of this.delegateRegistry.delegates) {
        return delegate
      }
      return null
    })
  }
  activate() {
    this.editors.activate()
    this.commands.activate()
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
