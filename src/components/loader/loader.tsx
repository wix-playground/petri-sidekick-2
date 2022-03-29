import * as React from 'react'
import Spinner from 'react-bootstrap/Spinner'
import s from './loader.module.css'

export interface ILoaderProps {
  text: string | JSX.Element
}

export const Loader: React.FC<ILoaderProps> = ({text}) => (
  <div className={s.loader}>
    <div className={s.spinner}>
      <Spinner animation="border" />
    </div>
    <span>{text}</span>
  </div>
)
