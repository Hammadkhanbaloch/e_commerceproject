export default function RatingStars({ rating = 0, reviews }) {
  const safeRating = Number.isFinite(rating) ? rating : 0
  const fullStars = Math.max(0, Math.min(5, Math.round(safeRating)))

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, idx) => {
          const starIndex = idx + 1
          const isFull = starIndex <= fullStars
          return (
            <svg
              key={starIndex}
              viewBox="0 0 20 20"
              className={`h-4 w-4 ${isFull ? 'text-emerald-600' : 'text-gray-300'}`}
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.95 8.709c-.783-.57-.38-1.81.588-1.81H6.999a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
          )
        })}
      </div>

      <span className="font-semibold text-gray-900">{safeRating.toFixed(1)}</span>
      {typeof reviews === 'number' ? <span className="text-gray-500">({reviews})</span> : null}
    </div>
  )
}
