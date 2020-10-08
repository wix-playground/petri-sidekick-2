import {
  EXPERIMENTS_COOKIE_NAME,
  EXPERIMENTS_DOMAINS,
} from '../src/commons/constants'

export const chrome = {
  cookies: {
    getAll: jest.fn(
      (config: any, cb: (cookies: chrome.cookies.Cookie[]) => void) => {
        cb([
          {
            name: EXPERIMENTS_COOKIE_NAME,
            domain: EXPERIMENTS_DOMAINS[0],
            storeId: '',
            session: false,
            path: '',
            value: 'multiValueExperiment#new|booleanExperiment#true',
            hostOnly: false,
            httpOnly: false,
            secure: true,
          },
          {
            name: EXPERIMENTS_COOKIE_NAME,
            domain: EXPERIMENTS_DOMAINS[1],
            storeId: '',
            session: false,
            path: '',
            value: 'differentDomainExperiment#true',
            hostOnly: false,
            httpOnly: false,
            secure: true,
          },
        ])
      },
    ),
  },
  browserAction: {
    setBadgeText: jest.fn(),
  },
}
