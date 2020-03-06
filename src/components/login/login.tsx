import * as React from 'react'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import s from './login.module.css'
import {login} from '../../commons/petri'

export const Login: React.FC = () => {
  const [inProgress, setInProgress] = React.useState(false)

  const handleClick = () => {
    setInProgress(true)
    login()
  }

  if (inProgress) {
    return (
      <div className={s.loader}>
        <div className={s.spinner}>
          <Spinner animation="border" />
        </div>
        <span>Checking identity...</span>
      </div>
    )
  }

  return (
    <Alert className={s.login} variant={'light'}>
      <div>You need to login and re-open to continue.</div>
      <Button variant="primary" className={s.button} onClick={handleClick}>
        Login
      </Button>
    </Alert>
  )
}
