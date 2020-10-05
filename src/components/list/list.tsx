import * as React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Alert from 'react-bootstrap/Alert'
import s from './list.module.css'
import {Delete} from './delete/delete'
import {
  EXPERIMENT_STATE,
  IExperiment,
  EPetriExperimentState,
} from '../../commons/petri'
import classNames from 'classnames'
import {useLogin} from '../../hooks/login/useLogin'
import {Loader} from '../loader/loader'
import {Login} from '../login/login'
import Button from 'react-bootstrap/Button'
import {usePetriExperiments} from '../../hooks/petriExperiments/usePetriExperiments'

export interface IListProps {
  experiments: IExperiment[]
  emptyText: React.ReactNode
}

export const List = ({experiments, emptyText}: IListProps) => {
  const {authenticated, ready} = useLogin()
  const {reloadPetriExperiments, loaded} = usePetriExperiments()

  const getDropdownVariant = (experiment: IExperiment) => {
    switch (experiment.state) {
      case EXPERIMENT_STATE.ON:
        return 'success'
      case EXPERIMENT_STATE.OFF:
        return 'danger'
      case EXPERIMENT_STATE.CUSTOM:
        return 'warning'
      default:
        return 'primary'
    }
  }

  const getDropdownValue = (experiment: IExperiment) => {
    switch (experiment.state) {
      case EXPERIMENT_STATE.ON:
        return 'On'
      case EXPERIMENT_STATE.OFF:
        return 'Off'
      case EXPERIMENT_STATE.CUSTOM:
        return 'Custom'
      default:
        return 'Auto'
    }
  }

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
                <Card border="light">
                  <Card.Body>
                    <Card.Title>{experiment.specName}</Card.Title>
                    <Card.Subtitle
                      className={classNames(
                        'mb-2 text-muted',
                        s.experimentCardSubtitle,
                      )}
                    >
                      {experiment.petriData.scopes.join(', ')}
                    </Card.Subtitle>
                    <Card.Text>
                      <p className={s.pointsOfContact}>
                        {experiment.petriData.pointsOfContact.map(
                          (item, index) => (
                            <>
                              {Boolean(index) && ', '}
                              <a
                                href={`mailto:${item}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item}
                              </a>
                            </>
                          ),
                        )}
                      </p>
                      <p>
                        {experiment.petriData.state ===
                          EPetriExperimentState.ACTIVE && (
                          <Badge variant="success">
                            {experiment.petriData.state}
                          </Badge>
                        )}
                        {experiment.petriData.state ===
                          EPetriExperimentState.ENDED && (
                          <Badge variant="danger">
                            {experiment.petriData.state}
                          </Badge>
                        )}
                        {experiment.petriData.state ===
                          EPetriExperimentState.FUTURE && (
                          <Badge variant="primary">
                            {experiment.petriData.state}
                          </Badge>
                        )}
                        {experiment.petriData.state ===
                          EPetriExperimentState.PAUSED && (
                          <Badge variant="warning">
                            {experiment.petriData.state}
                          </Badge>
                        )}
                      </p>
                    </Card.Text>
                  </Card.Body>
                </Card>
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
          {experiment.state && (
            <>
              <DropdownButton
                id={`experiment_${index}`}
                size="sm"
                drop="left"
                className={s.actions}
                title={getDropdownValue(experiment)}
                variant={getDropdownVariant(experiment)}
              >
                {experiment.state !== EXPERIMENT_STATE.AUTO && (
                  <Dropdown.Item eventKey="auto">Reset</Dropdown.Item>
                )}
                {experiment.state !== EXPERIMENT_STATE.CUSTOM &&
                  !Object.is(experiment.customState, undefined) && (
                    <Dropdown.Item eventKey="auto">Custom</Dropdown.Item>
                  )}
                {experiment.state !== EXPERIMENT_STATE.ON &&
                  Object.is(experiment.customState, undefined) && (
                    <Dropdown.Item eventKey="on">Enable</Dropdown.Item>
                  )}
                {experiment.state !== EXPERIMENT_STATE.OFF &&
                  Object.is(experiment.customState, undefined) && (
                    <Dropdown.Item eventKey="off">Disable</Dropdown.Item>
                  )}
              </DropdownButton>
              <Delete />
            </>
          )}
        </Card>
      ))}
    </Accordion>
  )
}
