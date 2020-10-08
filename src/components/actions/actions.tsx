import DropdownButton from 'react-bootstrap/DropdownButton'
import * as React from 'react'
import {EXPERIMENT_STATE, IExperiment} from '../../commons/petri'
import Dropdown from 'react-bootstrap/Dropdown'
import {useActiveExperiments} from '../../hooks/activeExperiments/useActiveExperiments'
import {Delete} from '../delete/delete'
import s from './actions.module.css'
import {isBinaryExperiment} from '../../commons/experiments'
import {useCards} from '../../hooks/cards/useCards'

export interface IListActionsProps {
  experiment: IExperiment
}

export const ListActions: React.FC<IListActionsProps> = ({experiment}) => {
  const {
    setExperimentAuto,
    turnBinaryExperimentOff,
    turnBinaryExperimentOn,
  } = useActiveExperiments()

  const {openCard} = useCards()

  const isBinary = isBinaryExperiment(experiment)
  const title = getDropdownValue(experiment)

  return (
    <div
      title={
        experiment.state === EXPERIMENT_STATE.CUSTOM && title.length > 3
          ? title
          : undefined
      }
    >
      <DropdownButton
        id={`experiment_${experiment.specName}`}
        size="sm"
        drop="left"
        className={s.actions}
        title={title}
        variant={getDropdownVariant(experiment)}
      >
        {experiment.state !== EXPERIMENT_STATE.AUTO && (
          <Dropdown.Item
            eventKey="reset"
            onClick={() => setExperimentAuto(experiment.specName)}
          >
            Reset
          </Dropdown.Item>
        )}
        {!isBinary && (
          <Dropdown.Item
            eventKey="auto"
            onClick={() => {
              openCard(experiment.specName, true)
            }}
          >
            Change
          </Dropdown.Item>
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
    </div>
  )
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
      return experiment.customState as string
    default:
      return 'Auto'
  }
}
