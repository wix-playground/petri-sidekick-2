import * as React from 'react'
import {
  ITabsState,
  reduceTabs,
  defaultTabsState,
} from '../hooks/tabs/tabsReducer'

export type IToConnectedActionCreator<F> = F extends (
  x: any,
  ...args: infer P
) => infer R
  ? (...args: P) => R
  : never

export interface IAction {
  type: string
  payload?: any
}

export type IActionCreator = (
  dispatch: React.Dispatch<IAction>,
  ...args: any[]
) => void

export type IConnectedActionCreator = (...args: any[]) => void

export interface IActionCreators {
  [name: string]: IActionCreator
}

export interface IConnectedActionCreators {
  [name: string]: IConnectedActionCreator
}

export interface IAppState {
  tabs: ITabsState
}

export interface IAppStateContext {
  state: IAppState
  dispatch: React.Dispatch<IAction>
}

const defaultState: IAppState = {tabs: defaultTabsState}

export const AppStateContext: React.Context<IAppStateContext> = React.createContext(
  {
    state: defaultState,
    dispatch: state => state,
  } as IAppStateContext,
)

export const reducer = (state: IAppState, action: IAction): IAppState => ({
  tabs: reduceTabs(state.tabs, action),
})

export const AppStateProvider: React.FunctionComponent = ({children}) => {
  const [state, dispatch] = React.useReducer<typeof reducer>(
    reducer,
    defaultState,
  )

  return (
    <AppStateContext.Provider value={{state, dispatch} as IAppStateContext}>
      {children}
    </AppStateContext.Provider>
  )
}

export const connectActionCreators = (
  dispatch: React.Dispatch<IAction>,
  actionCreators: IActionCreators,
) => {
  const connectedActionCreators: IConnectedActionCreators = {}

  for (let name in actionCreators) {
    if (actionCreators.hasOwnProperty(name)) {
      connectedActionCreators[name] = (...args) =>
        actionCreators[name](dispatch, ...args)
    }
  }

  return connectedActionCreators
}

export const useAppState = () => React.useContext(AppStateContext)
