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

export const BADGE = {
  ACTIVE: TEST_ID.BADGE_ACTIVE,
  ENDED: TEST_ID.BADGE_ENDED,
  FUTURE: TEST_ID.BADGE_FUTURE,
  PAUSED: TEST_ID.BADGE_PAUSED,
  OVERRIDDEN: TEST_ID.BADGE_OVERRIDDEN,
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
    async clickDelete(index: number) {
      const listItem = (await screen.findAllByTestId(TEST_ID.LIST_ITEM))[index]
      const deleteWrapper = await findByTestId(listItem, TEST_ID.DELETE)
      fireEvent.click(deleteWrapper.querySelector('button') as Element)
      await wait()
    },
    async getOverrideInputValue() {
      const inputWrapper = await screen.findByTestId(TEST_ID.OVERRIDE_INPUT)
      const input = inputWrapper.querySelector('input')
      return input?.value
    },
    async enterOverrideValue(value: string) {
      const inputWrapper = await screen.findByTestId(TEST_ID.OVERRIDE_INPUT)
      const input = inputWrapper.querySelector('input') as any
      fireEvent.change(input, {target: {value}})
      fireEvent.blur(input)
      await wait()
    },
    async isBadgeVisible(index: number, badge: string) {
      const listItem = (await screen.findAllByTestId(TEST_ID.LIST_ITEM))[index]
      return Boolean(await findByTestId(listItem, badge))
    },
    async getAuthors(index: number) {
      const listItem = (await screen.findAllByTestId(TEST_ID.LIST_ITEM))[index]
      return (await findByTestId(listItem, TEST_ID.AUTHORS)).textContent
    },
    async getFullTitle(index: number) {
      const listItem = (await screen.findAllByTestId(TEST_ID.LIST_ITEM))[index]
      return (await findByTestId(listItem, TEST_ID.FULL_TITLE)).textContent
    },
    async openSearch() {
      const tab = await screen.findByTestId(TEST_ID.TAB_SEARCH)
      fireEvent.click(tab)
      await wait(1000)
    },
    async enterSearchQuery(value: string) {
      const inputWrapper = await screen.findByTestId(TEST_ID.SEARCH_INPUT)
      const input = inputWrapper.querySelector('input') as any
      fireEvent.change(input, {target: {value}})
      fireEvent.blur(input)
      await wait()
    },
    async isSearchResultVisible() {
      let searchResult

      try {
        searchResult = await screen.findByTestId(TEST_ID.SEARCH_RESULT)
      } catch (e) {
        return false
      }
      const fullTitle = searchResult.querySelector(
        `[data-testid="${TEST_ID.FULL_TITLE}"]`,
      )
      return Boolean(fullTitle)
    },
    async clickUpdate() {
      const noInfoWrapper = await screen.findByTestId(TEST_ID.NO_INFO)
      fireEvent.click(noInfoWrapper.querySelector('button') as any)
      await wait()
    },
  }
}
