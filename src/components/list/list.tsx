import * as React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Alert from 'react-bootstrap/Alert'
import s from './list.module.css'
import {IExperiment} from '../../commons/petri'
import {ExperimentCard} from '../experiment-card/experiment-card'

export interface IListProps {
  experiments: IExperiment[]
  emptyText: React.ReactNode
}

export const List: React.FC<IListProps> = ({experiments, emptyText}) => {
  return (
    <Accordion className={s.list}>
      {!experiments.length && (
        <Alert className={s.empty} variant={'light'}>
          {emptyText}
        </Alert>
      )}
      {experiments.map(experiment => (
        <ExperimentCard experiment={experiment} />
      ))}
    </Accordion>
  )
}
