import * as React from 'react'
import {Typeahead} from 'react-bootstrap-typeahead'
import s from './search.module.css'
import {getSearchQueries} from '../../commons/localStorage'

export const Search = () => {
  return (
    <div className={s.input}>
      <Typeahead
        placeholder="Type experiment spec name here"
        options={getSearchQueries()}
      />
    </div>
  )
}
