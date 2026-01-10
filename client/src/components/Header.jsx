import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../lib/authContext'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold tracking-widest text-emerald-700">ECO-STYLE</span>
            <span className="hidden sm:inline text-sm text-gray-500">Clothing Store</span>
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                'px-3 py-2 text-sm font-medium rounded-md transition ' +
                (isActive ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50')
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                'px-3 py-2 text-sm font-medium rounded-md transition ' +
                (isActive ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50')
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                'px-3 py-2 text-sm font-medium rounded-md transition ' +
                (isActive ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50')
              }
            >
              Contact
            </NavLink>

            {user ? (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  'px-3 py-2 text-sm font-medium rounded-md transition ' +
                  (isActive ? 'text-white bg-emerald-700' : 'text-white bg-emerald-600 hover:bg-emerald-700')
                }
              >
                Profile
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/signin"
                  className={({ isActive }) =>
                    'px-3 py-2 text-sm font-medium rounded-md transition ' +
                    (isActive ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50')
                  }
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    'px-3 py-2 text-sm font-medium rounded-md transition ' +
                    (isActive ? 'text-white bg-emerald-700' : 'text-white bg-emerald-600 hover:bg-emerald-700')
                  }
                >
                  Register
                </NavLink>
              </>
            )}

            {user?.role === 'admin' ? (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  'px-3 py-2 text-sm font-medium rounded-md transition ' +
                  (isActive ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50')
                }
              >
                Admin
              </NavLink>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  )
}
