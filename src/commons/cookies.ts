import {IExperimentCookieData} from './petri/interfaces'
import {EXPERIMENTS_COOKIE_NAME, EXPERIMENTS_DOMAINS} from './constants'
export const setCookie = (
  name: string,
  value: string,
  domain: string,
  secure = true,
) =>
  new Promise(resolve => {
    const protocol = secure ? 'https:' : 'http:'
    const url = `${protocol}//${domain.replace(/^\./, '')}/`

    if (value) {
      const options = {
        url,
        name,
        value,
        domain,
        path: '/',
        secure,
        httpOnly: false,
        sameSite: secure ? 'no_restriction' : 'unspecified',
        expirationDate: Math.floor(Date.now() / 1000) + 3600 * 24 * 7, //week
      }

      chrome.cookies.set(options, resolve)
    } else {
      chrome.cookies.remove({url, name}, resolve)
    }
  })

export const getExperimentsFromCookies = (): Promise<IExperimentCookieData> =>
  new Promise(resolve => {
    chrome.cookies.getAll(
      {
        name: EXPERIMENTS_COOKIE_NAME,
      },
      cookies => {
        resolve(
          cookies
            .filter(cookie => EXPERIMENTS_DOMAINS.includes(cookie.domain))
            .flatMap(cookie => cookie.value.split('|'))
            .filter(item => item.length)
            .map(item => item.split('#'))
            .filter(
              (item, index, arr) =>
                arr.findIndex(nextItem => nextItem[0] === item[0]) === index,
            ) as IExperimentCookieData,
        )
      },
    )
  })
