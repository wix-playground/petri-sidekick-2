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
      const list = state.list.map(item => ({
        ...item,
        ...(action.payload.find(
          (petriItem: IExperiment) => petriItem.specName === item.specName,
        ) || {}),
      }))

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
