const LOGIN_REDIRECT_URL = 'https://bo.wix.com/petri'
const LOGIN_URL = `https://bo.wix.com/wix-authentication-server/login/?url=${LOGIN_REDIRECT_URL}`

const REDIRECT_CHECK_INTERVAL = 100

const storage = {}

const pendingGetRequests = {}

chrome.runtime.onMessage.addListener((message, sender, sendReply) => {
  if (message.type) {
    if (message.type === 'LOGIN') {
      chrome.tabs.create({url: LOGIN_URL, active: false}, tab => {
        const closeCheckInterval = setInterval(() => {
          chrome.tabs.get(tab.id, loginTab => {
            if (loginTab.url?.startsWith(LOGIN_REDIRECT_URL)) {
              clearInterval(closeCheckInterval)
              chrome.tabs.remove(loginTab.id)
              sendReply({type: 'LOGIN_REPLY', payload: {status: 'ok'}})
            }
          })
        }, REDIRECT_CHECK_INTERVAL)
      })
    } else if (message.type === 'GET') {
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

      return true
    } else if (message.type === 'SET_STORAGE') {
      storage[message.payload.key] = message.payload.value
      sendReply({type: 'SET_STORAGE_REPLY', payload: {status: 'ok'}})
    } else if (message.type === 'GET_STORAGE') {
      sendReply({
        type: 'GET_STORAGE_REPLY',
        payload:
          storage[message.payload.key] !== undefined
            ? storage[message.payload.key]
            : 'null',
      })
    }
  }
})
