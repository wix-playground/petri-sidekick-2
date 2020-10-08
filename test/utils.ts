import {act} from 'react-dom/test-utils'

export const wait = () =>
  act(
    () => new Promise<void>(resolve => setTimeout(resolve)),
  )
