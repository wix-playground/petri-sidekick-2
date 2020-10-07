import * as React from 'react'
import {Typeahead} from 'react-bootstrap-typeahead'
import s from './search.module.css'
import {getSearchQueries} from '../../commons/localStorage'
import {Login} from '../login/login'
import {usePetriExperiments} from '../../hooks/petriExperiments/usePetriExperiments'
import {Loader} from '../loader/loader'
import {useLogin} from '../../hooks/login/useLogin'
import {IExperiment} from '../../commons/petri'
import {useActiveExperiments} from '../../hooks/activeExperiments/useActiveExperiments'
import {ExperimentInfo} from '../experiment-info/experiment-info'
import {useTabs} from '../../hooks/tabs/useTabs'
import {TAB} from '../../hooks/tabs/tabsReducer'

let resultTimeout: NodeJS.Timeout

const SEARCH_DEBOUNCE_TIMEOUT = 400

export const Search = () => {
  const element = React.useRef<any>()

  const {
    loaded,
    loadPetriExperimentsIfNeeded,
    petriExperiments,
  } = usePetriExperiments()

  const {activeExperiments} = useActiveExperiments()

  const {authenticated, ready} = useLogin()
  const [experiment, setExperiment] = React.useState<IExperiment>()
  const [inputQuery, setInputQuery] = React.useState<string>('')

  const {activeTab} = useTabs()

  React.useEffect(() => {
    if (activeTab === TAB.SEARCH && element?.current) {
      setTimeout(() => {
        element.current?.focus()
      }, 400)
    }
  }, [activeTab, ready, authenticated, loaded])

  React.useEffect(() => {
    if (authenticated) {
      loadPetriExperimentsIfNeeded()
    }
    // eslint-disable-next-line
  }, [authenticated])

  const showResult = (query: string = inputQuery) => {
    resultTimeout && clearTimeout(resultTimeout)

    const result =
      findExperiment(query, activeExperiments) ||
      findExperiment(query, petriExperiments)

    result && setExperiment(result)
    setInputQuery(query)
  }

  const debouncedShowResult = (query: string) => {
    resultTimeout && clearTimeout(resultTimeout)
    resultTimeout = setTimeout(() => showResult(query), SEARCH_DEBOUNCE_TIMEOUT)
  }

  React.useEffect(() => {
    if (activeTab === TAB.SEARCH) {
      showResult()
    } else {
      setExperiment(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  if (!ready) {
    return <Loader text={'Connecting...'} />
  }

  if (!authenticated) {
    return <Login />
  }

  if (!loaded) {
    return <Loader text={'Loading experiments...'} />
  }

  const keyDownHandler = (e: Event) => {
    if ((e as KeyboardEvent).key === 'Enter' && element.current) {
      setTimeout(() => {
        element.current?.blur()
      })
      // TODO: mark that override needs to focus
    } else {
      e.stopPropagation()
    }
  }

  return (
    <>
      <div className={s.input}>
        <Typeahead
          onKeyDown={keyDownHandler}
          ref={element}
          placeholder="Type experiment spec name here"
          options={getSearchQueries()}
          ignoreDiacritics={false}
          highlightOnlyResult
          onChange={([query]) => showResult(query)}
          onInputChange={(query: string) => debouncedShowResult(query)}
        />
      </div>
      {experiment && (
        <div className={s.result} key={experiment?.specName ?? '-'}>
          <ExperimentInfo experiment={experiment} />
        </div>
      )}
    </>
  )
}

const findExperiment = (specName: string, experiments: IExperiment[]) =>
  experiments.find(item => item.specName === specName)
