import * as React from 'react'
import {Typeahead} from 'react-bootstrap-typeahead'
import s from './search.module.css'
import {getSearchQueries} from '../../commons/localStorage'
import {Login} from '../login/login'
import {usePetriExperiments} from '../../hooks/petriExperiments/usePetriExperiments'
import {Loader} from '../loader/loader'
import {useLogin} from '../../hooks/login/useLogin'

export const Search = () => {
  const {loaded, loadPetriExperimentsIfNeeded} = usePetriExperiments()
  const {authenticated, ready} = useLogin()

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

  return (
    <div className={s.input}>
      <Typeahead
        placeholder="Type experiment spec name here"
        options={getSearchQueries()}
        ignoreDiacritics={false}
        caseSensitive
      />
    </div>
  )
}
