import {
  loadActiveExperiments,
  setExperimentAuto,
} from './activeExperimentsActions'
import {IExperiment} from '../../commons/petri'
import {getActiveExperiments} from './activeExperimentsReducer'
import {forgetExperiment} from './activeExperimentsActions'
import {
  IToConnectedActionCreator,
  useAppState,
  connectActionCreators,
} from '../../commons/appState'

export interface IUseActiveExperiments {
  activeExperiments: IExperiment[]
  loadActiveExperiments: IToConnectedActionCreator<typeof loadActiveExperiments>
  setExperimentAuto: IToConnectedActionCreator<typeof setExperimentAuto>
  forgetExperiment: IToConnectedActionCreator<typeof forgetExperiment>
}

export const useActiveExperiments = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    loadActiveExperiments,
    setExperimentAuto,
    forgetExperiment,
  })

  return {
    activeExperiments: getActiveExperiments(state),
    ...connectedActionCreators,
  } as IUseActiveExperiments
}
