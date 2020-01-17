import * as React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import s from './list.module.css'
import {
  IExperiment,
  EXPERIMENT_STATE,
} from '../../hooks/activeExperiments/activeExperimentsReducer'
import {Delete} from './delete/delete'

export interface IListProps {
  experiments: IExperiment[]
}

export const List = ({experiments}: IListProps) => {
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
      {experiments.map((experiment, index) => (
        <Card className={s.item}>
          <Accordion.Toggle
            className={s.specName}
            as={Card.Header}
            eventKey="0"
          >
            {experiment.specName}.asdf.as.das.d.asd.asd.as.da.sd.asd
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
