import {IActionCreator} from '../../commons/appState'
import {EXPERIMENT_STATE, IExperiment} from '../../commons/petri'
import {getActiveExperimentAmount} from './activeExperimentsReducer'

export const ACTION_LOAD_ACTIVE_EXPERIMENTS = 'ACTION_LOAD_ACTIVE_EXPERIMENTS'

const EXPERIMENTS_COOKIE_NAME = 'petri_ovr'
const EXPERIMENTS_DOMAINS = ['.wix.com', '.wixapps.net', '.wixsite.com']

// TODO: also load from local storage

export const updateBadge: IActionCreator = ({getState}) => {
  chrome.browserAction.setBadgeText({
    text: (getActiveExperimentAmount(getState()) || '').toString(),
  })
}

export const loadActiveExperiments: IActionCreator = (context) => {
  chrome.cookies.getAll(
    {
      name: EXPERIMENTS_COOKIE_NAME,
    },
    (cookies) => {
      context.dispatch({
        type: ACTION_LOAD_ACTIVE_EXPERIMENTS,
        payload: cookies
          .filter((cookie) => EXPERIMENTS_DOMAINS.includes(cookie.domain))
          .flatMap((cookie) => cookie.value.split('|'))
          .filter((item) => item.length)
          .map((item) => item.split('#'))
          .map(([specName, value]) => [specName, value === 'true'])
          .filter(
            (item, index, arr) =>
              arr.findIndex((nextItem) => nextItem[0] === item[0]) === index,
          )
          .map(
            ([specName, state]) =>
              ({
                specName,
                state: state ? EXPERIMENT_STATE.ON : EXPERIMENT_STATE.OFF,
                actualState: state ? EXPERIMENT_STATE.ON : EXPERIMENT_STATE.OFF,
              } as IExperiment),
          ),
      })

      updateBadge(context)
    },
  )
}
