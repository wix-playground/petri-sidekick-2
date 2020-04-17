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

export interface IListProps {
  experiments: IExperiment[]
  emptyText: React.ReactNode
}

export const List = ({experiments, emptyText}: IListProps) => {
  const getDropdownVariant = (experiment: IExperiment) => {
    switch (experiment.actualState) {
      case EXPERIMENT_STATE.ON:
        return 'success'
      case EXPERIMENT_STATE.OFF:
        return 'danger'
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
              {experiment.petriData && (
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
                {experiment.state !== EXPERIMENT_STATE.ON && (
                  <Dropdown.Item eventKey="on">Enable</Dropdown.Item>
                )}
                {experiment.state !== EXPERIMENT_STATE.OFF && (
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
