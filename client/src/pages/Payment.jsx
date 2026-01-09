import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductReviews from '../components/ProductReviews'
import RatingStars from '../components/RatingStars'
import { apiFetch } from '../lib/api'
import { normalizeImageSrc } from '../lib/image'

export default function Payment() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [loadError, setLoadError] = useState('')

  const productId = useMemo(() => String(id || ''), [id])

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      if (!productId) return
      try {
        setLoadError('')
        setLoadingProduct(true)
        const data = await apiFetch(`/api/products/${productId}`, { auth: false, signal: controller.signal })
        setProduct(data?.item || null)
      } catch (e) {
        if (e?.name !== 'AbortError') {
          setLoadError(e?.message || 'Failed to load product')
          setProduct(null)
        }
      } finally {
        setLoadingProduct(false)
      }
    }

    load()
    return () => controller.abort()
  }, [productId])

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setOrderId('')

    if (!product) {
      setError('Product not found.')
      return
    }

    const baseMissing = !fullName.trim() || !email.trim() || !address.trim()
    const cardMissing = !cardNumber.trim() || !expiry.trim() || !cvc.trim()

    if (baseMissing || (paymentMethod === 'card' && cardMissing)) {
      setError('Please fill all fields.')
      return
    }

    try {
      const data = await apiFetch('/api/orders', {
        method: 'POST',
        body: {
          productId: product._id,
          qty: 1,
          paymentMethod,
          shippingAddress: { fullName, email, address },
        },
      })
      setOrderId(data?.item?._id || '')
      setSuccess(true)
    } catch (e2) {
      setError(e2?.status === 401 ? 'Please sign in to place an order.' : (e2?.message || 'Failed to place order'))
    }
  }

  if (loadingProduct) {
    return (
      <div className="bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700">Loading product...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
            <p className="mt-2 text-sm text-gray-600">{loadError || 'Selected product was not found.'}</p>
            <div className="mt-6">
              <Link to="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Payment</h1>
            <p className="mt-1 text-sm text-gray-600">Complete your order securely.</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Back to Shop
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Selected product */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="h-80 bg-gray-100">
              <img
                src={normalizeImageSrc(product.image)}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = '/auth-side.svg'
                }}
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{product.name}</div>
                  <div className="mt-1 text-sm text-gray-600">Premium clothing item</div>
                  <div className="mt-3">
                    <RatingStars rating={product.ratingAvg} reviews={product.reviewsCount} />
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">$ {product.price}</div>
              </div>

              <div className="mt-6 rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">$ {product.price}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">$ 0</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">$ {product.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">Billing details</h2>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <div className="block text-sm font-medium text-gray-700">Payment method</div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                      paymentMethod === 'card'
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-semibold text-gray-900">Card</span>
                      <span className="block text-gray-600">Pay now using your card</span>
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-semibold text-gray-900">Cash on delivery</span>
                      <span className="block text-gray-600">Pay when your order arrives</span>
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">
                  Full name
                </label>
                <input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                />
              </div>

              {paymentMethod === 'card' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="cardNumber">
                      Card number
                    </label>
                    <input
                      id="cardNumber"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="expiry">
                      Expiry
                    </label>
                    <input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="cvc">
                      CVC
                    </label>
                    <input
                      id="cvc"
                      inputMode="numeric"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                  You selected <span className="font-semibold">Cash on Delivery</span>. You will pay when the order arrives.
                </div>
              )}

              {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}
              {success ? (
                <p className="text-sm text-emerald-700 font-semibold">
                  {paymentMethod === 'cod'
                    ? 'Order placed (Cash on Delivery). Thank you!'
                    : 'Payment submitted (demo). Thank you!'}
                  {orderId ? ` Order ID: ${orderId}` : ''}
                </p>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 px-5 py-3 text-white font-semibold hover:bg-emerald-700 transition"
              >
                {paymentMethod === 'cod' ? 'Place order (COD)' : `Pay $ ${product.price}`}
              </button>

              <p className="text-xs text-gray-500">Demo only: no real payment is processed.</p>
            </form>
          </div>

          <div className="lg:col-span-2">
            <ProductReviews productId={product._id} />
          </div>
        </div>
      </div>
    </div>
  )
}
