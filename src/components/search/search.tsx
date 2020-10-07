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
import {useOverrideInput} from '../../hooks/overrideInput/useOverrideInput'
import {FOCUS_DELAY, DEBOUNCE_TIMEOUT} from '../../commons/constants'

let resultTimeout: NodeJS.Timeout

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
  const {focusOverrideInput} = useOverrideInput()

  React.useEffect(() => {
    if (activeTab === TAB.SEARCH && element?.current) {
      setTimeout(() => {
        element.current?.focus()
      }, FOCUS_DELAY)
    }
  }, [activeTab, ready, authenticated, loaded])

  React.useEffect(() => {
    if (authenticated) {
      loadPetriExperimentsIfNeeded()
    }
    // eslint-disable-next-line
  }, [authenticated])

  const showResult = (query: string = inputQuery, noFocusChange = false) => {
    resultTimeout && clearTimeout(resultTimeout)

    const result =
      findExperiment(query, activeExperiments) ||
      findExperiment(query, petriExperiments)

    if (result) {
      setExperiment(result)
      if (!noFocusChange) {
        setTimeout(() => {
          element.current?.blur()
          focusOverrideInput()
        })
      }
    }

    setInputQuery(query)
  }

  const debouncedShowResult = (query: string) => {
    resultTimeout && clearTimeout(resultTimeout)
    resultTimeout = setTimeout(() => showResult(query, true), DEBOUNCE_TIMEOUT)
  }

  React.useEffect(() => {
    if (activeTab === TAB.SEARCH) {
      showResult(undefined, true)
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
      showResult()
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
          onBlur={() => showResult()}
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
