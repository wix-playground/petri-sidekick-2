import * as React from 'react'
import {Typeahead} from 'react-bootstrap-typeahead'
import s from './search.module.css'
import {getSearchQueries} from '../../commons/localStorage'
import {Login} from '../login/login'
import {usePetriExperiments} from '../../hooks/petriExperiments/usePetriExperiments'
import {Loader} from '../loader/loader'
import {useLogin} from '../../hooks/login/useLogin'
import {IExperiment} from '../../commons/petri'
import Accordion from 'react-bootstrap/Accordion'
import {ExperimentCard} from '../experiment-card/experiment-card'
import {useActiveExperiments} from '../../hooks/activeExperiments/useActiveExperiments'
import {ExperimentInfo} from '../experiment-info/experiment-info'

let resultTimeout: NodeJS.Timeout

const SEARCH_DEBOUNCE_TIMEOUT = 400

export const Search = () => {
  const {
    loaded,
    loadPetriExperimentsIfNeeded,
    petriExperiments,
  } = usePetriExperiments()

  const {activeExperiments} = useActiveExperiments()

  const {authenticated, ready} = useLogin()
  const [experiment, setExperiment] = React.useState<IExperiment>()
  const [query, setQuery] = React.useState<string>('')

  React.useEffect(() => {
    if (authenticated) {
      loadPetriExperimentsIfNeeded()
    }
    // eslint-disable-next-line
  }, [authenticated])

  if (!ready) {
    return <Loader text={'Connecting...'} />
  }

  if (!authenticated) {
    return <Login />
  }

  if (!loaded) {
    return <Loader text={'Loading experiments...'} />
  }

  const showResult = (query: string) => {
    resultTimeout && clearTimeout(resultTimeout)

    const result =
      findExperiment(query, activeExperiments) ||
      findExperiment(query, petriExperiments)

    result && setExperiment(result)
    setQuery(query)
  }

  const debouncedShowResult = (query: string) => {
    resultTimeout && clearTimeout(resultTimeout)
    resultTimeout = setTimeout(() => showResult(query), SEARCH_DEBOUNCE_TIMEOUT)
  }

  return (
    <>
      <div className={s.input}>
        <Typeahead
          placeholder="Type experiment spec name here"
          options={getSearchQueries()}
          ignoreDiacritics={false}
          caseSensitive
          onChange={([query]) => showResult(query)}
          onInputChange={(query: string) => debouncedShowResult(query)}
        />
      </div>
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
