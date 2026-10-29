# AS / OPS — Product Operations Dashboard

Front-End Engineer coding test implementation using React, TypeScript, and the DummyJSON REST API.

## Overview

AS / OPS is a compact product-operations dashboard designed to make a large product catalogue easier to review. It includes a simulated login, product data from DummyJSON, catalogue filtering, sorting, pagination, summary metrics, and a product detail drawer.

The application was intentionally scoped to satisfy the coding-test requirements while keeping the implementation easy to review and present.

## Required Features Implemented

- Simple login page using dummy credentials.
- REST API integration using the native Fetch API.
- DummyJSON product catalogue integration.
- Reusable UI components.
- API/data-processing logic separated from UI components.
- Loading state.
- API error state with retry action.
- Empty-filter-result state.
- Invalid API record validation before data reaches the UI.
- Responsive layout.
- Git-ready project structure.

## Additional Features

- Search by product title, description, or brand.
- Category filter.
- Stock-state filter.
- Multiple sort options.
- Client-side pagination.
- Product summary metrics.
- Product detail drawer.
- Session simulation using `localStorage`.
- Reduced-motion accessibility support.

## Demo Login

```text
Email: reviewer@asops.dev
Password: Frontend2026!
```

Authentication is intentionally simulated as allowed by the test instructions. No real credentials or backend authentication are used.

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS
- Native Fetch API
- DummyJSON REST API

No external UI component or state-management library is used. This keeps the dependency surface small and makes the implementation easier to review.

## API

Primary API source:

- `GET https://dummyjson.com/products?limit=0`
- `GET https://dummyjson.com/products/categories`

The application validates the shape of API records before exposing them to the UI.

Required text fields must be strings and required numeric fields must be finite numbers. Optional brand, SKU, and availability text are trimmed when valid and omitted when missing or malformed. Optional discount metadata is retained only when it is a finite number. A usable product is not rejected just because optional metadata is unavailable.

An empty `products` array is a successful empty catalogue with a retry action. A non-empty array containing no usable records, a malformed payload, or malformed JSON produces an explicit data error. HTTP and network failures remain request errors. Metrics show an em dash while loading or after an error; a successfully empty catalogue shows zero counts and no average rating.

## Project Structure

```text
src/
├── components/       # Reusable presentation components
├── hooks/            # Async data-loading state
├── services/         # REST API integration + response validation
├── types/            # Shared TypeScript types
├── utils/            # Filtering, sorting, pagination, metrics
├── App.tsx
├── main.tsx
└── styles.css
```

## Run Locally

Requirements:

- Node.js 18+ (Node.js 20 LTS recommended)
- npm

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run regression tests:

```bash
npm test
```

Tests use Node's built-in test runner and the existing TypeScript compiler to load source modules in memory; no additional test dependency is installed. Coverage includes optional-field normalization, invalid/mixed/empty responses, request failures, rendering normalized records, search, filters, sorting, and pagination. These tests do not replace browser interaction checks.

## Design Notes

The interface uses a restrained product-operations visual language: off-white surfaces, graphite typography, navy/cobalt accents, compact spacing, and subtle interaction feedback. The design intentionally avoids heavy UI frameworks and decorative effects so the data remains the focus.

`AS / OPS` is a neutral demo identity derived from **Anggana Systems / Operations**. It is used only as a visual product name for this assessment and does not represent a real company.

## Technical Decisions

### Why client-side filtering?

DummyJSON supports server-side search, pagination, and category endpoints. For this assessment the catalogue is loaded once (`limit=0`) and filtering/sorting/pagination are performed in pure utility functions. This makes the data-processing logic easy to inspect during presentation and keeps UI components focused on rendering.

### Why no authentication library?

The instructions explicitly allow simple validation or dummy data to simulate login. A local dummy session is therefore sufficient and avoids unnecessary backend/authentication scope.

### Why no additional UI library?

The application uses only React and TypeScript. Avoiding a component framework keeps the bundle small and makes the implementation choices visible to reviewers.

## Notes for Reviewers

DummyJSON is a public testing API. If the remote service is unavailable, the application intentionally shows an error state and provides a retry action rather than silently hiding the failure.
