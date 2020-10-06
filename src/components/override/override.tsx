import * as React from 'react'
import {Typeahead} from 'react-bootstrap-typeahead'
import Button from 'react-bootstrap/Button'
import {IExperiment, EXPERIMENT_STATE} from '../../commons/petri'
import {useActiveExperiments} from '../../hooks/activeExperiments/useActiveExperiments'
import s from './override.module.css'
import {isBinaryExperiment} from '../../commons/experiment'

export interface IOverrideProps {
  search?: boolean
  experiment: IExperiment
}

export const Override: React.FC<IOverrideProps> = ({search, experiment}) => {
  const element = React.useRef<any>()

  const binary = isBinaryExperiment(experiment)

  const stateMap = {
    [EXPERIMENT_STATE.ON]: 'true',
    [EXPERIMENT_STATE.OFF]: 'false',
    [EXPERIMENT_STATE.AUTO]: '',
    [EXPERIMENT_STATE.CUSTOM]: experiment?.customState ?? '',
  }

  const realState = stateMap[experiment.state ?? EXPERIMENT_STATE.AUTO]

  const mapToLabel = (value: string) => {
    if (!value) {
      return value
    }

    if (!binary) {
      return value
    } else {
      return value === 'true' ? 'On' : 'Off'
    }
  }

  const mapToLabels = (options: string[]) => {
    if (!binary) {
      return options
    } else {
      return options.map(mapToLabel)
    }
  }

  const mapToValue = (value: string) => {
    if (!binary) {
      return value
    } else {
      return value === 'On' ? 'true' : 'false'
    }
  }

  const [inputValue, setInputValue] = React.useState<string>(
    mapToLabel(realState),
  )

  const [invalid, setInvalid] = React.useState<boolean>(false)
  const {setExperimentValue, setExperimentAuto} = useActiveExperiments()

  const options = mapToLabels(experiment.petriData?.options ?? [])

  const handleChange = (value: string = inputValue) => {
    const valid = !value || options.includes(value)
    setInvalid(!valid)
    setInputValue(value)

    if (valid) {
      value
        ? setExperimentValue(experiment.specName, mapToValue(value))
        : setExperimentAuto(experiment.specName)
    }
  }

  const handleClear = () => {
    setExperimentAuto(experiment.specName)
    element.current?.clear()
    setInvalid(false)
  }

  return (
    <>
      <h5>Override:</h5>
      <div className={s.searchLine}>
        <div className={s.search}>
          <Typeahead
            ref={element}
            id={`${search ? 'search' : 'bookmark'}-input-${
              experiment.specName
            }`}
            key={`${experiment.specName}`}
            placeholder="Choose value in order to override"
            options={options}
            ignoreDiacritics={false}
            onInputChange={handleChange}
            onChange={([query]) => {
              handleChange(query)
            }}
            // defaultOpen={false} // Use this to auto-open menu (maybe autofocus is enough)
            highlightOnlyResult
            // autoFocus // Would also open menu
            dropup
            onBlur={() => handleChange()}
            // selected={[inputValue]}
            defaultInputValue={inputValue}
            isInvalid={invalid}
          />
        </div>
        <Button
          className={s.button}
          onClick={handleClear}
          variant="light"
          size="sm"
        >
          Reset
        </Button>
      </div>
    </>
  )
}
