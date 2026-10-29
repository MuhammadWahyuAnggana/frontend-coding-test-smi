import { useCallback, useEffect, useState } from 'react'
import { fetchCategories, fetchProducts } from '../services/products'
import type { Category, Product } from '../types/product'

type ProductsState = {
  products: Product[]
  categories: Category[]
  loading: boolean
  error: string | null
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>({
    products: [],
    categories: [],
    loading: true,
    error: null,
  })
  const [refreshKey, setRefreshKey] = useState(0)

  const retry = useCallback(() => {
    setRefreshKey((key) => key + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setState((current) => ({ ...current, loading: true, error: null }))
      try {
        const [products, categories] = await Promise.all([
          fetchProducts(controller.signal),
          fetchCategories(controller.signal),
        ])

        setState({ products, categories, loading: false, error: null })
      } catch (error) {
        if (controller.signal.aborted) return
        setState({
          products: [],
          categories: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Unexpected error while loading products',
        })
      }
    }

    load()
    return () => controller.abort()
  }, [refreshKey])

  return { ...state, retry }
}
