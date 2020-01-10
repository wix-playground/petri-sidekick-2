import {IAction} from '../../commons/appState'
import {TAB} from './tabsReducer'

export const ACTION_SET_TAB = 'ACTION_SET_TAB'

export const setActiveTab = (dispatch: React.Dispatch<IAction>, tab: TAB) => {
  dispatch({type: ACTION_SET_TAB, payload: tab})
}
