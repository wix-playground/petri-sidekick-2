import {IActionCreator} from '../../commons/appState'
import {TAB} from './tabsReducer'

export const ACTION_SET_TAB = 'ACTION_SET_TAB'

export const setActiveTab: IActionCreator = ({dispatch}, tab: TAB) => {
  dispatch({type: ACTION_SET_TAB, payload: tab})
}
