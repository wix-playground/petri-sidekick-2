import * as React from 'react'
import Card from 'react-bootstrap/Card'
import {IExperiment} from '../../commons/petri'
import s from './experiment-info.module.css'
import {Override} from '../override/override'
import {Badges} from '../badges/badges'

export interface IExperimentInfoProps {
  experiment: IExperiment
}

export const ExperimentInfo: React.FC<IExperimentInfoProps> = ({
  experiment,
}) => {
  const {petriData, specName, state, customState} = experiment

  return (
    <Card border="light">
      <Card.Body>
        <Card.Title>{specName}</Card.Title>
        {petriData && (
          <Card.Subtitle className={'mb-2 text-muted'}>
            {petriData.scopes.join(', ')}
          </Card.Subtitle>
        )}
        <Card.Text>
          {petriData && (
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
          )}
          <Badges experiment={experiment} />
          <Override
            experiment={experiment}
            key={`${specName}-${state}-${customState}-${petriData}`}
          />
        </Card.Text>
      </Card.Body>
    </Card>
  )
}
