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

export const getExperiments = (): Promise<IExperiment[]> =>
  new Promise(async resolve => {
    get('/v1/Experiments')
      .then(experiments => {
        resolve(mapExperiments(experiments as IPetriExperimentData[]))
      })
      .catch(e => {
        resolve([])
      })
  })

const mapExperiments = (
  petriExperiments: IPetriExperimentData[],
): IExperiment[] => {
  const map: {[spec: string]: IExperiment} = {}

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

    // FIXME: experiments may have different groups!

    // groups: Array(2)
    // 0: {value: "0", chunk: 100, id: 1}
    // 1: {value: "1", chunk: 0, id: 2}

    // groups: Array(2)
    // 0: {value: "false", chunk: 100, id: 1}
    // 1: {value: "true", chunk: 0, id: 2}

    // if (petriExperiment.key === 'specs.events.ui.EventsPaidPlans') {
    //   console.log(petriExperiment)
    // }

    map[petriExperiment.key] = {
      ...experiment,
      specName: petriExperiment.key,
      petriData: {
        ...petriData,
        scopes: filterUnique([...scopes, petriExperiment.scope]),
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
      },
    }
  })

  const experiments: IExperiment[] = Object.values(map)

  return experiments
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
}

export interface IExperiment {
  specName: string
  type: EPetriExperimentType
  state?: EXPERIMENT_STATE
  actualState?: EXPERIMENT_STATE
  petriData?: IPetriAggregatedData
}

export const EXPERIMENT_STATE_ON = 'ON'
export const EXPERIMENT_STATE_OFF = 'OFF'
export const EXPERIMENT_STATE_AUTO = 'AUTO'
