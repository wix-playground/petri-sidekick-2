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
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({text: '3'})
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
    const TEST_ID = 0

    const ui = await render()
    await ui.clickSwitch(TEST_ID, SWITCH.DISABLE)

    const specName = await ui.getListItemTitle(TEST_ID)
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
    const TEST_ID = 0

    const ui = await render()
    await ui.clickSwitch(TEST_ID, SWITCH.RESET)

    const specName = await ui.getListItemTitle(TEST_ID)
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
    const TEST_ID = 2

    const ui = await render()
    await ui.expandListItem(TEST_ID)
    await ui.enterOverrideValue('old')

    const specName = await ui.getListItemTitle(TEST_ID)
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
    const TEST_ID = 2

    const ui = await render()
    await ui.expandListItem(TEST_ID)
    await ui.enterOverrideValue('')

    const specName = await ui.getListItemTitle(TEST_ID)
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

  it('shows full experiment spec name when expanded', async () => {
    const TEST_ID = 1
    const ui = await render()
    const specName = await ui.getListItemTitle(TEST_ID)
    await ui.expandListItem(TEST_ID)
    expect(await ui.getFullTitle(TEST_ID)).toBe(specName)
  })

  it('allows removing experiment from bookmark list', async () => {
    const TEST_ID = 1
    const ui = await render()

    const specName = await ui.getListItemTitle(TEST_ID)
    const experiments = ui.getExperimentConfig()
    delete experiments[specName as string]

    await ui.clickDelete(TEST_ID)

    expect(chrome.cookies.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: EXPERIMENTS_COOKIE_NAME,
        value: ui.getExperimentCookieValue(experiments),
      }),
      expect.any(Function),
    )

    // FIXME: for some reason sendMessage is called but mock does not see it
    // expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
    //   type: 'SET_STORAGE',
    //   payload: {
    //     key: 'experiments',
    //     value: expect.not.stringContaining(specName as string),
    //   },
    // })
  })

  it('allows finding experiment using search', async () => {
    const ui = await render()
    await ui.openSearch()
    expect(await ui.isSearchResultVisible()).toBeFalsy()
    await ui.enterSearchQuery('booleanExperiment')
    expect(await ui.isSearchResultVisible()).toBeTruthy()
  })

  it('allows updating experiment cache if experiment is not found', async () => {
    const ui = await render()

    await ui.openSearch()
    await ui.enterSearchQuery('nonExistent')

    jest.clearAllMocks()
    await ui.clickUpdate()

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      {
        type: 'GET',
        payload: expect.objectContaining({
          url: expect.stringContaining('ExperimentSearch'),
        }),
      },
      expect.any(Function),
    )
  })
})
