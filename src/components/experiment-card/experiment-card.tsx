import * as React from 'react'
import {IExperiment} from '../../commons/petri'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import {ExperimentInfo} from '../experiment-info/experiment-info'
import {Loader} from '../loader/loader'
import {Login} from '../login/login'
import {ListActions} from '../actions/actions'
import {useLogin} from '../../hooks/login/useLogin'
import {usePetriExperiments} from '../../hooks/petriExperiments/usePetriExperiments'
import s from './experiment-card.module.css'
import {useCards} from '../../hooks/cards/useCards'
import {NoInfo} from '../no-info/no-info'
import {TEST_ID} from '../../commons/test-ids'

export interface ICardProps {
  experiment: IExperiment
}

export const ExperimentCard: React.FC<any> = ({experiment}) => {
  const {authenticated, ready} = useLogin()
  const {loaded} = usePetriExperiments()
  const {toggleCard} = useCards()

  const {specName, petriData} = experiment

  return (
    <Card className={s.item}>
      <div data-testid={TEST_ID.LIST_ITEM}>
        <Accordion.Toggle
          as={Card.Header}
          eventKey={specName}
          onClick={() => {
            toggleCard(specName)
          }}
        >
          <div className={s.specName} data-testid={TEST_ID.LIST_ITEM_TITLE}>
            {specName}
          </div>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={specName}>
          <Card.Body className={s.experimentCard}>
            {petriData ? (
              <ExperimentInfo experiment={experiment} />
            ) : !ready ? (
              <div className={s.loading}>
                <Loader text={'Connecting...'} />
              </div>
            ) : authenticated ? (
              !loaded ? (
                <div className={s.loading}>
                  <Loader
                    text={
                      <>
                        <span>Collecting all experiments...</span>
                        <br />
                        <div
                          style={{
                            color: 'red',
                            fontSize: 13,
                            position: 'relative',
                            top: -10,
                          }}
                        >
                          (please keep this open and have a coffee for max 10
                          minutes)
                        </div>
                      </>
                    }
                  />
                </div>
              ) : (
                <NoInfo
                  message="More detailed information is not loaded"
                  buttonName="Update"
                />
              )
            ) : (
              <div className={s.login}>
                <Login />
              </div>
            )}
          </Card.Body>
        </Accordion.Collapse>
        {experiment.state && <ListActions experiment={experiment} />}
      </div>
    </Card>
  )
}
