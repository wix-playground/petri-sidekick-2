import {filterUnique, filterEmpty} from './arrays'
const API_ADDRESS = 'https://bo.wix.com/_api/wix-petri-webapp'

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

export const login = () => {
  chrome.runtime.sendMessage({
    type: 'LOGIN',
  })
}

export const loggedIn = (): Promise<boolean> =>
  new Promise(async resolve => {
    get('/v1/languages')
      .then(() => {
        resolve(true)
      })
      .catch(e => {
        resolve(false)
      })
  })

export const getExperiments = async (): Promise<IExperiment[]> => {
  const GET_EXPERIMENTS_LIMIT = 1000
  const GET_EXPERIMENTS_TIMEOUT = 100

  let offset = 0
  let lastAmount = 0
  let newAmount = 0
  let map: IExperimentMap = {}

  do {
    lastAmount = newAmount
    try {
      const data = await get(
        `/v1/ExperimentSearch?query=&limit=${GET_EXPERIMENTS_LIMIT}&offset=${offset}`,
      )
      offset += GET_EXPERIMENTS_LIMIT
      map = mapExperiments(map, data as IPetriExperimentData[])
      newAmount = Object.keys(map).length
    } catch (e) {
      return []
    }

    if (newAmount > lastAmount) {
      await new Promise(resolve => setTimeout(resolve, GET_EXPERIMENTS_TIMEOUT))
    }
  } while (newAmount > lastAmount)

  return Object.values(map)
}

const mapExperiments = (
  map: {[spec: string]: IExperiment},
  petriExperiments: IPetriExperimentData[],
): IExperimentMap => {
  const statePriorities = [
    EPetriExperimentState.ACTIVE,
    EPetriExperimentState.FUTURE,
    EPetriExperimentState.PAUSED,
    EPetriExperimentState.ENDED,
    EPetriExperimentState.UNKNOWN,
  ].reverse()

  petriExperiments.forEach(petriExperiment => {
    const experiment = map[petriExperiment.key] || {}
    const petriData = (experiment.petriData || {}) as IPetriAggregatedData
    const scopes = petriData.scopes || []
    const state = petriData.state || EPetriExperimentState.UNKNOWN
    const pointsOfContact = petriData.pointsOfContact || []
    const options = petriData.options || []

    map[petriExperiment.key] = {
      ...experiment,
      specName: petriExperiment.key,
      petriData: {
        ...petriData,
        scopes: filterUnique([...scopes, ...petriExperiment.scope.split(',')]),
        state:
          statePriorities.indexOf(state) <
          statePriorities.indexOf(
            petriExperiment.state as EPetriExperimentState,
          )
            ? (petriExperiment.state as EPetriExperimentState)
            : state,
        pointsOfContact: filterEmpty(
          filterUnique([
            ...pointsOfContact,
            petriExperiment.creator,
            petriExperiment.updater,
          ]),
        ),
        options: filterUnique([
          ...options,
          ...petriExperiment.groups.map(group => group.value),
        ]),
      },
    }
  })

  return map
}

const get = (path: string) =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: 'GET',
        payload: {
          url: API_ADDRESS + path,
        },
      },
      response => {
        if (response.error) {
          reject()
        } else {
          resolve(response.payload)
        }
      },
    )
  })

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

export type IExperimentMap = {[spec: string]: IExperiment}

export const EXPERIMENT_STATE_ON = 'ON'
export const EXPERIMENT_STATE_OFF = 'OFF'
export const EXPERIMENT_STATE_AUTO = 'AUTO'
