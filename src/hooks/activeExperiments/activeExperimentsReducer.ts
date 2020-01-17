import {IAction} from '../../commons/appState'
import {ACTION_LOAD_ACTIVE_EXPERIMENTS} from './activeExperimentsActions'

export const ACTIVE_EXPERIMENT_STATE_ON = 'ON'
export const ACTIVE_EXPERIMENT_STATE_OFF = 'OFF'
export const ACTIVE_EXPERIMENT_STATE_AUTO = 'AUTO'

export enum EXPERIMENT_STATE {
  ON = 'on',
  OFF = 'off',
  AUTO = 'auto',
}

export interface IExperiment {
  specName: string
  state?: EXPERIMENT_STATE
  actualState?: EXPERIMENT_STATE
}

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
