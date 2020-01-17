import * as React from 'react'
import {
  useAppState,
  connectActionCreators,
  IToConnectedActionCreator,
} from '../../commons/appState'
import {setActiveTab} from './tabsActions'

export const CURRENT_TAB = 'current'
export const ALL_TAB = 'all'

export interface IUseTabs {
  activeTab: string
  setActiveTab: IToConnectedActionCreator<typeof setActiveTab>
}

export const useTabs = () => {
  const {state, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, {
    setActiveTab,
  })

  return {
    activeTab: state.tabs.activeTab,
    ...connectedActionCreators,
  } as IUseTabs
}
