import {IActionCreator} from '../../commons/appState'
import {login, loggedIn} from '../../commons/petri'

export const ACTION_CHECK_CREDENTIALS = 'ACTION_CHECK_CREDENTIALS'
export const ACTION_LOGIN = 'ACTION_LOGIN'

export const checkCredentials: IActionCreator = async ({dispatch}) => {
  dispatch({
    type: ACTION_CHECK_CREDENTIALS,
    payload: await loggedIn(),
  })
}

export const performLogin: IActionCreator = ({dispatch}) => {
  dispatch({type: ACTION_LOGIN})
  setTimeout(login, 3000)
}
