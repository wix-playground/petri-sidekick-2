import * as React from 'react'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import s from './login.module.css'
import {Loader} from '../loader/loader'
import {useLogin} from '../../hooks/login/useLogin'

export const Login: React.FC = () => {
  const {inProgress, login} = useLogin()

  if (inProgress) {
    return <Loader text={'Checking identity...'} />
  }

  return (
    <Alert className={s.login} variant={'light'}>
      <div>You need to login and re-open to continue.</div>
      <Button variant="primary" className={s.button} onClick={login}>
        Login
      </Button>
    </Alert>
  )
}
