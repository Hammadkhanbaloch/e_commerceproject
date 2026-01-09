import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../lib/api'
import RatingStars from '../components/RatingStars'
import { normalizeImageSrc } from '../lib/image'

export default function Shop() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        setError('')
        setLoading(true)
        const data = await apiFetch('/api/products', { auth: false, signal: controller.signal })
        setItems(Array.isArray(data?.items) ? data.items : [])
      } catch (e) {
        if (e?.name !== 'AbortError') {
          setError(e?.message || 'Failed to load products')
        }
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shop</h1>
            <p className="mt-1 text-sm text-gray-600">Browse all products (Men, Women, Child).</p>
          </div>
          <Link to="/" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Back to Home
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
              Loading products...
            </div>
          ) : error ? (
            <div className="col-span-full rounded-xl border border-gray-200 bg-white p-6 text-sm text-red-700">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
              No products found. Seed the database, then refresh.
            </div>
          ) : (
            items.map((p) => (
              <div key={p._id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="h-52 bg-gray-100">
                <img
                  src={normalizeImageSrc(p.image)}
                  alt={p.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = '/auth-side.svg'
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold text-gray-900">{p.name}</div>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                    {p.category}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">Premium quality</div>
                <div className="mt-3">
                  <RatingStars rating={p.ratingAvg} reviews={p.reviewsCount} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">$ {p.price}</div>
                  <Link
                    to={`/payment/${p._id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                  >
                    Buy
                  </Link>
                </div>
              </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
