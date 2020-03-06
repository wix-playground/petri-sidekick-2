import * as React from 'react'
import {Typeahead} from 'react-bootstrap-typeahead'
import Spinner from 'react-bootstrap/Spinner'
import s from './search.module.css'
import {getSearchQueries} from '../../commons/localStorage'
import {loggedIn} from '../../commons/petri'
import {Login} from '../login/login'

export const Search = () => {
  const [authenticated, setAuthenticated] = React.useState<boolean>(false)
  const [ready, setReady] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkLogin = async () => {
      setAuthenticated(await loggedIn())
      setReady(true)
    }

    checkLogin()
  })

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

  return (
    <div className={s.input}>
      <Typeahead
        placeholder="Type experiment spec name here"
        options={getSearchQueries()}
      />
    </div>
  )
}
