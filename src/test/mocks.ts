import {API_ADDRESS} from '../commons/constants'
import {
  IPetriExperimentData,
  EPetriExperimentType,
  EPetriExperimentState,
} from '../commons/petri/interfaces'
import {
  EXPERIMENTS_COOKIE_NAME,
  EXPERIMENTS_DOMAINS,
} from '../commons/constants'

export interface ICookieConfig {
  [domain: string]: IExperimentConfig
}

export interface IExperimentConfig {
  [experimentName: string]: string
}

export interface IGetChromeMockOptions {
  cookieConfig?: ICookieConfig
}

export const defaultCookieConfig: ICookieConfig = {
  [EXPERIMENTS_DOMAINS[0]]: {
    multiValueExperiment: 'new',
    booleanExperiment: 'true',
  },
  [EXPERIMENTS_DOMAINS[1]]: {
    differentDomainExperiment: 'true',
  },
}

export const getChromeMock = ({
  cookieConfig = defaultCookieConfig,
}: IGetChromeMockOptions = {}) => ({
  runtime: {
    sendMessage: jest.fn((message: any, cb: (response: any) => void) => {
      if (message.type === 'GET') {
        const responseMap = {
          [`${API_ADDRESS}/v1/ExperimentSearch?query=&limit=1000&offset=0`]: [
            getPetriExperimentDataMock('multiValueExperiment', ['old', 'new']),
            getPetriExperimentDataMock('booleanExperiment', ['true', 'false']),
            getPetriExperimentDataMock('differentDomainExperiment', [
              'true',
              'false',
            ]),
          ],
          [`${API_ADDRESS}/v1/ExperimentSearch?query=&limit=1000&offset=1000`]: [],
          [`${API_ADDRESS}/v1/languages`]: [],
        }

        if (responseMap[message.payload.url]) {
          cb({payload: responseMap[message.payload.url]})
        }
      } else if (message.type === 'GET_STORAGE') {
        switch (message.payload.key) {
          case 'experiments': {
            cb({payload: null})
            break
          }
        }
      }
    }),
  },
  cookies: {
    set: jest.fn((options, cb) => cb()),
    getAll: jest.fn(
      (config: any, cb: (cookies: chrome.cookies.Cookie[]) => void) => {
        const cookies: chrome.cookies.Cookie[] = Object.entries(
          cookieConfig,
        ).map(([domain, experimentConfig]) => {
          const value = Object.entries(experimentConfig)
            .map(
              ([experimentName, experimentValue]) =>
                `${experimentName}#${experimentValue}`,
            )
            .join('|')

          return {
            name: EXPERIMENTS_COOKIE_NAME,
            domain,
            storeId: '',
            session: false,
            path: '',
            value,
            hostOnly: false,
            httpOnly: false,
            secure: true,
          }
        })

        cb(cookies)
      },
    ),
  },
  tabs: {
    query: jest.fn((options, cb) => {
      cb([{id: 1}])
    }),
    reload: jest.fn(),
  },
  browserAction: {
    setBadgeText: jest.fn(),
  },
})

export const getPetriExperimentDataMock = (
  name: string,
  values: string[],
): IPetriExperimentData => {
  return {
    name,
    type: EPetriExperimentType.FEATURE_TOGGLE,
    creator: 'creator@wix.com',
    scope: 'scope1,scope2',
    state: EPetriExperimentState.ACTIVE,
    id: 1,
    lastUpdated: 0,
    key: name,
    specKey: true,
    creationDate: 0,
    description: '',
    updater: 'updater@wix.com',
    comment: '',
    startDate: 0,
    endDate: 0,
    paused: false,
    groups: values.map(value => ({
      value,
    })),
    editable: true,
    wixUsers: true,
    nonWixUsers: true,
    allRegistered: true,
    newRegistered: true,
    nonRegistered: true,
    anonymous: true,
    excludeGeo: false,
    geo: [],
    languages: [],
    hosts: [],
    excludePlatforms: [],
    excludeVersion: [],
    excludeArtifacts: [],
    includeGuids: [],
    excludeGuids: [],
    parentStartTime: 0,
    includeUserAgentRegexes: [],
    excludeUserAgentRegexes: [],
    excludeUserGroups: [],
    includeProfileAttributes: [],
    excludeProfileAttributes: [],
    includeActiveGroups: [],
    excludeActiveGroups: [],
    includeDateIntervals: [],
    excludeDateIntervals: [],
    originalId: 0,
    linkId: 0,
    excludeMetaSiteIds: false,
    metaSiteIds: [],
    conductLimit: 0,
    forRegisteredUsers: true,
    allowedForBots: true,
    allowedForVips: true,
    persistent: true,
    includeUserBuckets: [],
    artifacts: [],
    version: [],
    platforms: [],
  }
}
