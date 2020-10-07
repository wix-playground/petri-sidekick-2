import {IActionCreator} from '../../commons/appState'

export const ACTION_OPEN_CARD = 'ACTION_OPEN_CARD'
export const ACTION_TOGGLE_CARD = 'ACTION_TOGGLE_CARD'
export const ACTION_DISABLE_FOCUS_SELECT = 'ACTION_DISABLE_FOCUS_SELECT'

export const openCard: IActionCreator = (
  {dispatch},
  specName: string,
  focusOverrideInput = false,
) => {
  dispatch({type: ACTION_OPEN_CARD, payload: {specName, focusOverrideInput}})
}

export const toggleCard: IActionCreator = ({dispatch}, specName: string) => {
  dispatch({type: ACTION_TOGGLE_CARD, payload: {specName}})
}
