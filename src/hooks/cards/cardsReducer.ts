import {IAction, IAppState} from '../../commons/appState'
import {
  ACTION_OPEN_CARD,
  ACTION_TOGGLE_CARD,
  ACTION_DISABLE_FOCUS_SELECT,
} from './cardsActions'

export interface ICardsState {
  activeCard: string | null
  focusSelect: boolean
}

export const defaultCardsState: ICardsState = {
  activeCard: null,
  focusSelect: false,
}

export const reduceCards = (
  state: ICardsState,
  action: IAction,
): ICardsState => {
  switch (action.type) {
    case ACTION_OPEN_CARD:
      const {specName: activeCard, focusSelect} = action.payload
      return {...state, activeCard, focusSelect}
    case ACTION_TOGGLE_CARD:
      if (state.activeCard === action.payload.specName) {
        return {...state, activeCard: null, focusSelect: false}
      } else {
        return {
          ...state,
          activeCard: action.payload.specName,
          focusSelect: false,
        }
      }
    case ACTION_DISABLE_FOCUS_SELECT:
      return {...state, focusSelect: false}
    default:
      return state
  }
}

export const getActiveCard = (state: IAppState) => state.cards.activeCard

export const getDefaultSelectFocus = (state: IAppState) =>
  state.cards.focusSelect
