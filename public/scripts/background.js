const LOGIN_REDIRECT_URL = 'https://bo.wix.com/petri'
const LOGIN_URL = `https://bo.wix.com/wix-authentication-server/login/?url=${LOGIN_REDIRECT_URL}`

const REDIRECT_CHECK_INTERVAL = 100

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
      fetch(message.payload.url, {cache: 'no-cache'})
        .then(response => {
          if (response.status !== 200) {
            sendReply({
              type: 'GET_REPLY',
              error: true,
            })
          }

          response
            .json()
            .then(payload => {
              sendReply({
                type: 'GET_REPLY',
                payload,
              })
            })
            .catch(e => {
              sendReply({
                type: 'GET_REPLY',
                error: true,
                payload: e,
              })
            })
        })
        .catch(e => {
          sendReply({
            type: 'GET_REPLY',
            error: true,
            payload: e,
          })
        })

      return true
    }
  }
})
