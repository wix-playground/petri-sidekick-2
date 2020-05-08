import {IAction, IAppState} from '../../commons/appState'
import {
  ACTION_LOAD_ACTIVE_EXPERIMENTS,
  ACTION_COMPLETE_ACTIVE_EXPERIMENTS,
} from './activeExperimentsActions'
import {IExperiment, EXPERIMENT_STATE} from '../../commons/petri'

export interface IActiveExperimentsState {
  list: IExperiment[]
}

export const defaultActiveExperimentsState: IActiveExperimentsState = {
  list: [],
}

export const reduceActiveExperiments = (
  state: IActiveExperimentsState,
  action: IAction,
): IActiveExperimentsState => {
  switch (action.type) {
    case ACTION_LOAD_ACTIVE_EXPERIMENTS:
      return {
        ...state,
        list: action.payload,
      }
    case ACTION_COMPLETE_ACTIVE_EXPERIMENTS:
      const list = state.list
        .map(item => ({
          ...item,
          ...(action.payload.find(
            (petriItem: IExperiment) => petriItem.specName === item.specName,
          ) || {}),
        }))
        .map(experiment => fixBinaryExperiment(experiment))

      return {
        ...state,
        list,
      }
    default:
      return state
  }
}

export const getActiveExperiments = (state: IAppState) =>
  state.activeExperiments.list

export const getActiveExperimentAmount = (state: IAppState) =>
  getActiveExperiments(state).length

const fixBinaryExperiment = (experiment: IExperiment): IExperiment => {
  if (Object.is(experiment.customState, undefined)) {
    return experiment
  }

  if (!isBinaryExperiment(experiment)) {
    return experiment
  }

  if (experiment.state === EXPERIMENT_STATE.AUTO) {
    return experiment
  }

  const customState = experiment.customState as string

  if (customState.toLowerCase() === 'true') {
    experiment.state = EXPERIMENT_STATE.ON
    experiment.actualState = EXPERIMENT_STATE.ON
  } else {
    experiment.state = EXPERIMENT_STATE.OFF
    experiment.actualState = EXPERIMENT_STATE.OFF
  }

  delete experiment.customState
  return experiment
}

const isBinaryExperiment = (experiment: IExperiment) => {
  const options = experiment.petriData?.options ?? []

  if (options.length !== 2) {
    return false
  }

  const lowerCaseOptions = options.map(option => option.toLowerCase())
  const requiredValues = ['true', 'false']

  for (let requiredValue of requiredValues) {
    if (!lowerCaseOptions.includes(requiredValue)) {
      return false
    }
  }

  return true
}
