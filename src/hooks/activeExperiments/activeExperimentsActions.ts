import {IAction} from '../../commons/appState'
import {EXPERIMENT_STATE, IExperiment} from './activeExperimentsReducer'

export const ACTION_LOAD_ACTIVE_EXPERIMENTS = 'ACTION_LOAD_ACTIVE_EXPERIMENTS'

const EXPERIMENTS_COOKIE_NAME = 'petri_ovr'
const EXPERIMENTS_DOMAINS = ['.wix.com', '.wixapps.net', '.wixsite.com']

export const loadActiveExperiments = (dispatch: React.Dispatch<IAction>) => {
  chrome.cookies.getAll(
    {
      name: EXPERIMENTS_COOKIE_NAME,
    },
    cookies => {
      dispatch({
        type: ACTION_LOAD_ACTIVE_EXPERIMENTS,
        payload: cookies
          .filter(cookie => EXPERIMENTS_DOMAINS.includes(cookie.domain))
          .flatMap(cookie => cookie.value.split('|'))
          .map(item => item.split('#'))
          .map(item => [item[0], item[1] === 'true'])
          .filter(
            (item, index, arr) =>
              arr.findIndex(nextItem => nextItem[0] === item[0]) === index,
          )
          .map(
            item =>
              ({
                specName: item[0],
                state: item[1] ? EXPERIMENT_STATE.ON : EXPERIMENT_STATE.OFF,
                actualState: item[1]
                  ? EXPERIMENT_STATE.ON
                  : EXPERIMENT_STATE.OFF,
              } as IExperiment),
          ),
      })
    },
  )
}
