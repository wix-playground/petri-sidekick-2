import * as React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

export const List = () => {
  return (
    <Accordion>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          Example experiment
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>More detailed information</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  )
}
