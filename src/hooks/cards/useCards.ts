import {openCard, toggleCard, disableFocusSelect} from './cardsActions'
import {getActiveCard, getDefaultSelectFocus} from './cardsReducer'
import {
  IToConnectedActionCreator,
  useAppState,
  connectActionCreators,
} from '../../commons/appState'

export interface IUseCards {
  activeCard: string
  focusSelect: boolean
  openCard: IToConnectedActionCreator<typeof openCard>
  toggleCard: IToConnectedActionCreator<typeof toggleCard>
  disableFocusSelect: IToConnectedActionCreator<typeof disableFocusSelect>
}

export const useCards = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    openCard,
    toggleCard,
    disableFocusSelect,
  })

  return {
    activeCard: getActiveCard(state),
    focusSelect: getDefaultSelectFocus(state),
    ...connectedActionCreators,
  } as IUseCards
}
