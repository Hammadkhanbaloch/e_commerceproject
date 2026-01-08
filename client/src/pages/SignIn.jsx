import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle, FaFacebookF } from 'react-icons/fa'; // Requires react-icons package
import AuthSide from '../components/AuthSide.jsx'
import { apiFetch } from '../lib/api'
import { useAuth } from '../lib/authContext'

export default function SignIn() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter email and password.')
      return
    }

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: { email, password },
      })
      if (data?.token) {
        await loginWithToken(data.token)
      }
      navigate('/shop')
    } catch (e) {
      setError(e?.message || 'Sign in failed')
    }
  }

  return (
    // Outer container for the full screen layout
    <div className="min-h-screen flex">

      <AuthSide />

      {/* Right Side: Sign In Form Container */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Title & Subtitle Section */}
          <div>
            <h1 className="lg:hidden text-3xl font-extrabold text-emerald-600">
                ECO-STYLE
            </h1>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Not a member? 
              <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500 transition duration-150">
                Create an Account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            
            {/* --- CORE FORM START --- */}
            <form onSubmit={onSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // Modern, branded styling for inputs
                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition duration-150"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    autoComplete="current-password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // Modern, branded styling for inputs
                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition duration-150"
                  />
                </div>
              </div>

              {/* Error Message Display */}
              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

              {/* Options: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    name="remember-me" 
                    type="checkbox" 
                    // Branded checkbox color
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition duration-150">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Sign In Button (Primary CTA) */}
              <div>
                <button 
                  type="submit" 
                  // Branded button styling
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
                >
                  Sign In
                </button>
              </div>
            </form>
            {/* --- CORE FORM END --- */}

            {/* Social Sign In Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or sign in with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {/* Google Button (Using FaGoogle from react-icons) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setError('Continue with Google is not configured yet.')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150"
                  >
                    <FaGoogle className="w-5 h-5 text-red-600"/>
                    <span className="ml-3">Google</span>
                  </button>
                </div>
                
                {/* Facebook Button (Using FaFacebookF from react-icons) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setError('Continue with Facebook is not configured yet.')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150"
                  >
                    <FaFacebookF className="w-5 h-5 text-blue-600"/>
                    <span className="ml-3">Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}