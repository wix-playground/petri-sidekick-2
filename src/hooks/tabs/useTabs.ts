import {
  useAppState,
  connectActionCreators,
  IToConnectedActionCreator,
} from '../../commons/appState'
import {setActiveTab} from './tabsActions'
import {getActiveTab} from './tabsReducer'

export const CURRENT_TAB = 'current'
export const ALL_TAB = 'all'

export interface IUseTabs {
  activeTab: string
  setActiveTab: IToConnectedActionCreator<typeof setActiveTab>
}

export const useTabs = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    setActiveTab,
  })

  return {
    activeTab: getActiveTab(state),
    ...connectedActionCreators,
  } as IUseTabs
}
