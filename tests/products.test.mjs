import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const require = createRequire(import.meta.url)

// Run the actual TypeScript modules without emitting files or adding a test library.
function loadModule(path, dependencies = {}) {
  const exports = {}
  const { outputText } = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  })
  vm.runInNewContext(outputText, {
    exports,
    require: (name) => dependencies[name] ?? require(name),
    fetch: dependencies.fetch,
    Intl,
    Error,
    SyntaxError,
  })
  return exports
}

const utils = loadModule('../src/utils/products.ts')
const product = {
  id: 1, title: 'Alpha', description: 'Everyday item', category: 'beauty',
  price: 20, rating: 4, stock: 10, thumbnail: 'https://example.test/product.png',
}
const catalogue = [
  product,
  { ...product, id: 2, title: 'Beta', brand: 'Brand B', price: 5, rating: 3, stock: 0 },
  { ...product, id: 3, title: 'Gamma', category: 'home', price: 30, rating: 5, stock: 11 },
]

function serviceFor(payload) {
  return loadModule('../src/services/products.ts', {
    fetch: async () => ({ ok: true, json: async () => payload }),
  })
}

test('normal response preserves required values and valid optional metadata', async () => {
  const input = { ...product, brand: '  Acme  ', sku: 'SKU-1', availabilityStatus: 'In Stock', discountPercentage: 5 }
  const [result] = await serviceFor({ products: [input] }).fetchProducts()
  assert.equal(result.price, input.price)
  assert.equal(result.stock, input.stock)
  assert.equal(result.brand, 'Acme')
  assert.equal(result.sku, 'SKU-1')
  assert.equal(result.availabilityStatus, 'In Stock')
  assert.equal(result.discountPercentage, 5)
  assert.equal(input.brand, '  Acme  ', 'normalization must not mutate the response')
})

for (const value of [undefined, null, 42, false, {}, [], '', '  ']) {
  test(`unsafe optional metadata (${JSON.stringify(value)}) is removed without losing the product`, async () => {
    const [result] = await serviceFor({ products: [{ ...product, brand: value, sku: value, availabilityStatus: value, discountPercentage: value }] }).fetchProducts()
    assert.ok(result)
    assert.equal(result.brand, undefined)
    assert.equal(result.sku, undefined)
    assert.equal(result.availabilityStatus, undefined)
    assert.equal(result.discountPercentage, typeof value === 'number' ? value : undefined)
    assert.equal(utils.filterProducts([result], 'unmatched', 'all', 'all').length, 0)

    const dependencies = { '../utils/products': utils }
    const { ProductCard } = loadModule('../src/components/ProductCard.tsx', dependencies)
    const { ProductDrawer } = loadModule('../src/components/ProductDrawer.tsx', dependencies)
    assert.match(renderToStaticMarkup(React.createElement(ProductCard, { product: result, onOpen() {} })), /Independent brand/)
    assert.match(renderToStaticMarkup(React.createElement(ProductDrawer, { product: result, onClose() {} })), /SKU/)
  })
}

test('non-finite optional discount is omitted, rather than rejecting the product', async () => {
  const [result] = await serviceFor({ products: [{ ...product, discountPercentage: Infinity }] }).fetchProducts()
  assert.equal(result.discountPercentage, undefined)
})

test('mixed records retain usable products and reject unsafe required fields', async () => {
  const result = await serviceFor({ products: [null, {}, { ...product, title: {} }, { ...product, price: '20' }, product] }).fetchProducts()
  assert.equal(result.length, 1)
  assert.equal(result[0].id, 1)
})

test('a valid empty catalogue succeeds', async () => {
  assert.equal((await serviceFor({ products: [] }).fetchProducts()).length, 0)
})

test('all-invalid records produce a clear data error', async () => {
  await assert.rejects(() => serviceFor({ products: [null, {}, { ...product, rating: NaN }] }).fetchProducts(), /Invalid product data/)
})

