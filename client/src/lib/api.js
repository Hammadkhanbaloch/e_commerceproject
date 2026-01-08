import { getAuthToken } from './auth'

export async function apiFetch(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    signal,
  } = options

  const nextHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined) {
    nextHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getAuthToken()
    if (token) {
      nextHeaders.Authorization = `Bearer ${token}`
    }
  }

  const res = await fetch(path, {
    method,
    headers: nextHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  let data = null
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null)
  } else {
    data = await res.text().catch(() => null)
  }

  if (!res.ok) {
    const message = (data && typeof data === 'object' && data.message) ? data.message : `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}
