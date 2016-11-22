import { File } from 'sig/1.7.4/File'
import { CompositeDisposable, Disposable, Emitter } from 'event-kit'

declare module atom {

  declare var exports: {
    File: File,
    CompositeDisposable: CompositeDisposable,
    Disposable: Disposable,
    Emitter: Emitter
  };
}
