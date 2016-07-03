'use babel'

import DebuggerStub               from './debugger-stub'
import DebuggerStubBreakpointMove from './debugger-stub-breakpoint-move'

import Breakpoint                 from '../lib/breakpoint'
import DebuggerProxy              from '../lib/debugger-proxy'
import SessionEvent               from '../lib/session-event'

import { join }                   from 'path'

describe( 'The DebuggerProxy', () => {
  let mockTarget = { filePath: join(__dirname, 'fixtures', 'mock-target') }
  let proxy = null

  beforeEach( () => {
    proxy = new DebuggerProxy()
  })

  afterEach( () => {
    proxy = null
  })

  it( 'recognizes when you add a breakpoint twice', () => {
    breakpoint = new Breakpoint({
      filePath: join(__dirname, 'fixtures', 'test.txt'),
      bufferRow: 1
    })

    expect(proxy.insertBreakpoint(breakpoint)).toBe(true)
    expect(proxy.insertBreakpoint(breakpoint)).toBe(false)
  })

  it( 'recognizes when you try to remove a non-existent breakpoint', () => {
    breakpoint = new Breakpoint({
      filePath: join(__dirname, 'fixtures', 'test.txt'),
      bufferRow: 1
    })

    expect(proxy.removeBreakpoint(breakpoint)).toBe(false)

    proxy.insertBreakpoint(breakpoint)
    expect(proxy.removeBreakpoint(breakpoint)).toBe(true)
  })

  it( 'knows the active debugger when a session is running', () => {
    let stub   = new DebuggerStub

    proxy.startSession(mockTarget, stub)
    expect(proxy.getActiveDebugger()).toBe(stub)

    stub.emitSessionEvent(new SessionEvent('terminated', 'normally'))
    expect(proxy.getActiveDebugger()).toBe(null)
  })

  describe( 'Breakpoint Events', () => {
    breakpoint   = null
    spy          = null
    subscription = null

    beforeEach( () => {
      breakpoint = new Breakpoint({
        filePath: join(__dirname, 'fixtures', 'test.txt'),
        bufferRow: 1
      })

      spy          = jasmine.createSpy('spy')
      subscription = proxy.onBreakpointEvent(spy)
    })

    afterEach( () => {
      subscription.dispose()

      breakpoint   = null
      spy          = null
      subscription = null
    })

    it( 'notifies when breakpoints are inserted', () => {
      proxy.insertBreakpoint(breakpoint)

      expect(spy.calls.length).toBe(1)
      expect(spy.mostRecentCall.args[0].type).toBe('inserted')
      expect(spy.mostRecentCall.args[0].breakpoint).toBe(breakpoint)
    })

    it( 'notifies when breakpoints are removed', () => {
      proxy.insertBreakpoint(breakpoint)

      expect(spy.calls.length).toBe(1)
      proxy.removeBreakpoint(breakpoint)

      expect(spy.calls.length).toBe(2)
      expect(spy.mostRecentCall.args[0].type).toBe('removed')
      expect(spy.mostRecentCall.args[0].breakpoint).toBe(breakpoint)
    })

    it( 'notifies when breakpoints are disabled', () => {
      proxy.insertBreakpoint(breakpoint)

      expect(spy.calls.length).toBe(1)
      proxy.disableBreakpoint(breakpoint)

      expect(spy.calls.length).toBe(2)
      expect(spy.mostRecentCall.args[0].type).toBe('disabled')
      expect(spy.mostRecentCall.args[0].breakpoint).toBe(breakpoint)
      expect(spy.mostRecentCall.args[0].breakpoint.isEnabled()).toBe(false)
    })

    it( 'notifies when breakpoints are enabled', () => {
      proxy.insertBreakpoint(breakpoint)
      proxy.disableBreakpoint(breakpoint)

      expect(spy.calls.length).toBe(2)
      proxy.enableBreakpoint(breakpoint)

      expect(spy.calls.length).toBe(3)
      expect(spy.mostRecentCall.args[0].type).toBe('enabled')
      expect(spy.mostRecentCall.args[0].breakpoint).toBe(breakpoint)
      expect(spy.mostRecentCall.args[0].breakpoint.isEnabled()).toBe(true)
    })

    it( 'notifies when breakpoints are moved', () => {
      let stub = new DebuggerStubBreakpointMove
      proxy.insertBreakpoint(breakpoint)

      expect(spy.calls.length).toBe(1)
      proxy.startSession(mockTarget, stub)

      expect(spy.calls.length).toBe(2)
      expect(spy.mostRecentCall.args[0].type).toBe('moved')
      expect(spy.mostRecentCall.args[0].breakpoint).toBe(breakpoint)
      expect(spy.mostRecentCall.args[0].breakpoint.activeBufferRow)
        .toBe(spy.mostRecentCall.args[0].breakpoint.location.bufferRow+1)
    })

    it( 'notifies when a condition is added a breakpoint', () => {
      proxy.insertBreakpoint(breakpoint)

      expect(spy.calls.length).toBe(1)
      proxy.setBreakpointCondition(breakpoint, 'a == b')

      expect(spy.calls.length).toBe(2)
      expect(spy.mostRecentCall.args[0].type).toBe('condition-added')
      expect(spy.mostRecentCall.args[0].breakpoint).toBe(breakpoint)
    })

    it( 'notifies when a breakpoint condition is cleared', () => {
      proxy.insertBreakpoint(breakpoint)

      expect(spy.calls.length).toBe(1)
      proxy.clearBreakpointCondition(breakpoint)

      expect(spy.calls.length).toBe(1)

      proxy.setBreakpointCondition(breakpoint, 'a == b')

      expect(spy.calls.length).toBe(2)

      proxy.clearBreakpointCondition(breakpoint)
      expect(spy.calls.length).toBe(3)
      expect(spy.mostRecentCall.args[0].type).toBe('condition-removed')
      expect(spy.mostRecentCall.args[0].breakpoint).toBe(breakpoint)
    })
  })

  describe( 'Session Events', () => {
    stub         = null
    spy          = null
    subscription = null

    beforeEach( () => {
      stub         = new DebuggerStub
      spy          = jasmine.createSpy('spy')
      subscription = proxy.onSessionEvent(spy)
    })

    afterEach( () => {
      subscription.dispose()

      stub         = null
      spy          = null
      subscription = null
    })

    it( 'notifies when a session is launched', () => {
      let event = new SessionEvent('launched')

      proxy.startSession(mockTarget, stub)

      expect(spy.calls.length).toBe(0)

      stub.emitSessionEvent(event)

      expect(spy.calls.length).toBe(1)
      expect(spy.mostRecentCall.args[0]).toBe(event)
    })

    it( 'notifies when a session is terminated', () => {
      let event = new SessionEvent('terminated', 'normally')

      proxy.startSession(mockTarget, stub)

      expect(spy.calls.length).toBe(0)

      stub.emitSessionEvent(new SessionEvent('launched'))

      expect(spy.calls.length).toBe(1)

      stub.emitSessionEvent(event)
      expect(spy.calls.length).toBe(2)
      expect(spy.mostRecentCall.args[0]).toBe(event)
    })

    it( 'notifies when a session is suspended', () => {
      let event = new SessionEvent( 'suspended', 'breakpoint',
        { filePath: mockTarget.filePath, bufferRow: 1 })

      proxy.startSession(mockTarget, stub)

      expect(spy.calls.length).toBe(0)

      stub.emitSessionEvent(new SessionEvent('launched'))

      expect(spy.calls.length).toBe(1)

      stub.emitSessionEvent(event)
      expect(spy.calls.length).toBe(2)
      expect(spy.mostRecentCall.args[0]).toBe(event)
    })

    it( 'notifies when a session is resumed', () => {
      let event = new SessionEvent('resumed')

      proxy.startSession(mockTarget, stub)

      expect(spy.calls.length).toBe(0)

      stub.emitSessionEvent(new SessionEvent('launched'))

      expect(spy.calls.length).toBe(1)

      stub.emitSessionEvent(new SessionEvent( 'suspended', 'breakpoint',
        { filePath: mockTarget.filePath, bufferRow: 1 }))
      expect(spy.calls.length).toBe(2)

      stub.emitSessionEvent(event)
      expect(spy.calls.length).toBe(3)
      expect(spy.mostRecentCall.args[0]).toBe(event)
    })
  })
})
