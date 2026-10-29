import type { Product, SortOption, StockFilter } from '../types/product'

export const PAGE_SIZE = 12

export function classifyStock(stock: number): Exclude<StockFilter, 'all'> {
  if (stock <= 0) return 'out-of-stock'
  if (stock <= 10) return 'low-stock'
  return 'in-stock'
}

export function filterProducts(
  products: Product[],
  searchTerm: string,
  category: string,
  stockFilter: StockFilter,
): Product[] {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  return products.filter((product) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.title.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch) ||
      product.brand?.toLowerCase().includes(normalizedSearch)

    const matchesCategory = category === 'all' || product.category === category
    const matchesStock = stockFilter === 'all' || classifyStock(product.stock) === stockFilter

    return Boolean(matchesSearch && matchesCategory && matchesStock)
  })
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products]

  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'rating-desc':
      return copy.sort((a, b) => b.rating - a.rating)
    case 'stock-asc':
      return copy.sort((a, b) => a.stock - b.stock)
    default:
      return copy.sort((a, b) => a.id - b.id)
  }
}

export function paginateProducts(products: Product[], page: number): Product[] {
  const start = (page - 1) * PAGE_SIZE
  return products.slice(start, start + PAGE_SIZE)
}

export function getProductMetrics(products: Product[]) {
  const total = products.length
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 10).length
  const outOfStock = products.filter((product) => product.stock <= 0).length
  const averageRating = total
    ? products.reduce((sum, product) => sum + product.rating, 0) / total
    : 0

  return {
    total,
    lowStock,
    outOfStock,
    averageRating,
  }
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCategory(value: string) {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
