import React from 'react'
import {render} from '@testing-library/react'
import App from '../App'
import {chrome} from '../../test/mocks'
import {flushPromises} from '../../test/utils'

describe('Petri Sidekick (sanity tests)', () => {
  beforeAll(() => {
    const g = global as any
    g.chrome = chrome
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('sets badge', async () => {
    render(<App />)
    await flushPromises()
    expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({text: '3'})
  })

  it('displays active experiments', () => {
    // TODO: Not finished
  })

  it('allows changing experiment override value', () => {
    // TODO: Not finished
    // TODO: check cookie as well as UI
  })

  it('allows disabling experiment override', () => {
    // TODO: Not finished
  })

  it('expands experiment information', () => {
    // TODO: Not finished
  })

  it('shows correct experiment value in input', () => {
    // TODO: Not finished
  })

  it('allows changing experiment value using input', () => {
    // TODO: Not finished
  })

  it('allows resetting experiment value using input reset button', () => {
    // TODO: Not finished
  })

  it('shows experiment status badge', () => {
    // TODO: Not finished
  })

  it('does not show experiment override badge when set to auto', () => {
    // TODO: Not finished
  })

  it('shows experiment override badge when overridden', () => {
    // TODO: Not finished
  })

  it('shows experiment authors', () => {
    // TODO: Not finished
  })

  it('shows full experiment spec name when expanded', () => {
    // TODO: Not finished
  })

  it('allows removing experiment from bookmark list', () => {
    // TODO: Not finished
    // TODO: make sure that experiment is also set to auto
  })

  it('allows finding experiment using search', () => {
    // TODO: Not finished
  })

  it('allows overriding experiment using search', () => {
    // TODO: Not finished
    // TODO: also make sure it is added to bookmarks
  })

  it('allows updating experiment cache if experiment is not found', () => {
    // TODO: Not finished
  })
})
