import {IExperiment} from '../petriExperiments/petriExperimentsReducer'
import {loadPetriExperiments} from './petriExperimentsActions'
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
  const {state, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, {
    loadPetriExperiments,
  })

  return {
    petriExperiments: state.petriExperiments.list,
    loaded: state.petriExperiments.loaded,
    ...connectedActionCreators,
  } as IUsePetriExperiments
}
