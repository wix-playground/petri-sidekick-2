import * as React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Alert from 'react-bootstrap/Alert'
import s from './list.module.css'
import {Delete} from './delete/delete'
import {EXPERIMENT_STATE, IExperiment} from '../../commons/petri'

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
    <Accordion>
      {!experiments.length && (
        <Alert className={s.empty} variant={'light'}>
          {emptyText}
        </Alert>
      )}
      {experiments.map((experiment, index) => (
        <Card className={s.item}>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            <div className={s.specName}>{experiment.specName}</div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>TODO: More detailed information</Card.Body>
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
                  <Dropdown.Item eventKey="auto">Auto</Dropdown.Item>
                )}
                {experiment.state !== EXPERIMENT_STATE.ON && (
                  <Dropdown.Item eventKey="on">Enabled</Dropdown.Item>
                )}
                {experiment.state !== EXPERIMENT_STATE.OFF && (
                  <Dropdown.Item eventKey="off">Disabled</Dropdown.Item>
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
