import {act} from 'react-dom/test-utils'

export const wait = (timeout: number = 0) =>
  act(
    () => new Promise<void>(resolve => setTimeout(resolve, timeout)),
  )
