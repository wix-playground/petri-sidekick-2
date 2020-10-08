import * as React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Alert from 'react-bootstrap/Alert'
import s from './list.module.css'
import {IExperiment} from '../../commons/petri'
import {ExperimentCard} from '../experiment-card/experiment-card'
import {useCards} from '../../hooks/cards/useCards'
import {TEST_ID} from '../../commons/test-ids'

export interface IListProps {
  experiments: IExperiment[]
  emptyText: React.ReactNode
}

export const List: React.FC<IListProps> = ({experiments, emptyText}) => {
  const {activeCard} = useCards()

  return (
    <Accordion className={s.list} activeKey={activeCard}>
      {!experiments.length && (
        <Alert className={s.empty} variant={'light'}>
          {emptyText}
        </Alert>
      )}
      {experiments.map(experiment => (
        <div data-testid={TEST_ID.LIST_ITEM} key={experiment.specName}>
          <ExperimentCard experiment={experiment} />
        </div>
      ))}
    </Accordion>
  )
}
