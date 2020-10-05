import {IExperiment} from './petri'

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
