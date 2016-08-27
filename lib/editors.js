/* @flow */

import { CompositeDisposable, Emitter } from 'atom'
import type { Disposable, TextEditor } from 'atom'

import Editor from './editor'

export default class Editors {
  emitter: Emitter;
  editors: Map<TextEditor, Editor>;
  subscriptions: CompositeDisposable;

  constructor() {
    this.emitter = new Emitter()
    this.editors = new Map()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
  }
  activate() {
    this.subscriptions.add(atom.workspace.observeTextEditors(textEditor => {
      const editor = new Editor(textEditor)
      this.editors.set(textEditor, editor)
      this.emitter.emit('observe', editor)
      editor.onDidDestroy(() => {
        this.editors.delete(textEditor)
      })
    }))
  }
  get(textEditor: TextEditor): ?Editor {
    return this.editors.get(textEditor)
  }
  observe(callback: ((editor: Editor) => any)): Disposable {
    this.editors.forEach(callback)
    return this.emitter.on('observe', callback)
  }
  dispose() {
    for (const editor of this.editors.values()) {
      editor.dispose()
    }
    this.subscriptions.dispose()
  }
}
