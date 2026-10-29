import type { Category, Product, ProductsResponse } from '../types/product'

const API_BASE = 'https://dummyjson.com'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.category === 'string' &&
    typeof value.price === 'number' &&
    typeof value.rating === 'number' &&
    typeof value.stock === 'number' &&
    typeof value.thumbnail === 'string'
  )
}

function isCategory(value: unknown): value is Category {
  if (!isRecord(value)) return false
  return (
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    typeof value.url === 'string'
  )
}

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }
  return (await response.json()) as T
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const payload = await requestJson<unknown>(`${API_BASE}/products?limit=0`, signal)

  if (!isRecord(payload) || !Array.isArray(payload.products)) {
    throw new Error('Invalid products payload received from the API')
  }

  const validProducts = payload.products.filter(isProduct)
  if (validProducts.length === 0) {
    throw new Error('The API returned no valid product records')
  }

  return validProducts
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const payload = await requestJson<unknown>(`${API_BASE}/products/categories`, signal)
  if (!Array.isArray(payload)) return []
  return payload.filter(isCategory)
}

export type { ProductsResponse }
