import {
  addCachedTypingText,
  resetCachedTyping,
  enableCachedTyping,
  disableCachedTyping,
} from './cachedTypingActions'
import {getCachedTypingText, isCachedTypingEnabled} from './cachedTypingReducer'
import {useAppState} from '../../commons/appState'
import {
  IToConnectedActionCreator,
  connectActionCreators,
} from '../../commons/appState'

export interface IUseCachedTyping {
  text: string
  enabled: boolean
  addCachedTypingText: IToConnectedActionCreator<typeof addCachedTypingText>
  resetCachedTyping: IToConnectedActionCreator<typeof resetCachedTyping>
  enableCachedTyping: IToConnectedActionCreator<typeof enableCachedTyping>
  disableCachedTyping: IToConnectedActionCreator<typeof disableCachedTyping>
}

export const useCachedTyping = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    addCachedTypingText,
    resetCachedTyping,
    enableCachedTyping,
    disableCachedTyping,
  })

  return {
    text: getCachedTypingText(state),
    enabled: isCachedTypingEnabled(state),
    ...connectedActionCreators,
  } as IUseCachedTyping
}
