export type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage?: number
  rating: number
  stock: number
  brand?: string
  sku?: string
  thumbnail: string
  availabilityStatus?: string
}

export type ProductsResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type Category = {
  slug: string
  name: string
  url: string
}

export type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'stock-asc'
