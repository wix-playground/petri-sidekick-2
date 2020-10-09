import {cleanup} from '@testing-library/react'
import {render, SWITCH, BADGE} from '../test/driver'
import {
  EXPERIMENTS_COOKIE_NAME,
  EXPERIMENTS_DOMAINS,
} from '../commons/constants'

jest.mock('../hooks/login/useLogin', () => ({
  useLogin: () => ({
    authenticated: true,
    ready: true,
    inProgress: false,
    login: () => {},
  }),
}))

jest.setTimeout(10000)

const ON_LABEL = 'On'
const OFF_LABEL = 'Off'

describe('Petri Sidekick (sanity tests)', () => {
  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })

  it('sets badge', async () => {
    await render()
    expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({text: '3'})
  })

  it('displays active experiments', async () => {
    const ui = await render()

    expect(await ui.countListItems()).toBe(3)

    const experiments = ui.getExperimentConfig(true)

    let index = 0

    for (const name in experiments) {
      const value = experiments[name]

      expect(await ui.getListItemTitle(index)).toBe(name)
      expect(await ui.getListItemSwitchTitle(index)).toBe(
        value === 'true' ? ON_LABEL : value,
      )

      index++
    }
  })

  it('allows changing experiment override value', async () => {
    const TEST_INDEX = 0

    const ui = await render()
    await ui.clickSwitch(TEST_INDEX, SWITCH.DISABLE)

    const specName = await ui.getListItemTitle(TEST_INDEX)
    const experiments = ui.getExperimentConfig()
    experiments[specName as string] = 'false'

    expect(chrome.cookies.set).toHaveBeenCalledTimes(EXPERIMENTS_DOMAINS.length)

    expect(chrome.cookies.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: EXPERIMENTS_COOKIE_NAME,
        value: ui.getExperimentCookieValue(experiments),
      }),
      expect.any(Function),
    )

    expect(chrome.tabs.reload).toHaveBeenCalledWith(1)
  })

  it('allows disabling experiment override', async () => {
    const TEST_INDEX = 0

    const ui = await render()
    await ui.clickSwitch(TEST_INDEX, SWITCH.RESET)

    const specName = await ui.getListItemTitle(TEST_INDEX)
    const experiments = ui.getExperimentConfig()
    delete experiments[specName as string]

    expect(chrome.cookies.set).toHaveBeenCalledTimes(EXPERIMENTS_DOMAINS.length)

    expect(chrome.cookies.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: EXPERIMENTS_COOKIE_NAME,
        value: ui.getExperimentCookieValue(experiments),
      }),
      expect.any(Function),
    )

    expect(chrome.tabs.reload).toHaveBeenCalledWith(1)
  })

  it('expands experiment information', async () => {
    const TEST_ID = 1
    const ui = await render()
    expect(await ui.isListItemExpanded(TEST_ID)).toBeFalsy()
    await ui.expandListItem(TEST_ID)
    expect(await ui.isListItemExpanded(TEST_ID)).toBeTruthy()
  })

  it('shows correct experiment value in input', async () => {
    const ui = await render()
    await ui.expandListItem(2)
    expect(await ui.getOverrideInputValue()).toBe('new')
  })

  it('allows changing experiment value using input', async () => {
    const TEST_INDEX = 2

    const ui = await render()
    await ui.expandListItem(TEST_INDEX)
    await ui.enterOverrideValue('old')

    const specName = await ui.getListItemTitle(TEST_INDEX)
    const experiments = ui.getExperimentConfig()
    experiments[specName as string] = 'old'

    expect(chrome.cookies.set).toHaveBeenCalledTimes(EXPERIMENTS_DOMAINS.length)

    expect(chrome.cookies.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: EXPERIMENTS_COOKIE_NAME,
        value: ui.getExperimentCookieValue(experiments),
      }),
      expect.any(Function),
    )
  })

  it('allows resetting experiment value using input reset button', async () => {
    const TEST_INDEX = 2

    const ui = await render()
    await ui.expandListItem(TEST_INDEX)
    await ui.enterOverrideValue('')

    const specName = await ui.getListItemTitle(TEST_INDEX)
    const experiments = ui.getExperimentConfig()
    delete experiments[specName as string]

    expect(chrome.cookies.set).toHaveBeenCalledTimes(EXPERIMENTS_DOMAINS.length)

    expect(chrome.cookies.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: EXPERIMENTS_COOKIE_NAME,
        value: ui.getExperimentCookieValue(experiments),
      }),
      expect.any(Function),
    )
  })

  it('renders badges', async () => {
    const TEST_ID = 1
    const ui = await render()
    await ui.expandListItem(TEST_ID)
    expect(await ui.isBadgeVisible(TEST_ID, BADGE.ACTIVE)).toBeTruthy()
    expect(await ui.isBadgeVisible(TEST_ID, BADGE.OVERRIDDEN)).toBeTruthy()
  })

  it('shows experiment authors', async () => {
    const TEST_ID = 1
    const ui = await render()
    await ui.expandListItem(TEST_ID)
    expect(await ui.getAuthors(TEST_ID)).toBe(
      'creator@wix.com, updater@wix.com',
    )
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
