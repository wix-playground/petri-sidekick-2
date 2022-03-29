import {filterUnique, filterEmpty} from '../arrays'
import {API_ADDRESS} from '../constants'
import {
  EPetriExperimentState,
  IExperiment,
  IExperimentMap,
  IPetriExperimentData,
  IPetriAggregatedData,
} from './interfaces'

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
  const GET_EXPERIMENTS_LIMIT = 4000
  const GET_EXPERIMENTS_TIMEOUT = 0
  const GET_EXPERIMENTS_SLOW_FAIL_TIMEOUT = 1000
  const GET_EXPERIMENTS_FAIL_TIMEOUT = 1000
  const SINGLE_EXPERIMENT_RETRIES = 2
  const SINGLE_EXPERIMENT_SKIP_RETRIES = 100
  const RETRY_DIVIDER = 4
  const RETRIES_BEFORE_INCREASE = RETRY_DIVIDER - 1

  let offset = 0
  let map: IExperimentMap = {}

  let currentLimit = GET_EXPERIMENTS_LIMIT
  let retries = SINGLE_EXPERIMENT_RETRIES
  let skipRetries = SINGLE_EXPERIMENT_SKIP_RETRIES
  let failed = false
  let gotNewData = false
  let retriesBeforeIncrease = RETRIES_BEFORE_INCREASE

  do {
    failed = false
    gotNewData = false

    try {
      const data = (await get(
        `/v1/ExperimentSearch?limit=${currentLimit}&offset=${offset}`,
      )) as IPetriExperimentData[]

      if (data.length) {
        gotNewData = true
      }

      offset += currentLimit

      if (!retriesBeforeIncrease) {
        currentLimit = Math.min(
          GET_EXPERIMENTS_LIMIT,
          currentLimit * RETRY_DIVIDER,
        )
      }

      retries = SINGLE_EXPERIMENT_RETRIES
      skipRetries = SINGLE_EXPERIMENT_SKIP_RETRIES

      map = mapExperiments(map, data)

      await new Promise(resolve => setTimeout(resolve, GET_EXPERIMENTS_TIMEOUT))

      if (retriesBeforeIncrease) {
        retriesBeforeIncrease--
      }
    } catch (e) {
      failed = true
      retriesBeforeIncrease = RETRIES_BEFORE_INCREASE

      if (currentLimit > 1) {
        currentLimit = Math.ceil(currentLimit / RETRY_DIVIDER)
      } else {
        if (retries) {
          retries--
        } else {
          offset += currentLimit
          skipRetries--
          retries = SINGLE_EXPERIMENT_RETRIES
        }
      }

      if (!(skipRetries + 1)) {
        return []
      }

      const minimumLimit = currentLimit === 1

      await new Promise(resolve =>
        setTimeout(
          resolve,
          minimumLimit
            ? GET_EXPERIMENTS_SLOW_FAIL_TIMEOUT
            : GET_EXPERIMENTS_FAIL_TIMEOUT,
        ),
      )
    }
  } while (gotNewData || failed)

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
