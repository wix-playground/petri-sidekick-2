import {
  IExperiment,
  IPetriAggregatedData,
  EPetriExperimentState,
} from '../../commons/petri'
import * as React from 'react'
import Badge from 'react-bootstrap/Badge'

export interface IBadgesProps {
  experiment: IExperiment
}

export const Badges: React.FC<IBadgesProps> = ({experiment}) => {
  const petriData = experiment.petriData as IPetriAggregatedData

  return (
    <p>
      {petriData.state === EPetriExperimentState.ACTIVE && (
        <Badge variant="success">{petriData.state}</Badge>
      )}
      {petriData.state === EPetriExperimentState.ENDED && (
        <Badge variant="danger">{petriData.state}</Badge>
      )}
      {petriData.state === EPetriExperimentState.FUTURE && (
        <Badge variant="primary">{petriData.state}</Badge>
      )}
      {petriData.state === EPetriExperimentState.PAUSED && (
        <Badge variant="warning">{petriData.state}</Badge>
      )}
    </p>
  )
}
