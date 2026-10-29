import type { Product } from '../types/product'
import { classifyStock, formatCategory, formatCurrency } from '../utils/products'

type Props = {
  product: Product | null
  onClose: () => void
}

export function ProductDrawer({ product, onClose }: Props) {
  if (!product) return null

  const stockState = classifyStock(product.stock)

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="product-drawer" role="dialog" aria-modal="true" aria-labelledby="product-drawer-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <span>PRODUCT / {String(product.id).padStart(3, '0')}</span>
          <button type="button" onClick={onClose} aria-label="Close product detail">Close ×</button>
        </div>

        <div className="drawer-image-wrap">
          <img src={product.thumbnail} alt={product.title} />
        </div>

        <div className="drawer-copy">
          <p className="eyebrow">{formatCategory(product.category)}</p>
          <h2 id="product-drawer-title">{product.title}</h2>
          <p className="drawer-description">{product.description}</p>

          <dl className="detail-grid">
            <div><dt>Price</dt><dd>{formatCurrency(product.price)}</dd></div>
            <div><dt>Rating</dt><dd>{product.rating.toFixed(1)} / 5</dd></div>
            <div><dt>Stock</dt><dd>{product.stock} units</dd></div>
            <div><dt>Status</dt><dd className={`detail-stock detail-stock--${stockState}`}>{product.availabilityStatus || stockState.replace(/-/g, ' ')}</dd></div>
            <div><dt>Brand</dt><dd>{product.brand || '—'}</dd></div>
            <div><dt>SKU</dt><dd>{product.sku || '—'}</dd></div>
          </dl>
        </div>
      </aside>
    </div>
  )
}
