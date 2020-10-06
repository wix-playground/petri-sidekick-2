import {
  loadActiveExperiments,
  setExperimentAuto,
} from './activeExperimentsActions'
import {IExperiment} from '../../commons/petri'
import {getActiveExperiments} from './activeExperimentsReducer'
import {setExperimentValue} from './activeExperimentsActions'
import {
  forgetExperiment,
  turnBinaryExperimentOn,
  turnBinaryExperimentOff,
} from './activeExperimentsActions'
import {
  IToConnectedActionCreator,
  useAppState,
  connectActionCreators,
} from '../../commons/appState'

export interface IUseActiveExperiments {
  activeExperiments: IExperiment[]
  loadActiveExperiments: IToConnectedActionCreator<typeof loadActiveExperiments>
  setExperimentAuto: IToConnectedActionCreator<typeof setExperimentAuto>
  setExperimentValue: IToConnectedActionCreator<typeof setExperimentValue>
  forgetExperiment: IToConnectedActionCreator<typeof forgetExperiment>
  turnBinaryExperimentOn: IToConnectedActionCreator<
    typeof turnBinaryExperimentOn
  >
  turnBinaryExperimentOff: IToConnectedActionCreator<
    typeof turnBinaryExperimentOff
  >
}

export const useActiveExperiments = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    loadActiveExperiments,
    setExperimentAuto,
    setExperimentValue,
    forgetExperiment,
    turnBinaryExperimentOn,
    turnBinaryExperimentOff,
  })

  return {
    activeExperiments: getActiveExperiments(state),
    ...connectedActionCreators,
  } as IUseActiveExperiments
}
