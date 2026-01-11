import { Link } from 'react-router-dom'

export default function Footer() {
  const facebookProfileUrl =
    'https://www.facebook.com/profile.php?id=61585985116496&mibextid=ZbWKwL'
  const instagramUrl = 'https://www.instagram.com/ready.madeclothes?igsh=bHR5ajl6aGQ0MWs2'
  const instagramDmUrl = 'https://ig.me/m/ready.madeclothes'
  const whatsappUrl = 'https://wa.me/923176661700'

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="text-lg font-extrabold tracking-widest text-emerald-700">ECO-STYLE</div>
            <p className="mt-2 text-sm text-gray-600">Sustainable & Ready-to-Wear</p>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Quick Links</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link className="text-gray-600 hover:text-emerald-700" to="/">
                Home
              </Link>
              <Link className="text-gray-600 hover:text-emerald-700" to="/shop">
                Shop
              </Link>
              <Link className="text-gray-600 hover:text-emerald-700" to="/signin">
                Sign In
              </Link>
              <Link className="text-gray-600 hover:text-emerald-700" to="/register">
                Register
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Support</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link className="text-gray-600 hover:text-emerald-700" to="/contact">
                Contact Us
              </Link>
              <a
                className="text-gray-600 hover:text-emerald-700"
                href={facebookProfileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
              <a className="text-gray-600 hover:text-emerald-700" href={instagramUrl} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a className="text-gray-600 hover:text-emerald-700" href={instagramDmUrl} target="_blank" rel="noreferrer">
                Direct Message
              </a>
              <a className="text-gray-600 hover:text-emerald-700" href={whatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="py-4 border-t border-gray-100 text-sm text-gray-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} ECO-STYLE. All rights reserved.</span>
          <span>Built for clothing e-commerce</span>
        </div>
      </div>
    </footer>
  )
}
