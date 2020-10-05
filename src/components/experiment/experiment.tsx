import * as React from 'react'
import Card from 'react-bootstrap/Card'
import {
  IExperiment,
  IPetriAggregatedData,
  EPetriExperimentState,
} from '../../commons/petri'
import Badge from 'react-bootstrap/Badge'
import s from './experiment.module.css'

export interface IExperimentProps {
  experiment: IExperiment
}

export const Experiment: React.FC<IExperimentProps> = ({experiment}) => {
  const petriData = experiment.petriData as IPetriAggregatedData

  return (
    <Card border="light">
      <Card.Body>
        <Card.Title>{experiment.specName}</Card.Title>
        <Card.Subtitle className={'mb-2 text-muted'}>
          {petriData.scopes.join(', ')}
        </Card.Subtitle>
        <Card.Text>
          <p className={s.pointsOfContact}>
            {petriData.pointsOfContact.map((item, index) => (
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
            ))}
          </p>
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
        </Card.Text>
      </Card.Body>
    </Card>
  )
}
