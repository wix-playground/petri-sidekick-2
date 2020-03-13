import * as React from 'react'
import {Typeahead} from 'react-bootstrap-typeahead'
import Spinner from 'react-bootstrap/Spinner'
import s from './search.module.css'
import {getSearchQueries} from '../../commons/localStorage'
import {loggedIn} from '../../commons/petri'
import {Login} from '../login/login'
import {usePetriExperiments} from '../../hooks/petriExperiments/usePetriExperiments'

export const Search = () => {
  const {loaded, loadPetriExperiments} = usePetriExperiments()
  const [authenticated, setAuthenticated] = React.useState<boolean>(false)
  const [ready, setReady] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await loggedIn()
      setAuthenticated(isLoggedIn)
      setReady(true)

      if (isLoggedIn) {
        loadPetriExperiments()
      }
    }

    checkLogin()

    // eslint-disable-next-line
  }, [])

  if (!ready) {
    return (
      <div className={s.loader}>
        <div className={s.spinner}>
          <Spinner animation="border" />
        </div>
        <span>Connecting...</span>
      </div>
    )
  }

  if (!authenticated) {
    return <Login />
  }

  // TODO: externalize spinner into separate component

  if (!loaded) {
    return (
      <div className={s.loader}>
        <div className={s.spinner}>
          <Spinner animation="border" />
        </div>
        <span>Loading experiments...</span>
      </div>
    )
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
