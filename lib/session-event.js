'use babel'

/* @flow */

export type SessionEventType         = 'launched' | 'will-terminate' |
                                       'terminated' | 'resumed' | 'suspended'
export type SessionTerminationReason = 'normally' | 'interrupt'
export type SessionSuspensionReason  = 'breakpoint' | 'step'

export type ExecutionLine = { filePath: string, bufferRow: number }

export default class SessionEvent {
  type:          SessionEventType;
  reason:        SessionTerminationReason | SessionSuspensionReason;
  executionLine: ExecutionLine;

  constructor(
    type:           SessionEventType,
    reason?:        SessionTerminationReason | SessionSuspensionReason,
    executionLine?: ExecutionLine) {

    this.type = type

    if (type == 'terminated' || type == 'suspended') {

      if (!reason && typeof reason !== 'string') {
        throw new Error('reason must be a string')
      }

      this.reason = reason
    }

    if (type == 'suspended') {

      if (!executionLine) {
        throw new Error('executionLine must be an ExecutionLine')
      }

      this.executionLine = executionLine
    }
  }
}
