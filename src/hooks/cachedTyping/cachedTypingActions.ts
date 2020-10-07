import {IActionCreator} from '../../commons/appState'

export const ACTION_ADD_CACHED_TYPING_TEXT = 'ACTION_ADD_CACHED_TYPING_TEXT'
export const ACTION_RESET_CACHED_TYPING = 'ACTION_RESET_CACHED_TYPING'
export const ACTION_ENABLE_CACHED_TYPING = 'ACTION_ENABLE_CACHED_TYPING'
export const ACTION_DISABLE_CACHED_TYPING = 'ACTION_DISABLE_CACHED_TYPING'

export const addCachedTypingText: IActionCreator = (
  {dispatch},
  text: string,
) => {
  dispatch({
    type: ACTION_ADD_CACHED_TYPING_TEXT,
    payload: text,
  })
}

export const resetCachedTyping: IActionCreator = ({dispatch}) => {
  dispatch({
    type: ACTION_RESET_CACHED_TYPING,
  })
}

export const enableCachedTyping: IActionCreator = ({dispatch}) => {
  dispatch({
    type: ACTION_ENABLE_CACHED_TYPING,
  })
}

export const disableCachedTyping: IActionCreator = ({dispatch}) => {
  dispatch({
    type: ACTION_DISABLE_CACHED_TYPING,
  })
}
