/* @flow */

export default {
  activate() {
    require('atom-package-deps').install('debugger') // eslint-disable-line global-require
  },
  deactivate() {
    console.log('deactivate')
  },
  consumeSignal(signalRegistry: Object) {
    console.log('consumeSignal', signalRegistry)
  },
}
