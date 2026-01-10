export function normalizeImageSrc(src) {
  if (src == null) return ''

  const raw = String(src).trim()
  if (!raw) return ''

  if (raw.startsWith('/')) return raw

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const url = new URL(raw)
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return `${url.pathname}${url.search}${url.hash}`
      }
      return raw
    } catch {
      return raw
    }
  }

  const cleaned = raw.replace(/^\.\/+/, '')
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}
