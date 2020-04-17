import {loadActiveExperiments} from './activeExperimentsActions'
import {IExperiment} from '../../commons/petri'
import {
  IToConnectedActionCreator,
  useAppState,
  connectActionCreators,
} from '../../commons/appState'

export interface IUseActiveExperiments {
  activeExperiments: IExperiment[]
  loadActiveExperiments: IToConnectedActionCreator<typeof loadActiveExperiments>
}

export const useActiveExperiments = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    loadActiveExperiments,
  })

  return {
    activeExperiments: state.activeExperiments.list,
    ...connectedActionCreators,
  } as IUseActiveExperiments
}
