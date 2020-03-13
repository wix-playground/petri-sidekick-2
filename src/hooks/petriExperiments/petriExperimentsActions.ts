import {IAction} from '../../commons/appState'
import {getExperiments} from '../../commons/petri'

export const ACTION_LOAD_PETRI_EXPERIMENTS = 'ACTION_LOAD_PETRI_EXPERIMENTS'

export const loadPetriExperiments = async (
  dispatch: React.Dispatch<IAction>,
) => {
  // TODO: First - load from local storage if possible

  dispatch({
    type: ACTION_LOAD_PETRI_EXPERIMENTS,
    payload: await getExperiments(),
  })

  // TODO: load into local storage
  // TODO: load into suggestions
}

// TODO: attempt implementing experiment conducting

// Implement trackPetriExperiments for periodical updates
