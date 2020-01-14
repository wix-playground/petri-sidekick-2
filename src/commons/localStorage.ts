const SEARCH_MEMORY = 'SEARCH_MEMORY'

interface ISearchMemory {
  [query: string]: number
}

const setValue = (key: string, value: any) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {}
}

const getValue = (key: string) => {
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
    for (let existentQuery of memory) {
      memory[existentQuery]--
    }

    memory[query] = 1
  }

  const memoryEntries = Object.entries(memory)

  memoryEntries.sort((a, b) => Number(b[1]) - Number(a[1]))

  const result: ISearchMemory = {}

  for (let i = 0; i < 20; i++) {
    if (memoryEntries[i]) {
      result[memoryEntries[i][0]] = Number(memoryEntries[i][1])
    } else {
      break
    }
  }

  setValue(SEARCH_MEMORY, result)
}

export const getSearchQueries = () =>
  Object.keys(getValue(SEARCH_MEMORY) || {specs: 1})
