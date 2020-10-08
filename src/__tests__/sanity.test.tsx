import React from 'react'
import {cleanup, findByTestId, render, screen} from '@testing-library/react'
import App from '../App'
import {chrome} from '../../test/mocks'
import {wait} from '../../test/utils'
import {TEST_ID} from '../commons/test-ids'

const experiments: any = {
  booleanExperiment: 'true',
  differentDomainExperiment: 'true',
  multiValueExperiment: 'new',
}

describe('Petri Sidekick (sanity tests)', () => {
  beforeAll(() => {
    const g = global as any
    g.chrome = chrome
  })

  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })

  it('sets badge', async () => {
    render(<App />)
    await wait()
    expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({text: '3'})
  })

  it('displays active experiments', async () => {
    render(<App />)
    await wait()

    const items = await screen.findAllByTestId(TEST_ID.LIST_ITEM)
    expect(items.length).toBe(3)

    let index = 0

    for (const name in experiments) {
      const value = experiments[name]

      expect(
        (await findByTestId(items[index], TEST_ID.LIST_ITEM_TITLE)).textContent,
      ).toBe(name)

      expect(
        (await findByTestId(items[index], TEST_ID.LIST_ITEM_SWITCH))
          .textContent,
      ).toBe(value)

      index++
    }
  })

  it.skip('allows changing experiment override value', () => {
    // TODO: Not finished
    // TODO: check cookie as well as UI
  })

  it.skip('allows disabling experiment override', () => {
    // TODO: Not finished
  })

  it.skip('expands experiment information', () => {
    // TODO: Not finished
  })

  it.skip('shows correct experiment value in input', () => {
    // TODO: Not finished
  })

  it.skip('allows changing experiment value using input', () => {
    // TODO: Not finished
  })

  it.skip('allows resetting experiment value using input reset button', () => {
    // TODO: Not finished
  })

  it.skip('shows experiment status badge', () => {
    // TODO: Not finished
  })

  it.skip('does not show experiment override badge when set to auto', () => {
    // TODO: Not finished
  })

  it.skip('shows experiment override badge when overridden', () => {
    // TODO: Not finished
  })

  it.skip('shows experiment authors', () => {
    // TODO: Not finished
  })

  it.skip('shows full experiment spec name when expanded', () => {
    // TODO: Not finished
  })

  it.skip('allows removing experiment from bookmark list', () => {
    // TODO: Not finished
    // TODO: make sure that experiment is also set to auto
  })

  it.skip('allows finding experiment using search', () => {
    // TODO: Not finished
  })

  it.skip('allows overriding experiment using search', () => {
    // TODO: Not finished
    // TODO: also make sure it is added to bookmarks
  })

  it.skip('allows updating experiment cache if experiment is not found', () => {
    // TODO: Not finished
  })
})
