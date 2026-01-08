import { useAuth } from '../lib/authContext'

export default function Profile() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-sm text-gray-600">Please sign in to view your profile.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Name:</span> {user.name}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.email}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
