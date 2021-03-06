import {IAction, IAppState} from '../../commons/appState'
import {
  ACTION_LOAD_PETRI_EXPERIMENTS,
  ACTION_CLEAN_PETRI_EXPERIMENTS,
} from './petriExperimentsActions'
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
    case ACTION_CLEAN_PETRI_EXPERIMENTS:
      return {
        ...state,
        list: [],
        loaded: false,
      }
    default:
      return state
  }
}

export const getPetriExperiments = (state: IAppState) =>
  state.petriExperiments.list

export const isPetriExperimentsLoaded = (state: IAppState) =>
  state.petriExperiments.loaded
