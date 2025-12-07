const TOKEN_KEY = 'cf_token'

export function saveToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch (e) {
    console.warn('Failed to save token', e)
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (e) {
    return null
  }
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (e) {}
}

export function authHeader() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
