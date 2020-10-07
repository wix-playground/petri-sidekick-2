import {IAction, IAppState} from '../../commons/appState'
import {ACTION_OPEN_CARD, ACTION_TOGGLE_CARD} from './cardsActions'

export interface ICardsState {
  activeCard: string | null
}

export const defaultCardsState: ICardsState = {
  activeCard: null,
}

export const reduceCards = (
  state: ICardsState,
  action: IAction,
): ICardsState => {
  switch (action.type) {
    case ACTION_OPEN_CARD:
      return {...state, activeCard: action.payload}
    case ACTION_TOGGLE_CARD:
      if (state.activeCard === action.payload) {
        return {...state, activeCard: null}
      } else {
        return {...state, activeCard: action.payload}
      }
    default:
      return state
  }
}

export const getActiveCard = (state: IAppState) => state.cards.activeCard
