export function LoadingState() {
  return (
    <div className="state-view" role="status">
      <div className="loading-bars" aria-hidden="true"><i /><i /><i /></div>
      <strong>Fetching catalogue</strong>
      <p>Connecting to DummyJSON and validating the response.</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state-view state-view--error" role="alert">
      <span className="state-code">API / ERROR</span>
      <strong>We could not load the catalogue.</strong>
      <p>{message}</p>
      <button className="primary-button primary-button--small" type="button" onClick={onRetry}>Retry request</button>
    </div>
  )
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="state-view" role="status">
      <span className="state-code">0 RESULTS</span>
      <strong>No products match these filters.</strong>
      <p>Try a broader search or reset the current filter combination.</p>
      <button className="primary-button primary-button--small" type="button" onClick={onReset}>Reset filters</button>
    </div>
  )
}

export function CatalogueEmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="state-view" role="status">
      <span className="state-code">0 PRODUCTS</span>
      <strong>The catalogue is empty.</strong>
      <p>The API returned an empty product list. You can retry to check for updates.</p>
      <button className="primary-button primary-button--small" type="button" onClick={onRetry}>Retry request</button>
    </div>
  )
}
