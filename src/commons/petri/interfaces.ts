export enum EPetriExperimentType {
  FEATURE_TOGGLE = 'featureToggle',
  AB_TEST = 'abTest',
}

export enum EPetriExperimentState {
  ACTIVE = 'active',
  ENDED = 'ended',
  PAUSED = 'paused',
  FUTURE = 'future',
  UNKNOWN = 'unknown',
}

export enum EXPERIMENT_STATE {
  ON = 'on',
  OFF = 'off',
  AUTO = 'auto',
  CUSTOM = 'custom',
}

export interface IPetriExperimentData {
  name: string
  type: EPetriExperimentType
  creator: string
  scope: string
  state: EPetriExperimentState
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

export interface IPetriAggregatedData {
  scopes: string[]
  state: EPetriExperimentState
  pointsOfContact: string[]
  options: string[]
}

export interface IExperiment {
  specName: string
  type: EPetriExperimentType
  state?: EXPERIMENT_STATE
  customState?: string
  petriData?: IPetriAggregatedData
}

export type IExperimentCookieDataItem = [string, string]

export type IExperimentCookieData = IExperimentCookieDataItem[]

export type IExperimentMap = {[spec: string]: IExperiment}
