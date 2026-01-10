import dotenv from 'dotenv'
import { connectDb } from '../config/db.js'
import { Product } from '../models/Product.js'

dotenv.config()

const products = [
  // Men (images from client/public/Men-product)
  {
    name: 'Men Product 1',
    category: 'Men',
    price: 27,
    ratingAvg: 4.4,
    reviewsCount: 91,
    image: '/Men-product/b1.webp',
    description: 'Men product from Men-product folder.',
    status: 'confirmed',
  },
  {
    name: 'Men Product 2',
    category: 'Men',
    price: 33,
    ratingAvg: 4.2,
    reviewsCount: 64,
    image: '/Men-product/b2.jpg',
    description: 'Men product from Men-product folder.',
    status: 'confirmed',
  },
  {
    name: 'Men Product 3',
    category: 'Men',
    price: 29,
    ratingAvg: 4.6,
    reviewsCount: 156,
    image: '/Men-product/b4.jpg',
    description: 'Men product from Men-product folder.',
    status: 'confirmed',
  },
  {
    name: 'Men Product 4',
    category: 'Men',
    price: 36,
    ratingAvg: 4.3,
    reviewsCount: 79,
    image: '/Men-product/b6.jpg',
    description: 'Men product from Men-product folder.',
    status: 'confirmed',
  },

  // Women (images from client/public/women-product)
  {
    name: 'Women Product 1',
    category: 'Women',
    price: 26,
    ratingAvg: 4.5,
    reviewsCount: 88,
    image: '/women-product/m1.jpg',
    description: 'Women product from women-product folder.',
    status: 'confirmed',
  },
  {
    name: 'Women Product 2',
    category: 'Women',
    price: 32,
    ratingAvg: 4.2,
    reviewsCount: 61,
    image: '/women-product/m2.jpg',
    description: 'Women product from women-product folder.',
    status: 'confirmed',
  },
  {
    name: 'Women Product 3',
    category: 'Women',
    price: 28,
    ratingAvg: 4.7,
    reviewsCount: 140,
    image: '/women-product/m3.jpg',
    description: 'Women product from women-product folder.',
    status: 'confirmed',
  },
  {
    name: 'Women Product 4',
    category: 'Women',
    price: 35,
    ratingAvg: 4.4,
    reviewsCount: 73,
    image: '/women-product/m4.png',
    description: 'Women product from women-product folder.',
    status: 'confirmed',
  },

  // Child
  {
    name: 'Kids T-Shirt',
    category: 'Child',
    price: 19,
    image: '/auth-slides/1.jpg',
    description: 'Soft cotton t-shirt for kids.',
    status: 'confirmed',
  },
  {
    name: 'Kids Hoodie',
    category: 'Child',
    price: 24,
    image: '/auth-slides/my.jpg',
    description: 'Cozy hoodie for kids.',
    status: 'confirmed',
  },
]

async function main() {
  await connectDb(process.env.MONGO_URI)

  await Product.deleteMany({})
  await Product.insertMany(products)

  console.log(`[seed] inserted ${products.length} products`)
  process.exit(0)
}

main().catch((err) => {
  console.error('[seed] failed', err)
  process.exit(1)
})
