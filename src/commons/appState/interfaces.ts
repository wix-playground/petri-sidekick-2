import {defaultState} from './state'

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

export interface IAppStateContext {
  state: IAppState
  getState: () => IAppState
  dispatch: React.Dispatch<IAction>
}

export type IAppState = typeof defaultState
