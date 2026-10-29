import type { Category, Product, ProductsResponse } from '../types/product'

const API_BASE = 'https://dummyjson.com'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function optionalText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

// Only reject records whose required fields cannot be used safely by the UI.
// Missing or malformed optional metadata should not discard a usable product.
function normalizeProduct(value: unknown): Product | null {
  if (!isRecord(value)) return null

  if (
    !isFiniteNumber(value.id) ||
    typeof value.title !== 'string' ||
    typeof value.description !== 'string' ||
    typeof value.category !== 'string' ||
    !isFiniteNumber(value.price) ||
    !isFiniteNumber(value.rating) ||
    !isFiniteNumber(value.stock) ||
    typeof value.thumbnail !== 'string'
  ) return null

  return {
    id: value.id,
    title: value.title,
    description: value.description,
    category: value.category,
    price: value.price,
    rating: value.rating,
    stock: value.stock,
    thumbnail: value.thumbnail,
    brand: optionalText(value.brand),
    sku: optionalText(value.sku),
    availabilityStatus: optionalText(value.availabilityStatus),
    discountPercentage: isFiniteNumber(value.discountPercentage) ? value.discountPercentage : undefined,
  }
}

function isCategory(value: unknown): value is Category {
  if (!isRecord(value)) return false
  return (
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    typeof value.url === 'string'
  )
}

async function requestJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }
  try {
    return await response.json()
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON response received from the API')
    }
    throw error
  }
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const payload = await requestJson(`${API_BASE}/products?limit=0`, signal)

  if (!isRecord(payload) || !Array.isArray(payload.products)) {
    throw new Error('Invalid products payload received from the API')
  }

  const validProducts = payload.products
    .map(normalizeProduct)
    .filter((product): product is Product => product !== null)
  if (payload.products.length > 0 && validProducts.length === 0) {
    throw new Error('Invalid product data: the API returned records, but none could be displayed safely.')
  }

  return validProducts
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const payload = await requestJson(`${API_BASE}/products/categories`, signal)
  if (!Array.isArray(payload)) return []
  return payload.filter(isCategory)
}

export type { ProductsResponse }
