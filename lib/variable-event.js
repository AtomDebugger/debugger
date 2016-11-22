'use babel'

/* @flow */

import type { Variable } from './variable'

export type VariableEventType = 'updated' | 'left-scope' | 'entered-scope'

export default class VariableEvent {
  type: VariableEventType;
  variable: Variable;

  constructor(type: VariableEventType, variable: Variable) {
    this.type = type
    this.variable = variable
  }
}
