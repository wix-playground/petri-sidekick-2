import {IAction} from '../../commons/appState'
import {ACTION_LOAD_ACTIVE_EXPERIMENTS} from './activeExperimentsActions'
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
        list: state.list
          .filter(item => item.state !== EXPERIMENT_STATE.AUTO)
          .concat(action.payload),
      }
    default:
      return state
  }
}
