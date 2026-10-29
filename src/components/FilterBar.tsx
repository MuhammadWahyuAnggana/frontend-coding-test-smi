import type { Category, SortOption, StockFilter } from '../types/product'
import { formatCategory } from '../utils/products'

type Props = {
  search: string
  category: string
  stock: StockFilter
  sort: SortOption
  categories: Category[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStockChange: (value: StockFilter) => void
  onSortChange: (value: SortOption) => void
  onReset: () => void
}

export function FilterBar({
  search,
  category,
  stock,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onStockChange,
  onSortChange,
  onReset,
}: Props) {
  return (
    <section className="filter-panel" aria-label="Product filters">
      <label className="search-field">
        <span>Search catalogue</span>
        <input
          type="search"
          placeholder="Product, brand, description…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label>
        <span>Category</span>
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>{formatCategory(item.name)}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Stock</span>
        <select value={stock} onChange={(event) => onStockChange(event.target.value as StockFilter)}>
          <option value="all">All stock states</option>
          <option value="in-stock">In stock</option>
          <option value="low-stock">Low stock</option>
          <option value="out-of-stock">Out of stock</option>
        </select>
      </label>

      <label>
        <span>Sort</span>
        <select value={sort} onChange={(event) => onSortChange(event.target.value as SortOption)}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price · low to high</option>
          <option value="price-desc">Price · high to low</option>
          <option value="rating-desc">Rating · highest</option>
          <option value="stock-asc">Stock · lowest first</option>
        </select>
      </label>

      <button className="text-button" type="button" onClick={onReset}>Reset filters</button>
    </section>
  )
}
