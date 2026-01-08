// eslint-disable-next-line no-unused-vars
export function notFound(req, res, next) {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode).json({
    message: err?.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err?.stack } : {}),
  })
}
