import * as React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import s from './list.module.css'
import {IExperiment} from '../../commons/petri'
import {useLogin} from '../../hooks/login/useLogin'
import {Loader} from '../loader/loader'
import {Login} from '../login/login'
import Button from 'react-bootstrap/Button'
import {usePetriExperiments} from '../../hooks/petriExperiments/usePetriExperiments'
import {Experiment} from '../experiment/experiment'
import {ListActions} from './actions/list-actions'

export interface IListProps {
  experiments: IExperiment[]
  emptyText: React.ReactNode
}

export const List: React.FC<IListProps> = ({experiments, emptyText}) => {
  const {authenticated, ready} = useLogin()
  const {reloadPetriExperiments, loaded} = usePetriExperiments()

  return (
    <Accordion className={s.list}>
      {!experiments.length && (
        <Alert className={s.empty} variant={'light'}>
          {emptyText}
        </Alert>
      )}
      {experiments.map((experiment, index) => (
        <Card className={s.item}>
          <Accordion.Toggle as={Card.Header} eventKey={experiment.specName}>
            <div className={s.specName}>{experiment.specName}</div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={experiment.specName}>
            <Card.Body className={s.experimentCard}>
              {experiment.petriData ? (
                <Experiment experiment={experiment} />
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
      ))}
    </Accordion>
  )
}
