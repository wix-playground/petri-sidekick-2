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
import {FOCUS_DELAY} from '../../commons/constants'
import {NoInfo} from '../no-info/no-info'
import {useCachedTyping} from '../../hooks/cachedTyping/useCachedTyping'

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
  const {text, disableCachedTyping, resetCachedTyping} = useCachedTyping()

  React.useEffect(() => {
    if (activeTab === TAB.SEARCH && element?.current) {
      const flushAndFocus = () => {
        element.current?.focus()
        resetCachedTyping()
        disableCachedTyping()
      }

      if (text) {
        flushAndFocus()
      } else {
        // When switching by clicking on tab - immediate focus does not work
        setTimeout(() => {
          flushAndFocus()
        }, FOCUS_DELAY)
      }
    }
    // eslint-disable-next-line
  }, [activeTab, ready, authenticated, loaded])

  React.useEffect(() => {
    if (authenticated) {
      loadPetriExperimentsIfNeeded()
    }
    // eslint-disable-next-line
  }, [authenticated])

  const showResult = React.useCallback(
    (query: string = inputQuery, noFocusChange = false) => {
      const result =
        findExperiment(query, activeExperiments) ||
        findExperiment(query, petriExperiments)

      if (result) {
        setExperiment(result)
      } else {
        setExperiment(undefined)
      }

      if (!noFocusChange) {
        setTimeout(() => {
          element.current?.blur()
          result && focusOverrideInput()
        })
      }

      setInputQuery(query)
    },
    [activeExperiments, petriExperiments, focusOverrideInput, inputQuery],
  )

  const handleChange = (query: string) => {
    setInputQuery(query)
  }

  React.useEffect(() => {
    showResult(undefined, true)
    // eslint-disable-next-line
  }, [activeExperiments])

  React.useEffect(() => {
    if (activeTab === TAB.SEARCH) {
      showResult(undefined, true)
    } else {
      setExperiment(undefined)
    }
    // eslint-disable-next-line
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
    // FIXME: clicking enter on partial result like "spec" causes blur
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
          onMenuHide={showResult}
          onBlur={() => showResult()}
          onChange={([query]) => {
            query && handleChange(query)
          }}
          onInputChange={handleChange}
          defaultInputValue={text}
        />
      </div>
      {!experiment && inputQuery && (
        <NoInfo
          message={`Could not find your experiment...`}
          buttonName="Update"
        />
      )}
      {experiment && (
        <div className={s.result}>
          <ExperimentInfo experiment={experiment} />
        </div>
      )}
    </>
  )
}

const findExperiment = (specName: string, experiments: IExperiment[]) =>
  experiments.find(item => item.specName === specName)
