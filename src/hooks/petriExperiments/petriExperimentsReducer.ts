import {IAction} from '../../commons/appState'
import {ACTION_LOAD_PETRI_EXPERIMENTS} from './petriExperimentsActions'
export enum EXPERIMENT_STATE {
  ON = 'on',
  OFF = 'off',
  AUTO = 'auto',
}

export interface IPetriExperimentData {
  name: string
  type: string
  creator: string
  scope: string
  state: string
  id: number
  lastUpdated: number // timestamp
  key: string // spec
  specKey: boolean
  creationDate: number // timestamp
  description: string
  updater: string
  comment: string
  startDate: number // timestamp
  endDate: number // timestamp
  paused: boolean
  groups: any[]
  editable: boolean
  wixUsers: boolean
  nonWixUsers: boolean
  allRegistered: boolean
  newRegistered: boolean
  nonRegistered: boolean
  anonymous: boolean
  excludeGeo: boolean
  geo: any[]
  languages: any[]
  hosts: any[]
  excludePlatforms: any[]
  excludeVersion: any[]
  excludeArtifacts: any[]
  includeGuids: any[]
  excludeGuids: any[]
  parentStartTime: number // timestamp
  includeUserAgentRegexes: any[]
  excludeUserAgentRegexes: any[]
  excludeUserGroups: any[]
  includeProfileAttributes: any[]
  excludeProfileAttributes: any[]
  includeActiveGroups: any[]
  excludeActiveGroups: any[]
  includeDateIntervals: any[]
  excludeDateIntervals: any[]
  originalId: number
  linkId: number
  excludeMetaSiteIds: boolean
  metaSiteIds: any[]
  conductLimit: number
  forRegisteredUsers: boolean
  allowedForBots: boolean
  allowedForVips: boolean
  persistent: boolean
  includeUserBuckets: any[]
  artifacts: any[]
  version: any[]
  platforms: any[]
}

export interface IExperiment {
  specName: string
  state?: EXPERIMENT_STATE
  actualState?: EXPERIMENT_STATE
  petriData: IPetriExperimentData
}

export interface IPetriExperimentsState {
  list: IExperiment[]
  loaded: boolean
}

export const defaultPetriExperimentsState: IPetriExperimentsState = {
  list: [],
  loaded: false,
}

export const reducePetriExperiments = (
  state: IPetriExperimentsState,
  action: IAction,
): IPetriExperimentsState => {
  switch (action.type) {
    case ACTION_LOAD_PETRI_EXPERIMENTS:
      return {
        ...state,
        list: action.payload.map(
          (experiment: IPetriExperimentData): IExperiment => ({
            specName: experiment.key,
            state: EXPERIMENT_STATE.AUTO, // TODO: this is currently not used here
            actualState: EXPERIMENT_STATE.AUTO, // TODO: this is currently not used here
            petriData: experiment,
          }),
        ),
        loaded: true,
      }
    default:
      return state
  }
}
