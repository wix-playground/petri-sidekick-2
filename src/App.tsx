import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Layout} from './components/layout/layout'
import {AppStateProvider} from './commons/appState'

const App: React.FC = () => (
  <AppStateProvider>
    <Layout />
  </AppStateProvider>
)
export default App
