/* @flow */

import type { UI } from './types'
import type Delegate from './delegate'

export default class UIRegistry {
  interfaces: Set<UI>;

  constructor() {
    this.interfaces = new Set()
  }
  add(ui: UI): void {
    if (!this.interfaces.has(ui)) {
      this.interfaces.add(ui)
      ui.activate()
    }
  }
  delete(ui: UI): void {
    if (this.interfaces.has(ui)) {
      this.interfaces.delete(ui)
      ui.dispose()
    }
  }
  didStart(delegate: Delegate): void {
    for (const entry of this.interfaces) {
      entry.didStart(delegate)
    }
  }
  didStop(delegate: Delegate): void {
    for (const entry of this.interfaces) {
      entry.didStop(delegate)
    }
  }
  dispose() {
    for (const entry of this.interfaces) {
      entry.dispose()
    }
  }
}
