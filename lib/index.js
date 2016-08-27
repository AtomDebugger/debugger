/* @flow */

import { Disposable } from 'atom'
import AtomDebugger from './main'
import type { UI } from './types'

export default {
  instance: null,
  activate() {
    require('atom-package-deps').install('debugger') // eslint-disable-line
    this.instance = new AtomDebugger()
    this.instance.activate()
  },
  provideDebuggerRegistry() {
    return this.instance.delegateRegistry
  },
  consumeUI(ui: UI | Array<UI>): Disposable {
    const uis = [].concat(ui)
    uis.forEach(entry => {
      this.instance.uiRegistry.add(entry)
    })
    return new Disposable(() => {
      uis.forEach(entry => {
        this.instance.uiRegistry.delete(entry)
      })
    })
  },
  deactivate() {
    this.instance.dispose()
  },
}
