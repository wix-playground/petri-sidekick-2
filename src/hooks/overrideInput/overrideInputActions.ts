import {IActionCreator} from '../../commons/appState'

export const ACTION_FOCUS_OVERRIDE_INPUT = 'ACTION_FOCUS_OVERRIDE_INPUT'
export const ACTION_DISABLE_OVERRIDE_INPUT_FOCUS =
  'ACTION_DISABLE_OVERRIDE_INPUT_FOCUS'

export const focusOverrideInput: IActionCreator = ({dispatch}) => {
  dispatch({type: ACTION_FOCUS_OVERRIDE_INPUT})
}

export const disableOverrideInputFocus: IActionCreator = ({dispatch}) => {
  dispatch({type: ACTION_DISABLE_OVERRIDE_INPUT_FOCUS})
}
