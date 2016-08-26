/* @flow */

import AtomDebugger from './main'

export default {
  instance: null,
  activate() {
    require('atom-package-deps').install('debugger') // eslint-disable-line
    this.instance = new AtomDebugger()
    this.instance.activate()
  },
  deactivate() {
    this.instance.dispose()
  },
}
