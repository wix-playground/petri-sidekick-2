import {IActionCreator} from '../../commons/appState'
import {
  EXPERIMENT_STATE,
  IExperiment,
  IExperimentCookieData,
} from '../../commons/petri'
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
import {setCookie} from '../../commons/cookies'

export const ACTION_COMPLETE_ACTIVE_EXPERIMENTS = 'ACTION_COMPL_ACT_EXPERIMENTS'
export const ACTION_LOAD_ACTIVE_EXPERIMENTS = 'ACTION_LOAD_ACTIVE_EXPERIMENTS'
export const ACTION_SET_EXPERIMENT_AUTO = 'ACTION_SET_EXPERIMENT_AUTO'

const EXPERIMENTS_COOKIE_NAME = 'petri_ovr'
const EXPERIMENTS_DOMAINS = [
  '.wix.com',
  '.wixapps.net',
  '.wixsite.com',
  '.editorx.com',
  '.editorx.io',
  '.wix-code.com',
  '.wixpress.com',
  '.wixanswers.com',
  '.wixrestaurants.com',
  '.wixhotels.com',
]

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

  loadActiveExperiments(context)
}

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

export const loadActiveExperiments: IActionCreator = async context => {
  const {dispatch} = context
  const storedExperiments = getValue(ACTIVE_EXPERIMENTS_MEMORY) || []

  const factualExperiments = await getFactualExperiments(storedExperiments)

  const updatedStoredExperiments = await getUpdatedStoredExperiments(
    storedExperiments,
    factualExperiments,
  )

  const activeExperiments = filterUniqueByKey(
    [...factualExperiments, ...updatedStoredExperiments],
    'specName',
  )

  dispatch({
    type: ACTION_LOAD_ACTIVE_EXPERIMENTS,
    payload: activeExperiments,
  })

  updateBadge(context)
  completeActiveExperiments(context)
}

const getExperimentsFromCookies = (): Promise<IExperimentCookieData> =>
  new Promise(resolve => {
    chrome.cookies.getAll(
      {
        name: EXPERIMENTS_COOKIE_NAME,
      },
      cookies => {
        resolve(
          cookies
            .filter(cookie => EXPERIMENTS_DOMAINS.includes(cookie.domain))
            .flatMap(cookie => cookie.value.split('|'))
            .filter(item => item.length)
            .map(item => item.split('#'))
            .filter(
              (item, index, arr) =>
                arr.findIndex(nextItem => nextItem[0] === item[0]) === index,
            ) as IExperimentCookieData,
        )
      },
    )
  })

const getFactualExperiments = async (
  storedExperiments: IExperiment[],
): Promise<IExperiment[]> =>
  (await getExperimentsFromCookies()).map(([specName, state]) =>
    getExperimentWithState(
      {
        specName,
        state: EXPERIMENT_STATE.CUSTOM,
        customState: state,
      } as IExperiment,
      storedExperiments,
    ),
  )

const getUpdatedStoredExperiments = (
  storedExperiments: IExperiment[],
  factualExperiments: IExperiment[],
) =>
  storedExperiments.map(experiment =>
    factualExperiments.find(item => item.specName === experiment.state)
      ? experiment
      : {
          ...experiment,
          state: EXPERIMENT_STATE.AUTO,
          customState: undefined,
        },
  )

const getExperimentWithState = (
  newExperiment: IExperiment,
  storedExperiments: IExperiment[],
): IExperiment => {
  const storedExperiment = storedExperiments.find(
    experiment => experiment.specName === newExperiment.specName,
  )
  const isBinary =
    storedExperiment && Object.is(storedExperiment.customState, undefined)

  if (!isBinary) {
    console.log('So far this experiment is treated as not binary')
    return newExperiment
  }

  const customState = newExperiment.customState as string

  newExperiment.state =
    customState.toLowerCase() === 'true'
      ? EXPERIMENT_STATE.ON
      : EXPERIMENT_STATE.OFF

  delete newExperiment.customState

  return newExperiment
}
