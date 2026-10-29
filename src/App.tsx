import { useEffect, useMemo, useState } from 'react'
import { FilterBar } from './components/FilterBar'
import { LoginScreen } from './components/LoginScreen'
import { MetricCard } from './components/MetricCard'
import { Pagination } from './components/Pagination'
import { ProductCard } from './components/ProductCard'
import { ProductDrawer } from './components/ProductDrawer'
import { CatalogueEmptyState, EmptyState, ErrorState, LoadingState } from './components/StateViews'
import { useProducts } from './hooks/useProducts'
import type { Product, SortOption, StockFilter } from './types/product'
import { PAGE_SIZE, filterProducts, getProductMetrics, paginateProducts, sortProducts } from './utils/products'

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { products, categories, loading, error, retry } = useProducts()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [stock, setStock] = useState<StockFilter>('all')
  const [sort, setSort] = useState<SortOption>('featured')
  const [page, setPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filteredProducts = useMemo(() => {
    return sortProducts(filterProducts(products, search, category, stock), sort)
  }, [products, search, category, stock, sort])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const visibleProducts = useMemo(() => paginateProducts(filteredProducts, page), [filteredProducts, page])
  const metrics = useMemo(() => getProductMetrics(products), [products])
  const metricsUnavailable = loading || Boolean(error)

  useEffect(() => {
    setPage(1)
  }, [search, category, stock, sort])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  function resetFilters() {
    setSearch('')
    setCategory('all')
    setStock('all')
    setSort('featured')
    setPage(1)
  }

  function logout() {
    localStorage.removeItem('asops-session')
    onLogout()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup brand-lockup--dark">
          <span className="brand-mark">AS</span>
          <span>AS / OPS</span>
        </div>
        <div className="topbar-center">PRODUCT OPERATIONS · DUMMYJSON</div>
        <button className="logout-button" type="button" onClick={logout}>Log out ↗</button>
      </header>

      <main className="dashboard">
        <section className="dashboard-intro">
          <div>
            <p className="eyebrow">PRODUCT CONTROL / 2026</p>
            <h1>Product operations,<br />made clear.</h1>
          </div>
          <p className="dashboard-intro-copy">
            Search the catalogue, monitor stock health, and inspect product details from one focused workspace.
          </p>
        </section>

        <section className="metric-grid" aria-label="Product summary">
          <MetricCard label="TOTAL PRODUCTS" value={metricsUnavailable ? '—' : String(metrics.total)} note="Validated API records" accent />
          <MetricCard label="LOW STOCK" value={metricsUnavailable ? '—' : String(metrics.lowStock)} note="10 units or fewer" />
          <MetricCard label="OUT OF STOCK" value={metricsUnavailable ? '—' : String(metrics.outOfStock)} note="Requires attention" />
          <MetricCard label="AVG. RATING" value={metricsUnavailable || metrics.total === 0 ? '—' : metrics.averageRating.toFixed(2)} note="Across all products" />
        </section>

        <section className="catalogue-section">
          <div className="section-heading">
            <div><span>02</span><h2>Catalogue</h2></div>
            <p role="status" aria-atomic="true">{loading || error ? '—' : filteredProducts.length} matching {filteredProducts.length === 1 ? 'record' : 'records'}</p>
          </div>

          <FilterBar
            search={search}
            category={category}
            stock={stock}
            sort={sort}
            categories={categories}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onStockChange={setStock}
            onSortChange={setSort}
            onReset={resetFilters}
          />

          {loading && <LoadingState />}
          {!loading && error && <ErrorState message={error} onRetry={retry} />}
          {!loading && !error && products.length === 0 && <CatalogueEmptyState onRetry={retry} />}
          {!loading && !error && products.length > 0 && filteredProducts.length === 0 && <EmptyState onReset={resetFilters} />}
          {!loading && !error && filteredProducts.length > 0 && (
            <>
              <div className="product-grid">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <span>AS / OPS</span>
        <span>React · TypeScript · Fetch API</span>
        <span>Front-End Engineer Skill Test</span>
      </footer>

      <ProductDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('asops-session') === 'authenticated')

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />
  }

  return <Dashboard onLogout={() => setAuthenticated(false)} />
}
