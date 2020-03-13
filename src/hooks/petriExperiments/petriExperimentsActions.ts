import {IAction} from '../../commons/appState'
import {getExperiments} from '../../commons/petri'
import {setTemporaryValue} from '../../commons/localStorage'
import {
  setRuntimeValue,
  getRuntimeValue,
  EXPERIMENTS_MEMORY,
} from '../../commons/localStorage'

export const ACTION_LOAD_PETRI_EXPERIMENTS = 'ACTION_LOAD_PETRI_EXPERIMENTS'

export const loadPetriExperiments = async (
  dispatch: React.Dispatch<IAction>,
) => {
  const experiments = await getRuntimeValue(EXPERIMENTS_MEMORY)

  if (experiments) {
    setTemporaryValue(EXPERIMENTS_MEMORY, experiments)

    dispatch({
      type: ACTION_LOAD_PETRI_EXPERIMENTS,
      payload: experiments,
    })
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
}

// TODO: attempt implementing experiment conducting
// TODO: Implement trackPetriExperiments for periodical updates
