import {loadPetriExperiments} from './petriExperimentsActions'
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
  loadPetriExperiments: IToConnectedActionCreator<typeof loadPetriExperiments>
}

export const usePetriExperiments = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    loadPetriExperiments,
  })

  return {
    petriExperiments: getPetriExperiments(state),
    loaded: isPetriExperimentsLoaded(state),
    ...connectedActionCreators,
  } as IUsePetriExperiments
}
