import * as React from 'react'
import Button from 'react-bootstrap/Button'
import {TiDelete, TiDeleteOutline} from 'react-icons/ti'
import s from './delete.module.css'

export const Delete = () => {
  const [hoveringDelete, setDeleteHover] = React.useState(false)

  const onDeleteMouseOver = () => setDeleteHover(true)
  const onDeleteMouseOut = () => setDeleteHover(false)

  return (
    <Button
      variant="link"
      className={s.delete}
      onMouseEnter={onDeleteMouseOver}
      onMouseLeave={onDeleteMouseOut}
    >
      {hoveringDelete ? <TiDeleteOutline /> : <TiDelete />}
    </Button>
  )
}
