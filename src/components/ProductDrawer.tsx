import { useEffect, useRef } from 'react'
import type { Product } from '../types/product'
import { classifyStock, formatCategory, formatCurrency } from '../utils/products'

type Props = {
  product: Product | null
  onClose: () => void
}

export function ProductDrawer({ product, onClose }: Props) {
  const drawerRef = useRef<HTMLElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!product) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const app = document.querySelector<HTMLElement>('.app-shell')
    const siblings = app ? Array.from(app.children).filter((element): element is HTMLElement => element instanceof HTMLElement && !element.classList.contains('drawer-backdrop')) : []
    const previousInert = siblings.map((element) => element.inert)
    siblings.forEach((element) => { element.inert = true })
    document.body.style.overflow = 'hidden'
    drawerRef.current?.querySelector<HTMLButtonElement>('button')?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current()
      }
      if (event.key === 'Tab') {
        const controls = drawerRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, select, textarea, [tabindex="0"]')
        if (!controls?.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      siblings.forEach((element, index) => { element.inert = previousInert[index] })
      previousFocus?.focus({ preventScroll: true })
    }
  }, [product])

  if (!product) return null

  const stockState = classifyStock(product.stock)

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside ref={drawerRef} className="product-drawer" role="dialog" aria-modal="true" aria-labelledby="product-drawer-title" onMouseDown={(event) => event.stopPropagation()} tabIndex={-1}>
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
