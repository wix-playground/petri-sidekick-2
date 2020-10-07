import * as React from 'react'
import {Typeahead} from 'react-bootstrap-typeahead'
import Button from 'react-bootstrap/Button'
import {IExperiment, EXPERIMENT_STATE} from '../../commons/petri'
import {useActiveExperiments} from '../../hooks/activeExperiments/useActiveExperiments'
import s from './override.module.css'
import {isBinaryExperiment} from '../../commons/experiment'
import {useCards} from '../../hooks/cards/useCards'
import {useTabs} from '../../hooks/tabs/useTabs'
import {TAB} from '../../hooks/tabs/tabsReducer'
import {useOverrideInput} from '../../hooks/overrideInput/useOverrideInput'

export interface IOverrideProps {
  experiment: IExperiment
}

export const Override: React.FC<IOverrideProps> = ({experiment}) => {
  const element = React.useRef<any>()
  const {activeCard} = useCards()
  const {activeTab} = useTabs()
  const {focus, disableOverrideInputFocus} = useOverrideInput()

  const search = activeTab === TAB.SEARCH
  const autoFocus = focus

  React.useEffect(() => {
    if (autoFocus && element?.current) {
      disableOverrideInputFocus()
      setTimeout(() => {
        element.current?.focus()
      }, 400)
    }
  })

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

  const handleSubmit = (value: string = inputValue) => {
    const valid = !value || options.includes(value)

    if (valid) {
      value
        ? setExperimentValue(experiment.specName, mapToValue(value))
        : setExperimentAuto(experiment.specName)
    }

    setTimeout(() => {
      element.current?.blur()
    })
  }

  const handleChange = (value: string) => {
    const valid = !value || options.includes(value)
    setInvalid(!valid)
    setInputValue(value)
  }

  const handleClear = () => {
    setExperimentAuto(experiment.specName)
    element.current?.clear()
    setInvalid(false)
  }

  if (activeCard !== experiment.specName && !search) {
    return null
  }

  const id = `${search ? 'search' : 'bookmark'}-input-${experiment.specName}`

  const keyDownHandler = (e: Event) => {
    if ((e as KeyboardEvent).key === 'Enter' && element.current) {
      handleSubmit()
    } else {
      e.stopPropagation()
    }
  }

  return (
    <>
      <h5>Override:</h5>
      <div className={s.searchLine}>
        <div className={s.search}>
          <Typeahead
            onKeyDown={keyDownHandler}
            ref={element}
            id={id}
            key={experiment.specName}
            placeholder="Choose value in order to override"
            options={options}
            ignoreDiacritics={false}
            onInputChange={handleChange}
            onChange={([query]) => {
              handleChange(query)
              handleSubmit(query)
            }}
            highlightOnlyResult
            dropup
            onBlur={() => handleSubmit()}
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
