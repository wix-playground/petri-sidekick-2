export const setCookie = (
  name: string,
  value: string,
  domain: string,
  secure = true,
) =>
  new Promise(resolve => {
    const protocol = secure ? 'https:' : 'http:'
    const url = `${protocol}//${domain.replace(/^\./, '')}/`

    if (value) {
      const options = {
        url,
        name,
        value,
        domain,
        path: '/',
        secure,
        httpOnly: false,
        sameSite: secure ? 'no_restriction' : 'unspecified',
        expirationDate: Math.floor(Date.now() / 1000) + 3600 * 24 * 7, //week
      }

      chrome.cookies.set(options, resolve)
    } else {
      chrome.cookies.remove({url, name}, resolve)
    }
  })
