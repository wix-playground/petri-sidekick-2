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
})
