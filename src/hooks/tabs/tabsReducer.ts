import {IAction} from '../../commons/appState'
import {ACTION_SET_TAB} from './tabsActions'

export enum TAB {
  CURRENT = 'current',
  SEARCH = 'search',
}

export interface ITabsState {
  activeTab: TAB
}

export const defaultTabsState: ITabsState = {
  activeTab: TAB.CURRENT,
}

export const reduceTabs = (state: ITabsState, action: IAction): ITabsState => {
  switch (action.type) {
    case ACTION_SET_TAB:
      return {...state, activeTab: action.payload}
    default:
      return state
  }
}
