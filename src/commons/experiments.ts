import {IExperiment} from './petri'
import {EXPERIMENT_STATE} from './petri/interfaces'
import {getExperimentsFromCookies} from './cookies'

export const isBinaryExperiment = (experiment: IExperiment) => {
  const options = experiment.petriData?.options ?? []

  if (options.length !== 2) {
    return false
  }

  const lowerCaseOptions = options.map(option => option.toLowerCase())
  const requiredValues = ['true', 'false']

  for (let requiredValue of requiredValues) {
    if (!lowerCaseOptions.includes(requiredValue)) {
      return false
    }
  }

  return true
}

export const getFactualExperiments = async (
  storedExperiments: IExperiment[],
): Promise<IExperiment[]> =>
  (await getExperimentsFromCookies()).map(([specName, state]) =>
    getExperimentWithState(
      {
        specName,
        state: EXPERIMENT_STATE.CUSTOM,
        customState: state,
      } as IExperiment,
      storedExperiments,
    ),
  )

const getExperimentWithState = (
  newExperiment: IExperiment,
  storedExperiments: IExperiment[],
): IExperiment => {
  const storedExperiment = storedExperiments.find(
    experiment => experiment.specName === newExperiment.specName,
  )
  const isBinary = storedExperiment && isBinaryExperiment(storedExperiment)

  if (!isBinary) {
    return newExperiment
  }

  const customState = newExperiment.customState as string

  newExperiment.state =
    customState.toLowerCase() === 'true'
      ? EXPERIMENT_STATE.ON
      : EXPERIMENT_STATE.OFF

  delete newExperiment.customState

  return newExperiment
}
