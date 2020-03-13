import {IExperiment} from '../hooks/activeExperiments/activeExperimentsReducer'

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
    console.log('Fetching')
    get('/v1/Experiments')
      .then(experiments => {
        console.log({experiments})
        resolve(experiments as any)
      })
      .catch(e => {
        console.log(e)
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
