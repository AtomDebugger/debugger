'use babel'

/* @flow */

import Breakpoint            from './breakpoint'
import DebuggerRegistry      from './debugger-registry'
import ProjectConfig         from './project-config'
import ViewRegistry          from './view-registry'

import type { Debugger, DebuggerView } from './types'

export default class DebuggerController {
  debuggerRegistry: DebuggerRegistry;
  viewRegistry:     ViewRegistry;

  constructor() {
    this.debuggerRegistry = new DebuggerRegistry()
    this.viewRegistry     = new ViewRegistry(this)

    atom.commands.add('atom-text-editor', {
      'debugger:start': () => { this.start() },
      'debugger:stop': () => { this.stop() },
      'debugger:resume': () => { this.resume() },
      'debugger:pause': () => { this.pause() },
      'debugger:step-into': () => { this.stepInto() },
      'debugger:step-over': () => { this.stepOver() },
      'debugger:toggle-breakpoint-at-current-line': () => { this.toggleBreakpoint() }
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

  /* Commands */
  start(): void {
    let proxy  = this.debuggerRegistry.getDebuggerProxy()
    let config

    if (proxy.getActiveDebugger() != null) {

      atom.notifications.addError(
        'There is a session in progress. Please, exit first.')

      return
    }

    config = new ProjectConfig()
    config.tryLoad()

    if (!config.data) {

      atom.notifications.addError('The project has no config.')

      return
    }

    if (!config.data.target) {

      atom.notifications.addError('The project has no target set.')

      return
    }

    if (!config.data.debugger) {

      atom.notifications.addError('The project has no debugger set.')

      return
    }

    const target = config.data.target
    const debug  = this.debuggerRegistry.get(config.data.debugger)

    if (!debug) {

      atom.notifications.addFatalError('The debugger is unknown.')

      return
    }

    proxy.startSession(target, debug, config.data)
  }

  stop(): void {
    this.debuggerRegistry.getDebuggerProxy().stop()
  }

  resume(): void {
    this.debuggerRegistry.getDebuggerProxy().resume()
  }

  pause(): void {
    this.debuggerRegistry.getDebuggerProxy().pause()
  }

  stepInto(): void {
    this.debuggerRegistry.getDebuggerProxy().stepInto()
  }

  stepOver(): void {
    this.debuggerRegistry.getDebuggerProxy().stepOver()
  }

  toggleBreakpoint(): void {
    const activeEditor = atom.workspace.getActiveTextEditor()

    if (!activeEditor || activeEditor.hasMultipleCursors()) {
      return
    }

    let breakpoint = new Breakpoint({
      filePath:  activeEditor.getPath(),
      bufferRow: activeEditor.getCursorBufferPosition().row
    })

    const debug = this.debuggerRegistry.getDebuggerProxy()

    if (debug.removeBreakpoint(breakpoint) == false) {
      debug.insertBreakpoint(breakpoint)
    }
  }
}
