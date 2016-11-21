'use babel'

/* @flow */

import { File } from 'atom'
import CSON from 'season'

export default class ProjectConfig {
  data: ?Object;

  constructor() {
    this.data = null
  }

  tryLoad(): void {
    const cfg = this.findConfigFile()

    if (!cfg) {
      return
    }

    try {
      this.data = CSON.readFileSync(cfg.getPath())
    } catch (parseError) {
      this.data = null
      atom.notifications.addError(`The file ${cfg.getPath()} could not be parsed`)
      return
    }
  }

  findConfigFile(): ?File {
    const activeEditor = atom.workspace.getActiveTextEditor()

    if (!activeEditor) {
      return null
    }

    const activeFile = new File(activeEditor.getPath())
    const activeDirectories = atom.project.getDirectories().filter(directory =>
                                directory.contains(activeFile.getPath()))

    let path = activeFile
    const matcher = (directory => directory.getPath() === path.getPath())
    do {
      path = path.getParent()

      if (activeDirectories.find(matcher)) {
        const configFile = path.getFile('.debugger.cson')

        if (configFile.existsSync()) {
          return configFile
        }
      }
    } while (!path.isRoot())

    return null
  }
}
