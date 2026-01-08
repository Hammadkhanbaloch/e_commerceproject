export const womenProducts = [
  { id: 'w1', name: 'Women Product 1', price: 26, rating: 4.5, reviews: 88, image: '/women-product/m1.jpg' },
  { id: 'w2', name: 'Women Product 2', price: 32, rating: 4.2, reviews: 61, image: '/women-product/m2.jpg' },
  { id: 'w3', name: 'Women Product 3', price: 28, rating: 4.7, reviews: 140, image: '/women-product/m3.jpg' },
  { id: 'w4', name: 'Women Product 4', price: 35, rating: 4.4, reviews: 73, image: '/women-product/m4.png' },
]

export function getWomenProductById(id) {
  return womenProducts.find((p) => p.id === String(id))
}
