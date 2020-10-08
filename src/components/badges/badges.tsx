import {
  IExperiment,
  EPetriExperimentState,
  EXPERIMENT_STATE,
} from '../../commons/petri'
import * as React from 'react'
import Badge from 'react-bootstrap/Badge'
import s from './badges.module.css'

const badges: IBadgeConfigItem[] = [
  {
    text: EPetriExperimentState.ACTIVE,
    variant: 'success',
    condition: ({petriData}) =>
      petriData?.state === EPetriExperimentState.ACTIVE,
  },
  {
    text: EPetriExperimentState.ENDED,
    variant: 'danger',
    condition: ({petriData}) =>
      petriData?.state === EPetriExperimentState.ENDED,
  },
  {
    text: EPetriExperimentState.FUTURE,
    variant: 'primary',
    condition: ({petriData}) =>
      petriData?.state === EPetriExperimentState.FUTURE,
  },
  {
    text: EPetriExperimentState.PAUSED,
    variant: 'warning',
    condition: ({petriData}) =>
      petriData?.state === EPetriExperimentState.PAUSED,
  },
  {
    text: 'overridden',
    variant: 'info',
    condition: ({state}) => (state ? state !== EXPERIMENT_STATE.AUTO : false),
  },
]

export interface IBadgesProps {
  experiment: IExperiment
}

export const Badges: React.FC<IBadgesProps> = ({experiment}) => {
  const petriData = experiment.petriData

  return (
    <p>
      {petriData &&
        badges.map(({text, variant, condition}, index) =>
          condition(experiment) ? (
            <Badge className={s.badge} variant={variant} key={index}>
              {text}
            </Badge>
          ) : null,
        )}
    </p>
  )
}

export interface IBadgeConfigItem {
  text: string
  variant:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | undefined
  condition: (experiment: IExperiment) => boolean
}
