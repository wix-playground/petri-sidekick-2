import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import * as React from 'react'
import {useTabs} from '../../hooks/tabs/useTabs'
import {TAB} from '../../hooks/tabs/tabsReducer'
import {List} from '../list/list'
import s from './layout.module.css'
import {Search} from '../search/search'
import {useActiveExperiments} from '../../hooks/activeExperiments/useActiveExperiments'
import {useCachedTyping} from '../../hooks/cachedTyping/useCachedTyping'
import {TEST_ID} from '../../commons/test-ids'

export const Layout = () => {
  const {activeTab, setActiveTab} = useTabs()
  const {activeExperiments, loadActiveExperiments} = useActiveExperiments()
  const {addCachedTypingText, enabled: enabledCachedTyping} = useCachedTyping()

  const handleKeyPress = (e: KeyboardEvent) => {
    const LEFT_ARROW = 'ArrowLeft'
    const RIGHT_ARROW = 'ArrowRight'

    if (e.key === LEFT_ARROW) {
      setActiveTab(TAB.CURRENT)
    } else if (e.key === RIGHT_ARROW) {
      setActiveTab(TAB.SEARCH)
    }

    if (enabledCachedTyping) {
      if (e.key.match(/^[a-zA-Z0-9_-]$/)) {
        e.preventDefault()
        addCachedTypingText(e.key)
        if (activeTab !== TAB.SEARCH) {
          setActiveTab(TAB.SEARCH)
        }
      }
    }
  }

  React.useEffect(() => {
    loadActiveExperiments()
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <h1 className={s.header}>
        Petri Sidekick
        <small>wix.com</small>
      </h1>
      <Tabs
        id="tabs"
        activeKey={activeTab}
        onSelect={(k: string | null) => setActiveTab(k as TAB)}
      >
        <Tab eventKey={TAB.CURRENT} title="Current">
          <List
            experiments={activeExperiments}
            emptyText={
              <>
                <div>There are no experiments selected at the moment.</div>
                <div>Please use search tab to select some.</div>
              </>
            }
          />
        </Tab>
        <Tab
          eventKey={TAB.SEARCH}
          title={<div data-testid={TEST_ID.TAB_SEARCH}>Search</div>}
        >
          <Search />
        </Tab>
      </Tabs>
    </>
  )
}
