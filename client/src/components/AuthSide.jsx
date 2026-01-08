import { useEffect, useMemo, useState } from 'react'
import { authSlides } from '../config/authSlides'

export default function AuthSide() {
  const slides = useMemo(() => authSlides, [])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!slides.length) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 4500)
    return () => window.clearInterval(id)
  }, [slides.length])

  return (
    <div className="hidden lg:block relative w-0 flex-1">
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            className={
              'absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ' +
              (i === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100')
            }
            src={slide.src}
            alt={slide.alt}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/auth-side.svg'
            }}
          />
        ))}

        {/* Softer overlay + gradient for readability */}
        <div className="absolute inset-0 bg-emerald-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>

        <div className="absolute top-8 left-8">
          <h1 className="text-4xl font-bold text-white tracking-widest">ECO-STYLE</h1>
          <p className="text-sm text-gray-200 mt-1">Sustainable & Ready-to-Wear</p>
        </div>

        {(slides[index]?.title || slides[index]?.subtitle) && (
          <div className="absolute bottom-20 left-8 right-8">
            <div className="inline-block rounded-lg bg-black/25 px-4 py-3 text-white backdrop-blur-sm">
              {slides[index]?.title ? (
                <div className="text-lg font-semibold leading-tight">{slides[index].title}</div>
              ) : null}
              {slides[index]?.subtitle ? (
                <div className="mt-1 text-sm text-white/90">{slides[index].subtitle}</div>
              ) : null}
            </div>
          </div>
        )}

        <div className="absolute bottom-8 left-8 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={
                'h-2.5 w-2.5 rounded-full border border-white/70 transition ' +
                (i === index ? 'bg-white/90' : 'bg-white/30 hover:bg-white/50')
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
