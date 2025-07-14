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
import {setCookie, getExperimentsFromCookies} from '../../commons/cookies'
import {getFactualExperiments} from '../../commons/experiments'
import {
  EXPERIMENTS_COOKIE_NAME,
  EXPERIMENTS_DOMAINS,
} from '../../commons/constants'

export const ACTION_COMPLETE_ACTIVE_EXPERIMENTS = 'ACTION_COMPL_ACT_EXPERIMENTS'
export const ACTION_LOAD_ACTIVE_EXPERIMENTS = 'ACTION_LOAD_ACTIVE_EXPERIMENTS'
export const ACTION_SET_EXPERIMENT_AUTO = 'ACTION_SET_EXPERIMENT_AUTO'

export const forgetExperiment: IActionCreator = async (
  context,
  specName: string,
) => {
  const storedExperiments: IExperiment[] =
    getValue(ACTIVE_EXPERIMENTS_MEMORY) || []

  const filteredExperiments = storedExperiments.filter(
    experiment => experiment.specName !== specName,
  )

  setValue(ACTIVE_EXPERIMENTS_MEMORY, filteredExperiments)

  await setExperimentAuto(context, specName)
}

export const turnBinaryExperimentOn: IActionCreator = (
  context,
  specName: string,
) => setExperimentValue(context, specName, 'true')

export const turnBinaryExperimentOff: IActionCreator = (
  context,
  specName: string,
) => setExperimentValue(context, specName, 'false')

export const setExperimentValue: IActionCreator = async (
  context,
  specName: string,
  value: string,
) => {
  const experimentsFromCookies = await getExperimentsFromCookies()

  let changedExistentExperiment = false

  const updatedExperiments = experimentsFromCookies.map(
    ([experimentSpecName, originalValue]) => {
      if (experimentSpecName === specName) {
        changedExistentExperiment = true
        return [experimentSpecName, value]
      } else {
        return [experimentSpecName, originalValue]
      }
    },
  )

  if (!changedExistentExperiment) {
    updatedExperiments.push([specName, value])
  }

  const newCookieValue = updatedExperiments
    .map(item => item.join('#'))
    .join('|')

  for (let domain of EXPERIMENTS_DOMAINS) {
    await setCookie(EXPERIMENTS_COOKIE_NAME, newCookieValue, domain)
  }

  reloadRelevantTabs()
  loadActiveExperiments(context)
}

export const setExperimentAuto: IActionCreator = async (
  context,
  specName: string,
) => {
  const experimentsFromCookies = await getExperimentsFromCookies()

  const filteredExperiments = experimentsFromCookies.filter(
    ([experimentSpecName]) => experimentSpecName !== specName,
  )

  const newCookieValue = filteredExperiments
    .map(item => item.join('#'))
    .join('|')

  for (let domain of EXPERIMENTS_DOMAINS) {
    await setCookie(EXPERIMENTS_COOKIE_NAME, newCookieValue, domain)
  }

  reloadRelevantTabs()
  loadActiveExperiments(context)
}

export const updateBadge: IActionCreator = ({getState}) => {
  chrome.action.setBadgeText({
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

export const loadActiveExperiments: IActionCreator = async context => {
  const {dispatch} = context
  const storedExperiments = getValue(ACTIVE_EXPERIMENTS_MEMORY) || []

  const factualExperiments = await getFactualExperiments(storedExperiments)

  const updatedStoredExperiments = await getUpdatedStoredExperiments(
    storedExperiments,
    factualExperiments,
  )

  const activeExperiments = filterUniqueByKey(
    [...updatedStoredExperiments, ...factualExperiments],
    'specName',
  )

  dispatch({
    type: ACTION_LOAD_ACTIVE_EXPERIMENTS,
    payload: activeExperiments,
  })

  updateBadge(context)
  completeActiveExperiments(context)
}

const getUpdatedStoredExperiments = (
  storedExperiments: IExperiment[],
  factualExperiments: IExperiment[],
) =>
  storedExperiments.map(experiment => {
    const factualExperiment = factualExperiments.find(
      item => item.specName === experiment.specName,
    )

    return factualExperiment
      ? {
          ...experiment,
          state: factualExperiment.state,
          customState: factualExperiment.customState,
        }
      : {
          ...experiment,
          state: EXPERIMENT_STATE.AUTO,
          customState: undefined,
        }
  })

const reloadRelevantTabs = () => {
  const urlPatterns = EXPERIMENTS_DOMAINS.map(domain => `*://*${domain}/*`)

  chrome.tabs.query({url: urlPatterns}, tabs => {
    tabs.forEach(tab => (chrome.tabs.reload as any)(tab.id))
  })
}
