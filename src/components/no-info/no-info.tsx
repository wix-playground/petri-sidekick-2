import * as React from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import s from './no-info.module.css'
import {usePetriExperiments} from '../../hooks/petriExperiments/usePetriExperiments'

export interface INoInfoProps {
  message: string
  buttonName: string
}

export const NoInfo: React.FC<INoInfoProps> = ({message, buttonName}) => {
  const {reloadPetriExperiments} = usePetriExperiments()

  return (
    <Alert className={s.emptyItem} variant={'light'}>
      <div>{message}</div>
      <Button
        variant="primary"
        className={s.refresh}
        onClick={reloadPetriExperiments}
      >
        {buttonName}
      </Button>
    </Alert>
  )
}
