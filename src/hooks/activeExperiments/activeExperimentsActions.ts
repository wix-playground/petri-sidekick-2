import {IActionCreator} from '../../commons/appState'
import {EXPERIMENT_STATE, IExperiment} from '../../commons/petri'
import {
  getActiveExperimentAmount,
  getActiveExperiments,
} from './activeExperimentsReducer'
import {
  getValue,
  ACTIVE_EXPERIMENTS_MEMORY,
  setValue,
} from '../../commons/localStorage'
import {getPetriExperiments} from '../petriExperiments/petriExperimentsReducer'
import {filterUniqueByKey} from '../../commons/arrays'

export const ACTION_COMPLETE_ACTIVE_EXPERIMENTS = 'ACTION_COMPL_ACT_EXPERIMENTS'
export const ACTION_LOAD_ACTIVE_EXPERIMENTS = 'ACTION_LOAD_ACTIVE_EXPERIMENTS'

const EXPERIMENTS_COOKIE_NAME = 'petri_ovr'
const EXPERIMENTS_DOMAINS = ['.wix.com', '.wixapps.net', '.wixsite.com']

export const updateBadge: IActionCreator = ({getState}) => {
  chrome.browserAction.setBadgeText({
    text: (getActiveExperimentAmount(getState()) || '').toString(),
  })
}

export const completeActiveExperiments: IActionCreator = ({
  dispatch,
  getState,
}) => {
  const petriExperiments = getPetriExperiments(getState())

  dispatch({
    type: ACTION_COMPLETE_ACTIVE_EXPERIMENTS,
    payload: petriExperiments,
  })

  setValue(ACTIVE_EXPERIMENTS_MEMORY, getActiveExperiments(getState()))
}

export const loadActiveExperiments: IActionCreator = context => {
  const {dispatch} = context
  const storedExperiments = getValue(ACTIVE_EXPERIMENTS_MEMORY) || []

  chrome.cookies.getAll(
    {
      name: EXPERIMENTS_COOKIE_NAME,
    },
    cookies => {
      dispatch({
        type: ACTION_LOAD_ACTIVE_EXPERIMENTS,
        payload: filterUniqueByKey(
          cookies
            .filter(cookie => EXPERIMENTS_DOMAINS.includes(cookie.domain))
            .flatMap(cookie => cookie.value.split('|'))
            .filter(item => item.length)
            .map(item => item.split('#'))
            .map(([specName, value]) => [specName, value === 'true'])
            .filter(
              (item, index, arr) =>
                arr.findIndex(nextItem => nextItem[0] === item[0]) === index,
            )
            .map(
              ([specName, state]) =>
                ({
                  specName,
                  state: state ? EXPERIMENT_STATE.ON : EXPERIMENT_STATE.OFF,
                  actualState: state
                    ? EXPERIMENT_STATE.ON
                    : EXPERIMENT_STATE.OFF,
                } as IExperiment),
            )
            .concat(storedExperiments),
          'specName',
        ),
      })

      updateBadge(context)
      completeActiveExperiments(context)
    },
  )
}
