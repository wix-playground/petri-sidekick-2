import {IAction, IAppState} from '../../commons/appState'
import {
  ACTION_OPEN_CARD,
  ACTION_TOGGLE_CARD,
  ACTION_DISABLE_FOCUS_SELECT,
} from './cardsActions'

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
      const {specName: activeCard} = action.payload
      return {...state, activeCard}
    case ACTION_TOGGLE_CARD:
      if (state.activeCard === action.payload.specName) {
        return {...state, activeCard: null}
      } else {
        return {
          ...state,
          activeCard: action.payload.specName,
        }
      }
    case ACTION_DISABLE_FOCUS_SELECT:
      return {...state}
    default:
      return state
  }
}

export const getActiveCard = (state: IAppState) => state.cards.activeCard