test('non-finite required numbers do not reach calculations or sorting', async () => {
  for (const field of ['id', 'price', 'rating', 'stock']) {
    for (const value of [NaN, Infinity, -Infinity]) {
      await assert.rejects(() => serviceFor({ products: [{ ...product, [field]: value }] }).fetchProducts(), /Invalid product data/)
    }
  }
})

test('malformed response shapes are not mistaken for an empty catalogue', async () => {
  for (const payload of [null, [], {}, { products: null }, { products: {} }]) {
    await assert.rejects(() => serviceFor(payload).fetchProducts(), /Invalid products payload/)
  }
})

test('HTTP, network, and malformed JSON failures remain errors', async () => {
  const responses = [
    [async () => ({ ok: false, status: 503 }), /status 503/],
    [async () => { throw new Error('Network unavailable') }, /Network unavailable/],
    [async () => ({ ok: true, json: async () => { throw new SyntaxError('bad JSON') } }), /Invalid JSON response/],
    [async () => ({ ok: true, json: async () => { throw new TypeError('Response body interrupted') } }), /Response body interrupted/],
  ]
  for (const [fetch, expected] of responses) {
    await assert.rejects(() => loadModule('../src/services/products.ts', { fetch }).fetchProducts(), expected)
  }
})

test('requests still use the existing endpoints and forward the abort signal', async () => {
  const calls = []
  const controller = new AbortController()
  const service = loadModule('../src/services/products.ts', {
    fetch: async (url, options) => {
      calls.push({ url, signal: options.signal })
      return { ok: true, json: async () => url.endsWith('/categories') ? [{ slug: 'beauty', name: 'Beauty', url: 'https://example.test' }] : { products: [product] } }
    },
  })
  await service.fetchProducts(controller.signal)
  assert.equal((await service.fetchCategories(controller.signal)).length, 1)
  assert.equal(calls[0].url, 'https://dummyjson.com/products?limit=0')
  assert.equal(calls[1].url, 'https://dummyjson.com/products/categories')
  assert.ok(calls.every((call) => call.signal === controller.signal))
})

test('normalized products remain safe for combined search, filters, sorting and pagination', async () => {
  const products = await serviceFor({ products: catalogue }).fetchProducts()
  assert.equal(utils.filterProducts(products, ' ALPHA ', 'all', 'all')[0].id, 1)
  assert.equal(utils.filterProducts(products, 'brand b', 'all', 'all')[0].id, 2)
  assert.equal(utils.filterProducts(products, '', 'beauty', 'low-stock')[0].id, 1)
  assert.equal(utils.filterProducts(products, '', 'all', 'out-of-stock')[0].id, 2)
  for (const [sort, expected] of [['featured', '1,2,3'], ['price-asc', '2,1,3'], ['price-desc', '3,1,2'], ['rating-desc', '3,1,2'], ['stock-asc', '2,1,3']]) {
    assert.equal(utils.sortProducts(products, sort).map((item) => item.id).join(','), expected)
  }
  assert.equal(products.map((item) => item.id).join(','), '1,2,3')
  const many = Array.from({ length: 13 }, (_, index) => ({ ...products[0], id: index + 1 }))
  assert.equal(utils.paginateProducts(many, 1).length, 12)
  assert.equal(utils.paginateProducts(many, 2)[0].id, 13)
  assert.equal(utils.getProductMetrics(products).averageRating, 4)
})

test('catalogue empty and filtered empty messages offer different recovery actions', () => {
  const { CatalogueEmptyState, EmptyState } = loadModule('../src/components/StateViews.tsx')
  const empty = renderToStaticMarkup(React.createElement(CatalogueEmptyState, { onRetry() {} }))
  const filtered = renderToStaticMarkup(React.createElement(EmptyState, { onReset() {} }))
  assert.match(empty, /The catalogue is empty/)
  assert.match(empty, /Retry request/)
  assert.doesNotMatch(empty, /Reset filters/)
  assert.match(filtered, /No products match/)
  assert.match(filtered, /Reset filters/)
})
