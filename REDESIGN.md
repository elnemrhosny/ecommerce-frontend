# Storefront redesign

The storefront uses ivory, charcoal and olive design tokens, with an editorial type hierarchy and responsive product grids. The existing ShopName name, prices, product data and JWT cookie authentication are retained.

## Routes and flows

- `/`: active products, search, category tabs, sort, price/stock filters and pagination.
- `/login`: password and configured Google sign-in. Returns to the internal page that requested login.
- `/signup`: registration validation, API errors and email-verification guidance. `/register` remains an alias.
- `/product/:id`: gallery, cart, wishlist and product reviews.
- `/profile`, `/orders`, `/wishlist`, `/cart`: matching account and shopping layouts.
- `/verify-email`: preserves the token through login and submits it only once per mount under StrictMode.

Reviews use `GET /reviews/product?product_id=...`, `POST /reviews`, `PATCH /reviews`, and `DELETE /reviews/:review_id`. Only the signed-in review owner sees edit/delete controls; the backend still enforces ownership. Empty states, duplicate reviews, API failures and pending actions are handled inline.

## Backend changes to deploy with the frontend

- Review creation fetches the inserted review using the authenticated user's ID.
- Review update SQL separates the SET and WHERE clauses; empty updates are rejected.
- Product review lists include `reviewer_name` from the existing users table; no schema migration is required.
- Password-change requests are no longer printed to the server log, and failed updates return immediately.

## Development and checks

Keep the existing `VITE_SERVER_URL` and optional `VITE_GOOGLE_CLIENT_ID` environment values. No new service or environment variable is required. Google OAuth still needs the deployed frontend origin authorized in the existing Google project.

Frontend:

```sh
npm ci
npm run dev
npm run build
npm test
```

Backend:

```sh
npm test
```

The automated backend tests mock database calls and do not access the production database or send email. Browser QA used a temporary local server and mock API responses for signup, login, reviews, cart, account, mobile and dark-mode flows. Real Google authorization, email delivery, payment processing and production database connectivity still require a deployment smoke test.

## Deferred catalog work

No deployed products were added, changed or deactivated. Catalog replacement remains a later step after access is provided. Preview screenshots use temporary test data that is not bundled into the application. The hero illustration is a local SVG, independent of the product catalog.
