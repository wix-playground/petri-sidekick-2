import {IAction} from '../../commons/appState'
import {ACTION_LOAD_PETRI_EXPERIMENTS} from './petriExperimentsActions'
import {IExperiment, IPetriExperimentData} from '../../commons/petri'

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
        list: action.payload.map(
          (experiment: IPetriExperimentData): IExperiment => ({
            specName: experiment.key,
            petriData: experiment,
          }),
        ),
        loaded: true,
      }
    default:
      return state
  }
}
