import {IAction, IAppState} from '../../commons/appState'
import {ACTION_OPEN_CARD} from '../cards/cardsActions'
import {
  ACTION_FOCUS_OVERRIDE_INPUT,
  ACTION_DISABLE_OVERRIDE_INPUT_FOCUS,
} from './overrideInputActions'
export interface IOverrideInputState {
  focus: boolean
}

export const defaultOverrideInputState: IOverrideInputState = {
  focus: false,
}

export const reduceOverrideInput = (
  state: IOverrideInputState,
  action: IAction,
) => {
  switch (action.type) {
    case ACTION_OPEN_CARD:
      return {...state, focus: action.payload.focusOverrideInput}
    case ACTION_FOCUS_OVERRIDE_INPUT:
      return {...state, focus: true}
    case ACTION_DISABLE_OVERRIDE_INPUT_FOCUS:
      return {...state, focus: false}
    default:
      return state
  }
}

export const getOverrideInputFocus = (state: IAppState) =>
  state.overrideInput.focus
