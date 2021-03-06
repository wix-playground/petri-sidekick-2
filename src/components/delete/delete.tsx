import * as React from 'react'
import Button from 'react-bootstrap/Button'
import {TiDelete, TiDeleteOutline} from 'react-icons/ti'
import s from './delete.module.css'
import {useActiveExperiments} from '../../hooks/activeExperiments/useActiveExperiments'
import {TEST_ID} from '../../commons/test-ids'

export interface IDeleteProps {
  specName: string
}

export const Delete: React.FC<IDeleteProps> = ({specName}) => {
  const [hoveringDelete, setDeleteHover] = React.useState(false)
  const {forgetExperiment} = useActiveExperiments()

  const onDeleteMouseOver = () => setDeleteHover(true)
  const onDeleteMouseOut = () => setDeleteHover(false)

  return (
    <div data-testid={TEST_ID.DELETE}>
      <Button
        variant="link"
        className={s.delete}
        onMouseEnter={onDeleteMouseOver}
        onMouseLeave={onDeleteMouseOut}
        onClick={() => forgetExperiment(specName)}
      >
        {hoveringDelete ? <TiDeleteOutline /> : <TiDelete />}
      </Button>
    </div>
  )
}
