import {defaultTabsState, reduceTabs} from '../../hooks/tabs/tabsReducer'
import {
  defaultActiveExperimentsState,
  reduceActiveExperiments,
} from '../../hooks/activeExperiments/activeExperimentsReducer'
import {
  defaultPetriExperimentsState,
  reducePetriExperiments,
} from '../../hooks/petriExperiments/petriExperimentsReducer'
import {defaultLoginState, reduceLogin} from '../../hooks/login/loginReducer'
import {defaultCardsState, reduceCards} from '../../hooks/cards/cardsReducer'
import {
  defaultOverrideInputState,
  reduceOverrideInput,
} from '../../hooks/overrideInput/overrideInputReducer'
import {
  defaultCachedTypingState,
  reduceCachedTyping,
} from '../../hooks/cachedTyping/cachedTypingReducer'

export const defaultState = {
  tabs: defaultTabsState,
  activeExperiments: defaultActiveExperimentsState,
  petriExperiments: defaultPetriExperimentsState,
  login: defaultLoginState,
  cards: defaultCardsState,
  overrideInput: defaultOverrideInputState,
  cachedTyping: defaultCachedTypingState,
}

export const reducers = {
  tabs: reduceTabs,
  activeExperiments: reduceActiveExperiments,
  petriExperiments: reducePetriExperiments,
  login: reduceLogin,
  cards: reduceCards,
  overrideInput: reduceOverrideInput,
  cachedTyping: reduceCachedTyping,
}
