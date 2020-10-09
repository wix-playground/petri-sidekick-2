import * as React from 'react'
import {Typeahead} from 'react-bootstrap-typeahead'
import Button from 'react-bootstrap/Button'
import {IExperiment, EXPERIMENT_STATE} from '../../commons/petri'
import {useActiveExperiments} from '../../hooks/activeExperiments/useActiveExperiments'
import s from './override.module.css'
import {isBinaryExperiment} from '../../commons/experiments'
import {useCards} from '../../hooks/cards/useCards'
import {useTabs} from '../../hooks/tabs/useTabs'
import {TAB} from '../../hooks/tabs/tabsReducer'
import {useOverrideInput} from '../../hooks/overrideInput/useOverrideInput'
import {FOCUS_DELAY} from '../../commons/constants'
import {TEST_ID} from '../../commons/test-ids'

export interface IOverrideProps {
  experiment: IExperiment
  onChange?: () => void
}

export const Override: React.FC<IOverrideProps> = ({experiment}) => {
  const element = React.useRef<any>()

  const {activeCard} = useCards()
  const {activeTab} = useTabs()
  const {focus, disableOverrideInputFocus} = useOverrideInput()
  const [invalid, setInvalid] = React.useState<boolean>(false)
  const {setExperimentValue, setExperimentAuto} = useActiveExperiments()

  const isSearchTab = activeTab === TAB.SEARCH
  const binary = isBinaryExperiment(experiment)

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

  const id = `${isSearchTab ? 'search' : 'bookmark'}-input-${
    experiment.specName
  }`

  const options = mapToLabels(experiment.petriData?.options ?? [])

  const stateMap = {
    [EXPERIMENT_STATE.ON]: 'true',
    [EXPERIMENT_STATE.OFF]: 'false',
    [EXPERIMENT_STATE.AUTO]: '',
    [EXPERIMENT_STATE.CUSTOM]: experiment?.customState ?? '',
  }

  const realState = stateMap[experiment.state ?? EXPERIMENT_STATE.AUTO]

  const [inputValue, setInputValue] = React.useState<string>(
    mapToLabel(realState),
  )

  React.useEffect(() => {
    if (focus && element?.current) {
      disableOverrideInputFocus()
      setTimeout(() => {
        element.current?.focus()
      }, FOCUS_DELAY)
    }
  }, [focus, disableOverrideInputFocus])

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

  if (activeCard !== experiment.specName && !isSearchTab) {
    return null
  }

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
        <div className={s.search} data-testid={TEST_ID.OVERRIDE_INPUT}>
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
