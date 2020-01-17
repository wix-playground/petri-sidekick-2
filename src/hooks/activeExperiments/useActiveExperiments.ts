import * as React from 'react'
import {loadActiveExperiments} from './activeExperimentsActions'
import {IExperiment} from './activeExperimentsReducer'
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
  const {state, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, {
    loadActiveExperiments,
  })

  return {
    activeExperiments: state.activeExperiments.list,
    ...connectedActionCreators,
  } as IUseActiveExperiments
}
