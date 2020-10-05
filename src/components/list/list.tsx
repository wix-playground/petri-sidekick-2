import * as React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Alert from 'react-bootstrap/Alert'
import s from './list.module.css'
import {Delete} from './delete/delete'
import {EXPERIMENT_STATE, IExperiment} from '../../commons/petri'
import {useLogin} from '../../hooks/login/useLogin'
import {Loader} from '../loader/loader'
import {Login} from '../login/login'
import Button from 'react-bootstrap/Button'
import {usePetriExperiments} from '../../hooks/petriExperiments/usePetriExperiments'
import {Experiment} from '../experiment/experiment'
import {useActiveExperiments} from '../../hooks/activeExperiments/useActiveExperiments'

export interface IListProps {
  experiments: IExperiment[]
  emptyText: React.ReactNode
}

export const List: React.FC<IListProps> = ({experiments, emptyText}) => {
  const {authenticated, ready} = useLogin()
  const {reloadPetriExperiments, loaded} = usePetriExperiments()
  const {setExperimentAuto} = useActiveExperiments()

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
                  <Dropdown.Item
                    eventKey="auto"
                    onClick={() => setExperimentAuto(experiment.specName)}
                  >
                    Reset
                  </Dropdown.Item>
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
              <Delete specName={experiment.specName} />
            </>
          )}
        </Card>
      ))}
    </Accordion>
  )
}
