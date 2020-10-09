import * as React from 'react'
import {ICookieConfig, getChromeMock, defaultCookieConfig} from './mocks'
import {
  findByTestId,
  fireEvent,
  render as rtlRender,
  screen,
} from '@testing-library/react'
import App from '../App'
import {wait} from './utils'
import {TEST_ID} from '../commons/test-ids'

export interface IRenderOptions {
  cookieConfig?: ICookieConfig
}

export const SWITCH = {
  RESET: TEST_ID.LIST_ITEM_SWITCH_RESET,
  CHANGE: TEST_ID.LIST_ITEM_SWITCH_CHANGE,
  ENABLE: TEST_ID.LIST_ITEM_SWITCH_ENABLE,
  DISABLE: TEST_ID.LIST_ITEM_SWITCH_DISABLE,
}

export const render = async ({cookieConfig}: IRenderOptions = {}) => {
  const g = global as any
  g.chrome = getChromeMock({cookieConfig})

  g.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
  })

  rtlRender(<App />)
  await wait(200) // Loading data and re-rendering

  return {
    async countListItems() {
      return (await screen.findAllByTestId(TEST_ID.LIST_ITEM)).length
    },
    async getListItemTitle(index: number) {
      return (
        await findByTestId(
          (await screen.findAllByTestId(TEST_ID.LIST_ITEM))[index],
          TEST_ID.LIST_ITEM_TITLE,
        )
      ).textContent
    },
    async getListItemSwitchTitle(index: number) {
      return (
        await findByTestId(
          (await screen.findAllByTestId(TEST_ID.LIST_ITEM))[index],
          TEST_ID.LIST_ITEM_SWITCH,
        )
      ).textContent
    },
    async expandListItem(index: number) {
      const listItemTitle = await findByTestId(
        (await screen.findAllByTestId(TEST_ID.LIST_ITEM))[index],
        TEST_ID.LIST_ITEM_TITLE,
      )

      fireEvent.click(listItemTitle)
      await wait(300) // Animation
    },
    async isListItemExpanded(index: number) {
      const listItem = (await screen.findAllByTestId(TEST_ID.LIST_ITEM))[index]
      const expanded = listItem.querySelector('.show')
      return Boolean(expanded)
    },
    getExperimentConfig(sort = false) {
      const config = cookieConfig || defaultCookieConfig

      const experimentEntries = Object.entries(
        config,
      ).flatMap(([, domainConfig]) => Object.entries(domainConfig))

      if (sort) {
        experimentEntries.sort(([a], [b]) => (a < b ? -1 : 1))
      }

      return Object.fromEntries(experimentEntries)
    },
    getExperimentCookieValue(experiments: {[name: string]: string}) {
      return Object.entries(experiments)
        .map(([name, value]) => `${name}#${value}`)
        .join('|')
    },
    async clickSwitch(index: number, option: string) {
      let switchWrapper = await findByTestId(
        (await screen.findAllByTestId(TEST_ID.LIST_ITEM))[index],
        TEST_ID.LIST_ITEM_SWITCH,
      )

      fireEvent.click(switchWrapper.querySelector('button') as Element)
      await wait()

      const optionWrapper = await findByTestId(switchWrapper, option)
      fireEvent.click(optionWrapper.querySelector('a') as Element)
      await wait()
    },
  }
}
