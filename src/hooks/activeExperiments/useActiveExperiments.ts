import * as React from 'react'
import {loadActiveExperiments} from './activeExperimentsActions'
import {IActiveExperiment} from './activeExperimentsReducer'
import {
  IToConnectedActionCreator,
  useAppState,
  connectActionCreators,
} from '../../commons/appState'

export interface IUseActiveExperiments {
  activeExperiments: IActiveExperiment[]
  loadActiveExperiments: IToConnectedActionCreator<typeof loadActiveExperiments>
}

export const useTabs = () => {
  const {state, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, {
    loadActiveExperiments,
  })

  return {
    activeExperiments: state.activeExperiments.list,
    ...connectedActionCreators,
  } as IUseActiveExperiments
}
