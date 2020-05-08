import {IAction} from '../../commons/appState'
import {ACTION_LOGIN, ACTION_CHECK_CREDENTIALS} from './loginActions'

export interface ILoginState {
  authenticated: boolean
  ready: boolean
  inProgress: boolean
}

export const defaultLoginState: ILoginState = {
  authenticated: false,
  ready: false,
  inProgress: false,
}

export const reduceLogin = (
  state: ILoginState,
  action: IAction,
): ILoginState => {
  switch (action.type) {
    case ACTION_LOGIN:
      return {
        ...state,
        inProgress: true,
      }
    case ACTION_CHECK_CREDENTIALS:
      return {
        ...state,
        authenticated: action.payload,
        ready: true,
      }
    default:
      return state
  }
}
