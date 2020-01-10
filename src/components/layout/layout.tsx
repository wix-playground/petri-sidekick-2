import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import * as React from 'react'
import {useTabs} from '../../hooks/tabs/useTabs'
import {TAB} from '../../hooks/tabs/tabsReducer'
import {List} from '../list/list'

export const Layout = () => {
  const {activeTab, setActiveTab} = useTabs()

  return (
    <>
      <h1>Petri Sidekick</h1>
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
