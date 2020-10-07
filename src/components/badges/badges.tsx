import {
  IExperiment,
  IPetriAggregatedData,
  EPetriExperimentState,
  EXPERIMENT_STATE,
} from '../../commons/petri'
import * as React from 'react'
import Badge from 'react-bootstrap/Badge'
import s from './badges.module.css'

export interface IBadgesProps {
  experiment: IExperiment
}

export const Badges: React.FC<IBadgesProps> = ({experiment}) => {
  const petriData = experiment.petriData

  return (
    <p>
      {petriData && (
        <>
          {petriData.state === EPetriExperimentState.ACTIVE && (
            <Badge className={s.badge} variant="success">
              {petriData.state}
            </Badge>
          )}
          {petriData.state === EPetriExperimentState.ENDED && (
            <Badge className={s.badge} variant="danger">
              {petriData.state}
            </Badge>
          )}
          {petriData.state === EPetriExperimentState.FUTURE && (
            <Badge className={s.badge} variant="primary">
              {petriData.state}
            </Badge>
          )}
          {petriData.state === EPetriExperimentState.PAUSED && (
            <Badge className={s.badge} variant="warning">
              {petriData.state}
            </Badge>
          )}
        </>
      )}
      {experiment.state && experiment.state !== EXPERIMENT_STATE.AUTO && (
        <Badge className={s.badge} variant="info">
          overridden
        </Badge>
      )}
    </p>
  )
}
