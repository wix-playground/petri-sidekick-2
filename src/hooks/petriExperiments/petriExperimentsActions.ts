import {IActionCreator} from '../../commons/appState'
import {getExperiments} from '../../commons/petri'
import {setTemporaryValue} from '../../commons/localStorage'
import {completeActiveExperiments} from '../activeExperiments/activeExperimentsActions'
import {
  setRuntimeValue,
  getRuntimeValue,
  EXPERIMENTS_MEMORY,
} from '../../commons/localStorage'

export const ACTION_LOAD_PETRI_EXPERIMENTS = 'ACTION_LOAD_PETRI_EXPERIMENTS'

export const loadPetriExperiments: IActionCreator = async context => {
  const {dispatch} = context

  const experiments = await getRuntimeValue(EXPERIMENTS_MEMORY)

  if (experiments) {
    setTemporaryValue(EXPERIMENTS_MEMORY, experiments)

    dispatch({
      type: ACTION_LOAD_PETRI_EXPERIMENTS,
      payload: experiments,
    })

    completeActiveExperiments(context)
  }

  const loadedExperiments = await getExperiments()

  if (loadedExperiments.length) {
    setRuntimeValue(EXPERIMENTS_MEMORY, loadedExperiments)
    setTemporaryValue(EXPERIMENTS_MEMORY, loadedExperiments)
  }

  dispatch({
    type: ACTION_LOAD_PETRI_EXPERIMENTS,
    payload: loadedExperiments,
  })

  completeActiveExperiments(context)
}

// TODO: Implement trackPetriExperiments for periodical updates
