'use babel'

/* @flow */

export type TargetEventType = 'output'

export default class TargetEvent {
  type:TargetEventType;
  message: string;

  constructor(type: TargetEventType, message: string) {
    this.type = type
    this.message = message
  }
}
