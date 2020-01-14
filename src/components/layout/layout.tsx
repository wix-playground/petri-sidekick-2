import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import * as React from 'react'
import {useTabs} from '../../hooks/tabs/useTabs'
import {TAB} from '../../hooks/tabs/tabsReducer'
import {List} from '../list/list'
import s from './layout.module.css'

export const Layout = () => {
  const {activeTab, setActiveTab} = useTabs()

  return (
    <>
      <h1 className={s.header}>
        Petri Sidekick
        <small>wix.com</small>
      </h1>
      <Tabs
        id="tabs"
        activeKey={activeTab}
        onSelect={(k: string) => setActiveTab(k as TAB)}
      >
        <Tab eventKey={TAB.CURRENT} title="Current">
          <List />
        </Tab>
        <Tab eventKey={TAB.SEARCH} title="Search">
          <List />
        </Tab>
      </Tabs>
    </>
  )
}
