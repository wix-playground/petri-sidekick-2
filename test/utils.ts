import {act} from 'react-dom/test-utils'

export const flushPromises = () =>
  act(
    () => new Promise<void>(resolve => setTimeout(resolve)),
  )
