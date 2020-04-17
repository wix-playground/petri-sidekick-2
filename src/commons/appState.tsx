import * as React from 'react'
import {reduceActiveExperiments} from '../hooks/activeExperiments/activeExperimentsReducer'
import {reducePetriExperiments} from '../hooks/petriExperiments/petriExperimentsReducer'
import {
  defaultPetriExperimentsState,
  IPetriExperimentsState,
} from '../hooks/petriExperiments/petriExperimentsReducer'
import {
  IActiveExperimentsState,
  defaultActiveExperimentsState,
} from '../hooks/activeExperiments/activeExperimentsReducer'
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

export interface IActionCreatorContext {
  dispatch: React.Dispatch<IAction>
  getState: () => IAppState
}

export type IActionCreator = (
  context: IActionCreatorContext,
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
  activeExperiments: IActiveExperimentsState
  petriExperiments: IPetriExperimentsState
}

export interface IAppStateContext {
  state: IAppState
  getState: () => IAppState
  dispatch: React.Dispatch<IAction>
}

const defaultState = {
  tabs: defaultTabsState,
  activeExperiments: defaultActiveExperimentsState,
  petriExperiments: defaultPetriExperimentsState,
}

const getDefaultState = (): IAppState => defaultState

export const AppStateContext: React.Context<IAppStateContext> = React.createContext(
  {
    state: defaultState,
    getState: getDefaultState,
    dispatch: (state) => state,
  } as IAppStateContext,
)

export const reducer = (state: IAppState, action: IAction): IAppState => ({
  tabs: reduceTabs(state.tabs, action),
  activeExperiments: reduceActiveExperiments(state.activeExperiments, action),
  petriExperiments: reducePetriExperiments(state.petriExperiments, action),
})

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
