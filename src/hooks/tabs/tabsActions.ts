import {IActionCreator} from '../../commons/appState'
import {TAB} from './tabsReducer'
import {enableCachedTyping} from '../cachedTyping/cachedTypingActions'

export const ACTION_SET_TAB = 'ACTION_SET_TAB'

export const setActiveTab: IActionCreator = (context, tab: TAB) => {
  const {dispatch} = context
  dispatch({type: ACTION_SET_TAB, payload: tab})

  if (tab !== TAB.SEARCH) {
    enableCachedTyping(context)
  }
}
