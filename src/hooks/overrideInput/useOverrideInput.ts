import {getOverrideInputFocus} from './overrideInputReducer'
import {
  focusOverrideInput,
  disableOverrideInputFocus,
} from './overrideInputActions'
import {
  IToConnectedActionCreator,
  connectActionCreators,
  useAppState,
} from '../../commons/appState'

export interface IUseOverrideInput {
  focus: boolean
  focusOverrideInput: IToConnectedActionCreator<typeof focusOverrideInput>
  disableOverrideInputFocus: IToConnectedActionCreator<
    typeof disableOverrideInputFocus
  >
}

export const useOverrideInput = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    focusOverrideInput,
    disableOverrideInputFocus,
  })

  return {
    focus: getOverrideInputFocus(state),
    ...connectedActionCreators,
  } as IUseOverrideInput
}
