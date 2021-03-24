import VueCookies from 'vue-cookies'

const TokenKey = 'base_token'

export function getToken() {
  return VueCookies.get(TokenKey)
}

export function setToken(token) {
  return VueCookies.set(TokenKey, token)
}

export function removeToken() {
  return VueCookies.remove(TokenKey)
}
