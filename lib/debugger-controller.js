'use babel'

/* @flow */

import DebuggerRegistry from './debugger-registry'
import ProjectConfig from './project-config'
import ViewRegistry from './view-registry'
import type { Debugger, DebuggerView } from './types'


export default class DebuggerController {
  debuggerRegistry: DebuggerRegistry;
  viewRegistry: ViewRegistry;
  activeConfig: ?ProjectConfig;

  constructor() {
    this.debuggerRegistry = new DebuggerRegistry()
    this.viewRegistry = new ViewRegistry(this)

    atom.commands.add('atom-text-editor',
    { 'debugger:start-locally': () => {
        if (this.activeConfig) {
          atom.notifications.addError('There is a session in progress. Please, exit first.')
          return
        }

        let activeConfig: ProjectConfig = new ProjectConfig()
        activeConfig.tryLoad()

        if (!activeConfig.data) {
          atom.notifications.addError('The project has no config.')
          return
        }

        if (!activeConfig.data.target) {
          atom.notifications.addError('The project has no target set.')
          return
        }

        if (!activeConfig.data.debugger) {
          atom.notifications.addError('The project has no debugger set.')
          return
        }

        const target = activeConfig.data.target
        const debug  = this.debuggerRegistry.get(activeConfig.data.debugger)

        if (!debug) {
          atom.notifications.addFatalError('The debugger is unknown.')
          return
        }

        this.activeConfig = activeConfig

        debug.onDidEndSession(() => {
          this.activeConfig = null
        })

        debug.startLocally(target)
      },
      'debugger:stop': () => {
        if (!this.activeConfig || !this.activeConfig.data) {
          return
        }

        const debug = this.debuggerRegistry.get(this.activeConfig.data.debugger)

        if (!debug) {
          atom.notifications.addError('The debugger is unknown')
          return
        }

        debug.stop()
      },
      'debugger:resume': () => {
        if (!this.activeConfig || !this.activeConfig.data) {
          return
        }

        const debug = this.debuggerRegistry.get(this.activeConfig.data.debugger)

        if (!debug) {
          atom.notifications.addError('The debugger is unknown')
          return
        }

        debug.resume()
      },
      'debugger:pause': () => {
        if (!this.activeConfig || !this.activeConfig.data) {
          return
        }

        const debug = this.debuggerRegistry.get(this.activeConfig.data.debugger)

        if (!debug) {
          atom.notifications.addError('The debugger is unknown')
          return
        }

        debug.pause()
      },
      'debugger:step-into': () => {
        if (!this.activeConfig || !this.activeConfig.data) {
          return
        }

        const debug = this.debuggerRegistry.get(this.activeConfig.data.debugger)

        if (!debug) {
          atom.notifications.addError('The debugger is unknown')
          return
        }

        debug.stepInto()
      },
      'debugger:step-over': () => {
        if (!this.activeConfig || !this.activeConfig.data) {
          return
        }

        const debug = this.debuggerRegistry.get(this.activeConfig.data.debugger)

        if (!debug) {
          atom.notifications.addError('The debugger is unknown')
          return
        }

        debug.stepOver()
      }
    })
  }

  addDebugger(debug: Debugger): void {
    this.debuggerRegistry.add(debug)
  }

  addView(view: DebuggerView): void {
    this.viewRegistry.add(view);
  }

  deleteView(view: DebuggerView): void {
    this.viewRegistry.delete(view)
  }

}
