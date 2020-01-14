import * as React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import s from './list.module.css'
import Button from 'react-bootstrap/Button'
import {TiDelete, TiDeleteOutline} from 'react-icons/ti'

export const List = () => {
  const [hoveringDelete, setDeleteHover] = React.useState(false)

  const onDeleteMouseOver = () => setDeleteHover(true)
  const onDeleteMouseOut = () => setDeleteHover(false)

  return (
    <Accordion>
      <Card className={s.item}>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          Example experiment
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>More detailed information</Card.Body>
        </Accordion.Collapse>
        <DropdownButton
          id="some_id"
          size="sm"
          drop="left"
          className={s.actions}
          title="Auto"
          variant="primary"
        >
          <Dropdown.Item eventKey="1">Auto</Dropdown.Item>
          <Dropdown.Item eventKey="2">Enabled</Dropdown.Item>
          <Dropdown.Item eventKey="2">Disabled</Dropdown.Item>
        </DropdownButton>
        <Button
          variant="link"
          className={s.delete}
          onMouseOver={onDeleteMouseOver}
          onMouseOut={onDeleteMouseOut}
        >
          {hoveringDelete ? <TiDeleteOutline /> : <TiDelete />}
        </Button>
      </Card>
    </Accordion>
  )
}
