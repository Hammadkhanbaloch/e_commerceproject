export const products = [
  { id: 1, name: 'Product 1', price: 24, rating: 4.6, reviews: 128, image: '/auth-slides/1.jpg' },
  { id: 2, name: 'Product 2', price: 29, rating: 4.4, reviews: 96, image: '/auth-slides/my.jpg' },
  { id: 3, name: 'Product 3', price: 34, rating: 4.7, reviews: 212, image: '/auth-slides/my1.webp' },
  { id: 4, name: 'Product 4', price: 39, rating: 4.3, reviews: 74, image: '/auth-slides/my2.webp' },
]

export function getProductById(id) {
  return products.find((p) => p.id === Number(id))
}
