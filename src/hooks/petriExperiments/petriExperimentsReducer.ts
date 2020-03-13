import {IAction} from '../../commons/appState'
import {ACTION_LOAD_PETRI_EXPERIMENTS} from './petriExperimentsActions'
import {IExperiment} from '../../commons/petri'

export interface IPetriExperimentsState {
  list: IExperiment[]
  loaded: boolean
}

export const defaultPetriExperimentsState: IPetriExperimentsState = {
  list: [],
  loaded: false,
}

export const reducePetriExperiments = (
  state: IPetriExperimentsState,
  action: IAction,
): IPetriExperimentsState => {
  switch (action.type) {
    case ACTION_LOAD_PETRI_EXPERIMENTS:
      return {
        ...state,
        list: action.payload,
        loaded: true,
      }
    default:
      return state
  }
}
