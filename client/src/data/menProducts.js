export const menProducts = [
  { id: 'm1', name: 'Men Product 1', price: 27, rating: 4.4, reviews: 91, image: '/Men-product/b1.webp' },
  { id: 'm2', name: 'Men Product 2', price: 33, rating: 4.2, reviews: 64, image: '/Men-product/b2.jpg' },
  { id: 'm3', name: 'Men Product 3', price: 29, rating: 4.6, reviews: 156, image: '/Men-product/b4.jpg' },
  { id: 'm4', name: 'Men Product 4', price: 36, rating: 4.3, reviews: 79, image: '/Men-product/b6.jpg' },
]

export function getMenProductById(id) {
  return menProducts.find((p) => p.id === String(id))
}
