import {IAction} from '../../commons/appState'

export const ACTIVE_EXPERIMENT_STATE_ON = 'ON'
export const ACTIVE_EXPERIMENT_STATE_OFF = 'OFF'
export const ACTIVE_EXPERIMENT_STATE_AUTO = 'AUTO'

export enum ACTIVE_EXPERIMENT_STATE {
  ON = 'on',
  OFF = 'off',
  AUTO = 'auto',
}

export interface IActiveExperiment {
  specName: string
  state: ACTIVE_EXPERIMENT_STATE
}

export interface IActiveExperimentsState {
  list: IActiveExperiment[]
}

export const defaultActiveExperimentsState: IActiveExperimentsState = {
  list: [],
}

export const reduceActiveExperiments = (
  state: IActiveExperimentsState,
  action: IAction,
): IActiveExperimentsState => {
  switch (action.type) {
    default:
      return state
  }
}
