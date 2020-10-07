import * as React from 'react'
import {IExperiment} from '../../commons/petri'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import {ExperimentInfo} from '../experiment-info/experiment-info'
import {Loader} from '../loader/loader'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import {Login} from '../login/login'
import {ListActions} from '../actions/actions'
import {useLogin} from '../../hooks/login/useLogin'
import {usePetriExperiments} from '../../hooks/petriExperiments/usePetriExperiments'
import s from './experiment-card.module.css'
import {useCards} from '../../hooks/cards/useCards'

export interface ICardProps {
  experiment: IExperiment
}

export const ExperimentCard: React.FC<any> = ({experiment}) => {
  const {authenticated, ready} = useLogin()
  const {reloadPetriExperiments, loaded} = usePetriExperiments()
  const {toggleCard} = useCards()

  return (
    <Card className={s.item}>
      <Accordion.Toggle
        as={Card.Header}
        eventKey={experiment.specName}
        onClick={() => {
          toggleCard(experiment.specName)
        }}
      >
        <div className={s.specName}>{experiment.specName}</div>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={experiment.specName}>
        <Card.Body className={s.experimentCard}>
          {experiment.petriData ? (
            <ExperimentInfo experiment={experiment} />
          ) : !ready ? (
            <div className={s.loading}>
              <Loader text={'Connecting...'} />
            </div>
          ) : authenticated ? (
            !loaded ? (
              <div className={s.loading}>
                <Loader text={'Loading experiments...'} />
              </div>
            ) : (
              <Alert className={s.emptyItem} variant={'light'}>
                <div>More detailed information is not loaded</div>
                <Button
                  variant="primary"
                  className={s.refresh}
                  onClick={reloadPetriExperiments}
                >
                  Update
                </Button>
              </Alert>
            )
          ) : (
            <div className={s.login}>
              <Login />
            </div>
          )}
        </Card.Body>
      </Accordion.Collapse>
      {experiment.state && <ListActions experiment={experiment} />}
    </Card>
  )
}
