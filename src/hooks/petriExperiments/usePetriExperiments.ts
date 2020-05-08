import {loadPetriExperimentsIfNeeded} from './petriExperimentsActions'
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
}

export const usePetriExperiments = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    loadPetriExperimentsIfNeeded,
  })

  return {
    petriExperiments: getPetriExperiments(state),
    loaded: isPetriExperimentsLoaded(state),
    ...connectedActionCreators,
  } as IUsePetriExperiments
}
