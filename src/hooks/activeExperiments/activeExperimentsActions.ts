import {IAction} from '../../commons/appState'

export const ACTION_LOAD_ACTIVE_EXPERIMENTS = 'ACTION_LOAD_ACTIVE_EXPERIMENTS'

export const loadActiveExperiments = (dispatch: React.Dispatch<IAction>) => {
  dispatch({type: ACTION_LOAD_ACTIVE_EXPERIMENTS})
}
