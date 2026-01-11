export default function Contact() {
  const phoneDisplay = '+92 3176 661 700'
  const phoneE164 = '+923176661700'
  const whatsappNumber = '923176661700'
  const facebookProfileUrl =
    'https://www.facebook.com/profile.php?id=61585985116496&mibextid=ZbWKwL'
  const instagramUrl = 'https://www.instagram.com/ready.madeclothes?igsh=bHR5ajl6aGQ0MWs2'
  const instagramDmUrl = 'https://ig.me/m/ready.madeclothes'

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Contact Us</h1>
          <p className="mt-2 text-sm text-gray-600">We’re here to help. Reach us using any option below.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            href={facebookProfileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:bg-gray-50 transition"
          >
            <div className="text-sm font-semibold text-gray-900">Facebook</div>
            <div className="mt-1 text-sm text-gray-600">Visit our Facebook profile</div>
          </a>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:bg-gray-50 transition"
          >
            <div className="text-sm font-semibold text-gray-900">WhatsApp</div>
            <div className="mt-1 text-sm text-gray-600">Chat with us on WhatsApp</div>
            <div className="mt-3 text-sm font-semibold text-emerald-700">{phoneE164}</div>
          </a>

          <a
            href={`tel:${phoneE164}`}
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:bg-gray-50 transition"
          >
            <div className="text-sm font-semibold text-gray-900">Phone</div>
            <div className="mt-1 text-sm text-gray-600">Call us directly</div>
            <div className="mt-3 text-sm font-semibold text-emerald-700">{phoneDisplay}</div>
          </a>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:bg-gray-50 transition"
          >
            <div className="text-sm font-semibold text-gray-900">Instagram</div>
            <div className="mt-1 text-sm text-gray-600">Follow us on Instagram</div>
          </a>

          <a
            href={instagramDmUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:bg-gray-50 transition"
          >
            <div className="text-sm font-semibold text-gray-900">Direct Message</div>
            <div className="mt-1 text-sm text-gray-600">Send us a DM on Instagram</div>
          </a>
        </div>
      </div>
    </div>
  )
}
