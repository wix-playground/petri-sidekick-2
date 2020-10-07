import {IAction, IAppState} from '../../commons/appState'
import {
  ACTION_ENABLE_CACHED_TYPING,
  ACTION_DISABLE_CACHED_TYPING,
} from './cachedTypingActions'
import {
  ACTION_ADD_CACHED_TYPING_TEXT,
  ACTION_RESET_CACHED_TYPING,
} from './cachedTypingActions'

export interface ICachedTypingState {
  text: string
  enabled: boolean
}

export const defaultCachedTypingState: ICachedTypingState = {
  text: '',
  enabled: true,
}

export const reduceCachedTyping = (
  state: ICachedTypingState,
  action: IAction,
) => {
  switch (action.type) {
    case ACTION_ADD_CACHED_TYPING_TEXT:
      return {...state, text: state.text + action.payload}
    case ACTION_RESET_CACHED_TYPING:
      return {...state, text: ''}
    case ACTION_ENABLE_CACHED_TYPING:
      return {...state, enabled: true}
    case ACTION_DISABLE_CACHED_TYPING:
      return {...state, enabled: false}
    default:
      return state
  }
}

export const getCachedTypingText = (state: IAppState) => state.cachedTyping.text

export const isCachedTypingEnabled = (state: IAppState) =>
  state.cachedTyping.enabled
