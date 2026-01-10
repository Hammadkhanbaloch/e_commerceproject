import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import { apiFetch } from '../lib/api'

function Badge({ children, tone = 'gray' }) {
  const cls =
    tone === 'green'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : tone === 'yellow'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : tone === 'red'
          ? 'bg-red-50 text-red-700 border-red-200'
          : 'bg-gray-100 text-gray-700 border-gray-200'

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>{children}</span>
}

export default function Admin() {
  const { user, loading } = useAuth()

  const [tab, setTab] = useState('products')

  const [summary, setSummary] = useState(null)
  const [summaryError, setSummaryError] = useState('')

  const [products, setProducts] = useState([])
  const [productsError, setProductsError] = useState('')
  const [productsLoading, setProductsLoading] = useState(false)

  const [orders, setOrders] = useState([])
  const [ordersError, setOrdersError] = useState('')
  const [ordersLoading, setOrdersLoading] = useState(false)

  const [users, setUsers] = useState([])
  const [usersError, setUsersError] = useState('')
  const [usersLoading, setUsersLoading] = useState(false)

  const [createForm, setCreateForm] = useState({
    name: '',
    category: 'Men',
    price: '',
    image: '',
    description: '',
    status: 'pending',
  })
  const [createError, setCreateError] = useState('')
  const [createBusy, setCreateBusy] = useState(false)

  const isAdmin = user?.role === 'admin'

  async function loadSummary() {
    setSummaryError('')
    const data = await apiFetch('/api/admin/summary')
    setSummary(data)
  }

  async function loadProducts() {
    setProductsError('')
    setProductsLoading(true)
    try {
      const data = await apiFetch('/api/admin/products')
      setProducts(Array.isArray(data?.items) ? data.items : [])
    } catch (e) {
      setProductsError(e?.message || 'Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }

  async function loadOrders() {
    setOrdersError('')
    setOrdersLoading(true)
    try {
      const data = await apiFetch('/api/admin/orders')
      setOrders(Array.isArray(data?.items) ? data.items : [])
    } catch (e) {
      setOrdersError(e?.message || 'Failed to load orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  async function loadUsers() {
    setUsersError('')
    setUsersLoading(true)
    try {
      const data = await apiFetch('/api/admin/users')
      setUsers(Array.isArray(data?.items) ? data.items : [])
    } catch (e) {
      setUsersError(e?.message || 'Failed to load users')
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    if (!user || !isAdmin) return

    let cancelled = false
    ;(async () => {
      try {
        await loadSummary()
      } catch (e) {
        if (!cancelled) setSummaryError(e?.message || 'Failed to load summary')
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isAdmin])

  useEffect(() => {
    if (!user || !isAdmin) return

    if (tab === 'products') loadProducts()
    if (tab === 'orders') loadOrders()
    if (tab === 'users') loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user?.id, isAdmin])

  const productCounts = useMemo(() => {
    const pending = products.filter((p) => p.status === 'pending').length
    const confirmed = products.filter((p) => p.status === 'confirmed').length
    return { pending, confirmed, total: products.length }
  }, [products])

  if (loading) {
    return (
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/signin" replace />

  if (!isAdmin) {
    return (
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
            <p className="mt-2 text-sm text-gray-600">You don’t have permission to access the admin panel.</p>
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
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">Manage products, orders, and user authority.</p>
          </div>
          <div className="text-sm text-gray-600">
            Signed in as <span className="font-semibold text-gray-900">{user.email}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="text-sm font-semibold text-gray-900">Products confirmed</div>
            <div className="mt-2 text-2xl font-extrabold text-emerald-700">{summary?.products?.confirmed ?? '—'}</div>
            <div className="mt-1 text-xs text-gray-600">Visible in Shop</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="text-sm font-semibold text-gray-900">Products pending</div>
            <div className="mt-2 text-2xl font-extrabold text-amber-700">{summary?.products?.pending ?? '—'}</div>
            <div className="mt-1 text-xs text-gray-600">Need confirmation</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="text-sm font-semibold text-gray-900">Orders created</div>
            <div className="mt-2 text-2xl font-extrabold text-gray-900">{summary?.orders?.created ?? '—'}</div>
            <div className="mt-1 text-xs text-gray-600">New / pending</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="text-sm font-semibold text-gray-900">Orders delivered</div>
            <div className="mt-2 text-2xl font-extrabold text-emerald-700">{summary?.orders?.delivered ?? '—'}</div>
            <div className="mt-1 text-xs text-gray-600">Completed</div>
          </div>
        </div>

        {summaryError ? (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 text-sm text-red-700">{summaryError}</div>
        ) : null}

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {[
            { key: 'products', label: 'Products' },
            { key: 'orders', label: 'Orders' },
            { key: 'users', label: 'Users' },
          ].map((t) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={
                  'rounded-lg border px-4 py-2 text-sm font-semibold transition ' +
                  (active ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-100')
                }
              >
                {t.label}
              </button>
            )
          })}

          <button
            type="button"
            onClick={async () => {
              try {
                await loadSummary()
                if (tab === 'products') await loadProducts()
                if (tab === 'orders') await loadOrders()
                if (tab === 'users') await loadUsers()
              } catch (e) {
                setSummaryError(e?.message || 'Refresh failed')
              }
            }}
            className="ml-auto rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
          >
            Refresh
          </button>
        </div>

        {/* Products */}
        {tab === 'products' ? (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-4">
                <div>
                  <div className="text-base font-bold text-gray-900">Products</div>
                  <div className="mt-1 text-xs text-gray-600">
                    Total: <span className="font-semibold text-gray-900">{productCounts.total}</span> • Pending:{' '}
                    <span className="font-semibold text-gray-900">{productCounts.pending}</span> • Confirmed:{' '}
                    <span className="font-semibold text-gray-900">{productCounts.confirmed}</span>
                  </div>
                </div>
              </div>

              {productsLoading ? (
                <div className="p-4 text-sm text-gray-700">Loading products...</div>
              ) : productsError ? (
                <div className="p-4 text-sm text-red-700">{productsError}</div>
              ) : products.length === 0 ? (
                <div className="p-4 text-sm text-gray-700">No products.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <div key={p._id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="truncate font-semibold text-gray-900">{p.name}</div>
                          <Badge tone={p.status === 'confirmed' ? 'green' : 'yellow'}>{p.status}</Badge>
                          <Badge>{p.category}</Badge>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">$ {p.price}</div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={p.status}
                          onChange={async (e) => {
                            const nextStatus = e.target.value
                            try {
                              await apiFetch(`/api/admin/products/${p._id}`, {
                                method: 'PUT',
                                body: { status: nextStatus },
                              })
                              await loadSummary()
                              await loadProducts()
                            } catch (err) {
                              setProductsError(err?.message || 'Failed to update status')
                            }
                          }}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                        </select>

                        <button
                          type="button"
                          onClick={async () => {
                            const ok = window.confirm('Delete this product?')
                            if (!ok) return
                            try {
                              await apiFetch(`/api/admin/products/${p._id}`, { method: 'DELETE' })
                              await loadSummary()
                              await loadProducts()
                            } catch (err) {
                              setProductsError(err?.message || 'Failed to delete product')
                            }
                          }}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-4">
                <div className="text-base font-bold text-gray-900">Add product</div>
                <div className="mt-1 text-xs text-gray-600">New products start as pending unless confirmed.</div>
              </div>

              <form
                className="p-4 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setCreateError('')
                  setCreateBusy(true)
                  try {
                    await apiFetch('/api/admin/products', {
                      method: 'POST',
                      body: {
                        ...createForm,
                        price: Number(createForm.price),
                      },
                    })
                    setCreateForm({ name: '', category: 'Men', price: '', image: '', description: '', status: 'pending' })
                    await loadSummary()
                    await loadProducts()
                  } catch (err) {
                    setCreateError(err?.message || 'Failed to create product')
                  } finally {
                    setCreateBusy(false)
                  }
                }}
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Name</label>
                  <input
                    value={createForm.name}
                    onChange={(e) => setCreateForm((s) => ({ ...s, name: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700">Category</label>
                    <select
                      value={createForm.category}
                      onChange={(e) => setCreateForm((s) => ({ ...s, category: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Child">Child</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700">Price</label>
                    <input
                      value={createForm.price}
                      onChange={(e) => setCreateForm((s) => ({ ...s, price: e.target.value }))}
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Image (URL or /public path)</label>
                  <input
                    value={createForm.image}
                    onChange={(e) => setCreateForm((s) => ({ ...s, image: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    placeholder="/Men-product/b1.webp"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Description</label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm((s) => ({ ...s, description: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm((s) => ({ ...s, status: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                  </select>
                </div>

                {createError ? <div className="text-sm text-red-700">{createError}</div> : null}

                <button
                  type="submit"
                  disabled={createBusy}
                  className={
                    'w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition ' +
                    (createBusy ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700')
                  }
                >
                  {createBusy ? 'Creating...' : 'Create product'}
                </button>
              </form>
            </div>
          </div>
        ) : null}

        {/* Orders */}
        {tab === 'orders' ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-4">
              <div className="text-base font-bold text-gray-900">Orders</div>
              <div className="mt-1 text-xs text-gray-600">Update order status to complete/confirm steps.</div>
            </div>

            {ordersLoading ? (
              <div className="p-4 text-sm text-gray-700">Loading orders...</div>
            ) : ordersError ? (
              <div className="p-4 text-sm text-red-700">{ordersError}</div>
            ) : orders.length === 0 ? (
              <div className="p-4 text-sm text-gray-700">No orders.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <div key={o._id} className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-semibold text-gray-900">Order</div>
                        <div className="text-sm text-gray-700">#{String(o._id).slice(-6)}</div>
                        <Badge tone={o.status === 'delivered' ? 'green' : o.status === 'cancelled' ? 'red' : 'gray'}>{o.status}</Badge>
                      </div>
                      <div className="mt-1 text-xs text-gray-600">
                        User: <span className="font-semibold text-gray-900">{o?.user?.email || '—'}</span> • Total:{' '}
                        <span className="font-semibold text-gray-900">$ {o.totalPrice}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={o.status}
                        onChange={async (e) => {
                          const next = e.target.value
                          try {
                            await apiFetch(`/api/admin/orders/${o._id}/status`, {
                              method: 'PUT',
                              body: { status: next },
                            })
                            await loadSummary()
                            await loadOrders()
                          } catch (err) {
                            setOrdersError(err?.message || 'Failed to update status')
                          }
                        }}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      >
                        <option value="created">created</option>
                        <option value="paid">paid</option>
                        <option value="shipped">shipped</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Users */}
        {tab === 'users' ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-4">
              <div className="text-base font-bold text-gray-900">Users</div>
              <div className="mt-1 text-xs text-gray-600">Manage authority (user/admin).</div>
            </div>

            {usersLoading ? (
              <div className="p-4 text-sm text-gray-700">Loading users...</div>
            ) : usersError ? (
              <div className="p-4 text-sm text-red-700">{usersError}</div>
            ) : users.length === 0 ? (
              <div className="p-4 text-sm text-gray-700">No users.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {users.map((u) => (
                  <div key={u._id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="truncate font-semibold text-gray-900">{u.name}</div>
                        <div className="truncate text-sm text-gray-700">{u.email}</div>
                        <Badge tone={u.role === 'admin' ? 'green' : 'gray'}>{u.role}</Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={u.role}
                        onChange={async (e) => {
                          const nextRole = e.target.value
                          try {
                            await apiFetch(`/api/admin/users/${u._id}/role`, {
                              method: 'PUT',
                              body: { role: nextRole },
                            })
                            await loadSummary()
                            await loadUsers()
                          } catch (err) {
                            setUsersError(err?.message || 'Failed to update role')
                          }
                        }}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>

                      <button
                        type="button"
                        onClick={async () => {
                          const nextPassword = window.prompt('Set a new password for this user:')
                          if (!nextPassword) return
                          try {
                            await apiFetch(`/api/admin/users/${u._id}/password`, {
                              method: 'PUT',
                              body: { password: nextPassword },
                            })
                          } catch (err) {
                            setUsersError(err?.message || 'Failed to set password')
                          }
                        }}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
                      >
                        Set password
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
