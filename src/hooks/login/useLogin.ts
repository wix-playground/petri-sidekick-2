import {
  useAppState,
  connectActionCreators,
  IToConnectedActionCreator,
} from '../../commons/appState'
import {checkCredentials, performLogin} from './loginActions'

export interface IUseLogin {
  authenticated: boolean
  ready: boolean
  inProgress: boolean
  login: IToConnectedActionCreator<typeof performLogin>
}

let checkedCredentials = false

export const useLogin = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    checkCredentials,
    login: performLogin,
  })

  if (!checkedCredentials) {
    checkedCredentials = true
    connectedActionCreators.checkCredentials()
  }

  return {
    authenticated: state.login.authenticated,
    ready: state.login.ready,
    inProgress: state.login.inProgress,
    login: connectedActionCreators.login,
  } as IUseLogin
}
