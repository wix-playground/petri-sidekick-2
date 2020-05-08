import {
  useAppState,
  connectActionCreators,
  IToConnectedActionCreator,
} from '../../commons/appState'
import {checkCredentials, performLogin} from './loginActions'
import {
  isCredentialsChecked,
  isLoginInProgress,
  isUserAuthenticated,
} from './loginReducer'

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
    authenticated: isUserAuthenticated(state),
    ready: isCredentialsChecked(state),
    inProgress: isLoginInProgress(state),
    login: connectedActionCreators.login,
  } as IUseLogin
}
