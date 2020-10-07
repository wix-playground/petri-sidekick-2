import {openCard, toggleCard} from './cardsActions'
import {getActiveCard} from './cardsReducer'
import {
  IToConnectedActionCreator,
  useAppState,
  connectActionCreators,
} from '../../commons/appState'

export interface IUseCards {
  activeCard: string
  openCard: IToConnectedActionCreator<typeof openCard>
  toggleCard: IToConnectedActionCreator<typeof toggleCard>
}

export const useCards = () => {
  const {state, getState, dispatch} = useAppState()

  const connectedActionCreators = connectActionCreators(dispatch, getState, {
    openCard,
    toggleCard,
  })

  return {
    activeCard: getActiveCard(state),
    ...connectedActionCreators,
  } as IUseCards
}
