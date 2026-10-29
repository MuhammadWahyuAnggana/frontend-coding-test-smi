import type { Product } from '../types/product'
import { classifyStock, formatCategory, formatCurrency } from '../utils/products'

type Props = {
  product: Product
  onOpen: (product: Product) => void
}

export function ProductCard({ product, onOpen }: Props) {
  const stockState = classifyStock(product.stock)
  const stockLabel = stockState === 'out-of-stock' ? 'Out of stock' : stockState === 'low-stock' ? 'Low stock' : 'In stock'

  return (
    <article className="product-card">
      <button className="product-media" type="button" onClick={() => onOpen(product)} aria-label={`Open ${product.title} details`}>
        <img src={product.thumbnail} alt="" loading="lazy" />
        <span className={`stock-pill stock-pill--${stockState}`}>{stockLabel}</span>
      </button>

      <div className="product-content">
        <div className="product-meta-line">
          <span>{formatCategory(product.category)}</span>
          <span>#{String(product.id).padStart(3, '0')}</span>
        </div>
        <h3>{product.title}</h3>
        <p>{product.brand || 'Independent brand'}</p>
        <div className="product-bottom-line">
          <strong>{formatCurrency(product.price)}</strong>
          <button type="button" onClick={() => onOpen(product)} aria-label={`Details for ${product.title}`}>Details ↗</button>
        </div>
      </div>
    </article>
  )
}
