/* @flow */

export default {
  activate() {
    console.log('activate')
  },
  deactivate() {
    console.log('deactivate')
  },
  consumeSignal(signalRegistry: Object) {
    console.log('consumeSignal', signalRegistry)
  },
}
