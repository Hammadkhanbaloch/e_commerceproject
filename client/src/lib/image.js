export function normalizeImageSrc(src) {
  if (src == null) return ''

  const raw = String(src).trim()
  if (!raw) return ''

  // Already a root-relative path.
  if (raw.startsWith('/')) return raw

  // Absolute URL: keep it unless it's pointing at localhost (common from dev seed/data).
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

  // Relative path like "Men-product/b1.webp" -> "/Men-product/b1.webp"
  const cleaned = raw.replace(/^\.\/+/, '')
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}
