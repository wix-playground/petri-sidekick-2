import {
  loadPetriExperimentsIfNeeded,
  reloadPetriExperiments,
} from './petriExperimentsActions'
import {IExperiment} from '../../commons/petri'
import {
  getPetriExperiments,
  isPetriExperimentsLoaded,
} from './petriExperimentsReducer'
import {
  IToConnectedActionCreator,
  useAppState,
  connectActionCreators,
} from '../../commons/appState'

export interface IUsePetriExperiments {
  petriExperiments: IExperiment[]
  loaded: boolean
  loadPetriExperimentsIfNeeded: IToConnectedActionCreator<
    typeof loadPetriExperimentsIfNeeded
  >
  reloadPetriExperiments: IToConnectedActionCreator<
    typeof reloadPetriExperiments
  >
}

export const usePetriExperiments = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    loadPetriExperimentsIfNeeded,
    reloadPetriExperiments,
  })

  return {
    petriExperiments: getPetriExperiments(state),
    loaded: isPetriExperimentsLoaded(state),
    ...connectedActionCreators,
  } as IUsePetriExperiments
}
