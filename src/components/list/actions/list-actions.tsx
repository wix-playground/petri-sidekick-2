import DropdownButton from 'react-bootstrap/DropdownButton'
import * as React from 'react'
import {EXPERIMENT_STATE, IExperiment} from '../../../commons/petri'
import Dropdown from 'react-bootstrap/Dropdown'
import {useActiveExperiments} from '../../../hooks/activeExperiments/useActiveExperiments'
import {Delete} from '../delete/delete'
import s from './list-actions.module.css'
import {isBinaryExperiment} from '../../../commons/experiment'

export interface IListActionsProps {
  experiment: IExperiment
}

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

export const ListActions: React.FC<IListActionsProps> = ({experiment}) => {
  const {
    setExperimentAuto,
    turnBinaryExperimentOff,
    turnBinaryExperimentOn,
  } = useActiveExperiments()

  const isBinary = isBinaryExperiment(experiment)

  return (
    <>
      <DropdownButton
        id={`experiment_${experiment.specName}`}
        size="sm"
        drop="left"
        className={s.actions}
        title={getDropdownValue(experiment)}
        variant={getDropdownVariant(experiment)}
      >
        {experiment.state !== EXPERIMENT_STATE.AUTO && (
          <Dropdown.Item
            eventKey="auto"
            onClick={() => setExperimentAuto(experiment.specName)}
          >
            Reset
          </Dropdown.Item>
        )}
        {experiment.state !== EXPERIMENT_STATE.CUSTOM && !isBinary && (
          <Dropdown.Item eventKey="auto">Custom</Dropdown.Item>
        )}
        {experiment.state !== EXPERIMENT_STATE.ON && isBinary && (
          <Dropdown.Item
            eventKey="on"
            onClick={() => turnBinaryExperimentOn(experiment.specName)}
          >
            Enable
          </Dropdown.Item>
        )}
        {experiment.state !== EXPERIMENT_STATE.OFF && isBinary && (
          <Dropdown.Item
            eventKey="off"
            onClick={() => turnBinaryExperimentOff(experiment.specName)}
          >
            Disable
          </Dropdown.Item>
        )}
      </DropdownButton>
      <Delete specName={experiment.specName} />
    </>
  )
}
