/* @flow */

import { CompositeDisposable, Disposable } from 'atom'
import type { TextEditor } from 'atom'

export default class Editor {
  textEditor: TextEditor;
  subscriptions: CompositeDisposable;

  constructor(textEditor: TextEditor) {
    this.textEditor = textEditor
    this.subscriptions = new CompositeDisposable()
  }
  onDidDestroy(callback: (() => any)): Disposable {
    const subscription = this.textEditor.onDidDestroy(callback)
    const disposable = new Disposable(() => {
      subscription.dispose()
      this.subscriptions.remove(disposable)
    })
    this.subscriptions.add(disposable)
    return disposable
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
