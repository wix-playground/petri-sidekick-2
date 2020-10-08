import * as React from 'react'
import {IAppState} from './interfaces'
import {defaultState, reducers} from './state'
import {
  IAppStateContext,
  IAction,
  IActionCreators,
  IConnectedActionCreators,
} from './interfaces'

const getDefaultState = (): IAppState => defaultState

const AppStateContext: React.Context<IAppStateContext> = React.createContext({
  state: defaultState,
  getState: getDefaultState,
  dispatch: state => state,
} as IAppStateContext)

const reducer = (state: IAppState, action: IAction): IAppState =>
  Object.entries(reducers).reduce((newState, [name, reduce]) => {
    ;(newState as any)[name] = reduce((state as any)[name], action)
    return newState
  }, {} as IAppState)

const stateStorage: {state: IAppState | null} = {
  state: null,
}

export const AppStateProvider: React.FunctionComponent = ({children}) => {
  const [state, dispatch] = React.useReducer<typeof reducer>(
    reducer,
    getDefaultState(),
  )

  stateStorage.state = state
  const getState = () => stateStorage.state

  return (
    <AppStateContext.Provider
      value={{state, getState, dispatch} as IAppStateContext}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export const connectActionCreators = (
  dispatch: React.Dispatch<IAction>,
  getState: () => IAppState,
  actionCreators: IActionCreators,
) => {
  const connectedActionCreators: IConnectedActionCreators = {}

  for (let name in actionCreators) {
    if (actionCreators.hasOwnProperty(name)) {
      connectedActionCreators[name] = (...args) =>
        actionCreators[name]({dispatch, getState}, ...args)
    }
  }

  return connectedActionCreators
}

export const useAppState = () => React.useContext(AppStateContext)
