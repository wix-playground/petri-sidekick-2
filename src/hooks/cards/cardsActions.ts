import {IActionCreator} from '../../commons/appState'

export const ACTION_OPEN_CARD = 'ACTION_OPEN_CARD'
export const ACTION_TOGGLE_CARD = 'ACTION_TOGGLE_CARD'

export const openCard: IActionCreator = ({dispatch}, specName: string) => {
  dispatch({type: ACTION_OPEN_CARD, payload: specName})
}

export const toggleCard: IActionCreator = ({dispatch}, specName: string) => {
  dispatch({type: ACTION_TOGGLE_CARD, payload: specName})
}
