const LOGIN_REDIRECT_URL = 'https://bo.wix.com/petri'
const LOGIN_URL = `https://bo.wix.com/wix-authentication-server/login/?url=${LOGIN_REDIRECT_URL}`

const REDIRECT_CHECK_INTERVAL = 500

const storage = {}
const pendingGetRequests = {}

// eslint-disable-next-line
const chromeApi = chrome

const handleLogin = (message, sendReply) => {
  chromeApi.tabs.create({url: LOGIN_URL, active: false}, tab => {
    let buttonPressed = false

    const closeCheckInterval = setInterval(() => {
      chromeApi.tabs.get(tab.id, loginTab => {
        const LOGIN_BUTTON_ID = 'signinButton'

        if (!buttonPressed) {
          chromeApi.tabs.executeScript(
            tab.id,
            {
              code: `document.getElementById('${LOGIN_BUTTON_ID}') !== null`,
            },
            ([buttonExists]) => {
              if (buttonExists) {
                buttonPressed = true

                chromeApi.tabs.executeScript(tab.id, {
                  code: `document.getElementById('${LOGIN_BUTTON_ID}')?.click()`,
                })
              }
            },
          )
        }

        if (loginTab.url?.startsWith(LOGIN_REDIRECT_URL)) {
          clearInterval(closeCheckInterval)
          chromeApi.tabs.remove(loginTab.id)
          sendReply({type: 'LOGIN_REPLY', payload: {status: 'ok'}})
        }
      })
    }, REDIRECT_CHECK_INTERVAL)
  })
}

const handleGet = (message, sendReply) => {
  if (pendingGetRequests[message.payload.url]) {
    pendingGetRequests[message.payload.url].then(reply => {
      sendReply(reply)
    })
  } else {
    pendingGetRequests[message.payload.url] = new Promise(resolve => {
      const respond = response => {
        sendReply({
          ...response,
          type: 'GET_REPLY',
        })

        resolve(response)
        delete pendingGetRequests[message.payload.url]
      }

      fetch(message.payload.url, {cache: 'no-cache'})
        .then(response => {
          if (response.status !== 200) {
            respond({error: true})
          } else {
            response
              .json()
              .then(payload => {
                respond({payload})
              })
              .catch(e => {
                respond({error: true, payload: e})
              })
          }
        })
        .catch(e => {
          respond({error: true, payload: e})
        })
    })
  }
}

const handleSetStorage = (message, sendReply) => {
  storage[message.payload.key] = message.payload.value
  sendReply({type: 'SET_STORAGE_REPLY', payload: {status: 'ok'}})
}

const handleGetStorage = (message, sendReply) => {
  sendReply({
    type: 'GET_STORAGE_REPLY',
    payload:
      storage[message.payload.key] !== undefined
        ? storage[message.payload.key]
        : 'null',
  })
}

chromeApi.runtime.onMessage.addListener((message, sender, sendReply) => {
  const handlerMap = {
    LOGIN: {handler: handleLogin},
    GET: {handler: handleGet, async: true},
    SET_STORAGE: {handler: handleSetStorage},
    GET_STORAGE: {handler: handleGetStorage},
  }

  if (message.type && handlerMap[message.type]) {
    handlerMap[message.type].handler(message, sendReply)

    if (handlerMap[message.type].async) {
      return true
    }
  }
})
