import * as React from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import s from './no-info.module.css'
import {usePetriExperiments} from '../../hooks/petriExperiments/usePetriExperiments'
import {TEST_ID} from '../../commons/test-ids'

export interface INoInfoProps {
  message: string
  buttonName: string
}

export const NoInfo: React.FC<INoInfoProps> = ({message, buttonName}) => {
  const {reloadPetriExperiments} = usePetriExperiments()

  return (
    <div data-testid={TEST_ID.NO_INFO}>
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
    </div>
  )
}
