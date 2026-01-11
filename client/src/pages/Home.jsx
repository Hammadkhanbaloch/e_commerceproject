import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import RatingStars from '../components/RatingStars'
import { normalizeImageSrc } from '../lib/image'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('men')
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

  const category = useMemo(() => {
    const labelByKey = { men: 'Men', women: 'Women', child: 'Child' }
    const key = activeCategory
    const label = labelByKey[key] || 'Category'

    const filtered = items.filter((p) => String(p?.category || '').toLowerCase() === key)
    return { key, label, items: filtered }
  }, [activeCategory, items])

  const featured = useMemo(() => items.slice(0, 8), [items])

  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-semibold text-emerald-700">READY-MADE</p>
              <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Sustainable clothing for everyday life
              </h1>
              <p className="mt-4 text-gray-600 text-base sm:text-lg">
                Modern ready-to-wear collections with premium quality and responsible materials.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700 transition"
                >
                  Shop now
                </Link>
                <Link
                  to="/signin"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-800 font-semibold hover:bg-gray-50 transition"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="font-semibold text-gray-900">Fast Delivery</div>
                  <div className="mt-1 text-gray-600">Quick shipping</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="font-semibold text-gray-900">Easy Returns</div>
                  <div className="mt-1 text-gray-600">Simple exchange</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="font-semibold text-gray-900">Secure Pay</div>
                  <div className="mt-1 text-gray-600">Safe checkout</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-4/3 w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                <img
                  src="/auth-slides/1.jpg"
                  alt="Featured clothing"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = '/auth-side.svg'
                  }}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shop by category</h2>
              <p className="mt-1 text-sm text-gray-600">Find your style in seconds.</p>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              View all
            </Link>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {[
              { key: 'men', label: 'Men' },
              { key: 'women', label: 'Women' },
              { key: 'child', label: 'Child' },
            ].map((c) => {
              const isActive = activeCategory === c.key
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setActiveCategory(c.key)}
                  className={
                    'inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-semibold transition ' +
                    (isActive
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-100')
                  }
                >
                  {c.label}
                </button>
              )
            })}
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{category.label} products</h3>
                <p className="mt-1 text-sm text-gray-600">Browse {category.label.toLowerCase()} items below.</p>
              </div>
              {category.key !== 'child' ? (
                <Link to="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                  Shop all
                </Link>
              ) : null}
            </div>

            {category.items.length === 0 ? (
              <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">
                {loading ? (
                  <div className="text-sm text-gray-700">Loading products...</div>
                ) : error ? (
                  <div className="text-sm text-red-700">{error}</div>
                ) : (
                  <>
                    <div className="font-semibold text-gray-900">No {category.label} products found</div>
                    <div className="mt-1 text-sm text-gray-600">Seed the database, then refresh.</div>
                  </>
                )}
                <div className="mt-4">
                  <Link to="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                    Go to Shop
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((p) => (
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
                      <div className="font-semibold text-gray-900">{p.name}</div>
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
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900">Featured products</h2>
          <p className="mt-1 text-sm text-gray-600">A few picks our customers love.</p>

          {/** Using your auth-slide images as product thumbnails */}
          {/** Update these paths anytime in client/public/auth-slides */}
          {/** 1.jpg, my.jpg, my1.webp, my2.webp */}
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              <div className="col-span-full rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
                Loading products...
              </div>
            ) : error ? (
              <div className="col-span-full rounded-xl border border-gray-200 bg-white p-6 text-sm text-red-700">
                {error}
              </div>
            ) : featured.length === 0 ? (
              <div className="col-span-full rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
                No products found. Seed the database, then refresh.
              </div>
            ) : (
              featured.map((p) => (
              <div key={p._id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="h-44 bg-gray-100">
                    <img
                      src={normalizeImageSrc(p.image)}
                    alt={p.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/auth-side.svg'
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="font-semibold text-gray-900">{p.name}</div>
                  <div className="mt-1 text-sm text-gray-600">Premium quality</div>
                  <div className="mt-3">
                    <RatingStars rating={p.ratingAvg} reviews={p.reviewsCount} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-900">$ {p.price}</div>
                    <Link
                      to={`/payment/${p._id}`}
                      className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Buy
                    </Link>
                  </div>
                </div>
              </div>
            ))) }
          </div>
        </div>
      </section>
    </div>
  )
}
