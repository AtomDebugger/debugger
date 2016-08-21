'use babel'

/* @flow */

export type StackFrame = {
  level: number,
  address: string,
  function: string,
  filePath?: string,
  bufferRow?: number
}
