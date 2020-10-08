import {IExperiment} from './petri'
import {filterUnique} from './arrays'

export const EXPERIMENTS_MEMORY = 'experiments'
export const ACTIVE_EXPERIMENTS_MEMORY = 'active-experiments'

const SEARCH_MEMORY = 'SEARCH_MEMORY'
const SEARCH_MEMORY_SIZE = 20

interface ISearchMemory {
  [query: string]: number
}

const storage: {[key: string]: any} = {}

export const setTemporaryValue = (key: string, value: any) => {
  storage[key] = value
}

export const getTemporaryValue = (key: string) => storage[key] ?? null

export const setRuntimeValue = (key: string, value: any) => {
  try {
    chrome.runtime.sendMessage({
      type: 'SET_STORAGE',
      payload: {
        key,
        value: JSON.stringify(value),
      },
    })
  } catch (e) {}
}

export const getRuntimeValue = (key: string): Promise<any> =>
  new Promise(resolve => {
    chrome.runtime.sendMessage(
      {
        type: 'GET_STORAGE',
        payload: {
          key,
        },
      },
      value => {
        resolve(JSON.parse(value.payload))
      },
    )
  })

export const setValue = (key: string, value: any) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {}
}

export const getValue = (key: string) => {
  if (!window.localStorage) {
    return null
  }

  const raw = window.localStorage.getItem(key)

  if (!raw) {
    return raw
  }

  try {
    return JSON.parse(raw as string)
  } catch (e) {
    return raw
  }
}

export const addSearchQuery = (query: string) => {
  const memory = getValue(SEARCH_MEMORY) || {}

  if (memory[query]) {
    memory[query]++
  } else {
    for (let existentQuery in memory) {
      memory[existentQuery]--
    }

    memory[query] = 1
  }

  const memoryEntries = Object.entries(memory)

  memoryEntries.sort((a, b) => Number(b[1]) - Number(a[1]))

  const result: ISearchMemory = {}

  for (let i = 0; i < SEARCH_MEMORY_SIZE; i++) {
    if (memoryEntries[i]) {
      result[memoryEntries[i][0]] = Number(memoryEntries[i][1])
    } else {
      break
    }
  }

  setValue(SEARCH_MEMORY, result)
}

export const getSearchQueries = () => {
  const suggestions = filterUnique([
    ...Object.keys(getValue(SEARCH_MEMORY) || {}),
    ...getExperimentSpecSuggestions(),
  ])

  return suggestions
}

const getExperimentSpecSuggestions = () => {
  const storedExperiments = getTemporaryValue(EXPERIMENTS_MEMORY) || []

  const objSuggestions = storedExperiments.reduce(
    (suggestionObject: {[spec: string]: any}, experiment: IExperiment) => {
      const specParts = experiment.specName.split('.')
      let currentSuggestion = ''

      specParts.forEach(part => {
        currentSuggestion += currentSuggestion.length ? `.${part}` : part
        suggestionObject[currentSuggestion] = 1
      })

      return suggestionObject
    },
    {},
  )

  return Object.keys(objSuggestions)
}
