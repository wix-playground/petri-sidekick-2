import {
  IExperiment,
  EPetriExperimentState,
  EXPERIMENT_STATE,
} from '../../commons/petri'
import * as React from 'react'
import Badge from 'react-bootstrap/Badge'
import s from './badges.module.css'
import {TEST_ID} from '../../commons/test-ids'

const badges: IBadgeConfigItem[] = [
  {
    text: EPetriExperimentState.ACTIVE,
    testid: TEST_ID.BADGE_ACTIVE,
    variant: 'success',
    condition: ({petriData}) =>
      petriData?.state === EPetriExperimentState.ACTIVE,
  },
  {
    text: EPetriExperimentState.ENDED,
    testid: TEST_ID.BADGE_ENDED,
    variant: 'danger',
    condition: ({petriData}) =>
      petriData?.state === EPetriExperimentState.ENDED,
  },
  {
    text: EPetriExperimentState.FUTURE,
    testid: TEST_ID.BADGE_FUTURE,
    variant: 'primary',
    condition: ({petriData}) =>
      petriData?.state === EPetriExperimentState.FUTURE,
  },
  {
    text: EPetriExperimentState.PAUSED,
    testid: TEST_ID.BADGE_PAUSED,
    variant: 'warning',
    condition: ({petriData}) =>
      petriData?.state === EPetriExperimentState.PAUSED,
  },
  {
    text: 'overridden',
    testid: TEST_ID.BADGE_OVERRIDDEN,
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
        badges.map(({text, testid, variant, condition}, index) =>
          condition(experiment) ? (
            <Badge className={s.badge} variant={variant} key={index}>
              <span data-testid={testid}>{text}</span>
            </Badge>
          ) : null,
        )}
    </p>
  )
}

export interface IBadgeConfigItem {
  text: string
  testid: string
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
