const API_ADDRESS = 'https://bo.wix.com/_api/wix-petri-webapp'

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
        resolve(
          (experiments as IPetriExperimentData[]).map(
            (experiment: IPetriExperimentData): IExperiment => ({
              specName: experiment.key,
              petriData: experiment,
            }),
          ),
        )
      })
      .catch(e => {
        resolve([])
      })
  })

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
  petriData?: IPetriExperimentData
}

export const EXPERIMENT_STATE_ON = 'ON'
export const EXPERIMENT_STATE_OFF = 'OFF'
export const EXPERIMENT_STATE_AUTO = 'AUTO'
