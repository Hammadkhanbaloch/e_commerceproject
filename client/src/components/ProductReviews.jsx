import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'

function clampRating(n) {
  const x = Number(n)
  if (!Number.isFinite(x)) return 5
  return Math.max(1, Math.min(5, Math.round(x)))
}

export default function ProductReviews({ productId }) {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const id = useMemo(() => String(productId), [productId])

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        setError('')
        setLoading(true)
        const data = await apiFetch(`/api/products/${id}/reviews`, { auth: false, signal: controller.signal })
        setItems(Array.isArray(data?.items) ? data.items : [])
        setEditingId(null)
        setName('')
        setRating(5)
        setComment('')
      } catch (e) {
        if (e?.name !== 'AbortError') {
          setError(e?.message || 'Failed to load reviews')
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) load()
    return () => controller.abort()
  }, [id])

  async function reload() {
    const data = await apiFetch(`/api/products/${id}/reviews`, { auth: false })
    setItems(Array.isArray(data?.items) ? data.items : [])
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !comment.trim()) {
      setError('Please enter your name and review.')
      return
    }

    const nextRating = clampRating(rating)

    try {
      if (editingId) {
        await apiFetch(`/api/products/${id}/reviews/${editingId}`, {
          method: 'PUT',
          body: { name: name.trim(), rating: nextRating, comment: comment.trim() },
        })
        setEditingId(null)
      } else {
        await apiFetch(`/api/products/${id}/reviews`, {
          method: 'POST',
          body: { name: name.trim(), rating: nextRating, comment: comment.trim() },
        })
      }

      await reload()
      setName('')
      setRating(5)
      setComment('')
    } catch (e2) {
      setError(e2?.status === 401 ? 'Please sign in to write a review.' : (e2?.message || 'Failed to save review'))
    }
  }

  function onEdit(review) {
    setEditingId(review._id)
    setName(review.displayName || review.user?.name || '')
    setRating(clampRating(review.rating))
    setComment(review.comment || '')
    setError('')
  }

  async function onDelete(reviewId) {
    setError('')
    try {
      await apiFetch(`/api/products/${id}/reviews/${reviewId}`, { method: 'DELETE' })
      await reload()
      if (editingId === reviewId) {
        setEditingId(null)
        setName('')
        setRating(5)
        setComment('')
      }
    } catch (e2) {
      setError(e2?.status === 401 ? 'Please sign in to delete a review.' : (e2?.message || 'Failed to delete review'))
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-900">Reviews</h3>
        <div className="text-sm text-gray-500">{items.length} total</div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="reviewName">
              Your name
            </label>
            <input
              id="reviewName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="reviewRating">
              Rating
            </label>
            <select
              id="reviewRating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r === 1 ? '' : 's'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="reviewComment">
            Review
          </label>
          <textarea
            id="reviewComment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
          />
        </div>

        {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          >
            {editingId ? 'Update review' : 'Add review'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setName('')
                setRating(5)
                setComment('')
                setError('')
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">Loading reviews...</div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            No reviews yet. Be the first to review.
          </div>
        ) : (
          items.map((r) => (
            <div key={r._id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-900">{r.displayName || r.user?.name || 'User'}</div>
                  <div className="mt-1 text-sm text-gray-600">
                    {'★'.repeat(clampRating(r.rating))}
                    {'☆'.repeat(5 - clampRating(r.rating))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(r)}
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(r._id)}
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">{r.comment}</p>
              <div className="mt-3 text-xs text-gray-500">
                {r.updatedAt ? 'Updated' : 'Posted'}: {new Date(r.updatedAt || r.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
