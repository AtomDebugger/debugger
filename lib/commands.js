/* @flow */

import { CompositeDisposable } from 'atom'

export default class Commands {
  subscriptions: CompositeDisposable;

  constructor() {
    this.subscriptions = new CompositeDisposable()
  }
  activate() {
    console.log('listen for commands here')
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
