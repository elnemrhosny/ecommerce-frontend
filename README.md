# ShopName — Ecommerce Frontend

A responsive ecommerce storefront built with React and Vite, featuring a minimal ivory, charcoal, and olive design.

**Live store:** [ecommerce-frontend-two-blush.vercel.app](https://ecommerce-frontend-two-blush.vercel.app/)

## Features

- Product catalog with category navigation, search, sorting, price and stock filters, and pagination.
- Product details with image galleries, a lightbox, and missing-image fallbacks.
- Dedicated login and signup pages, with Google sign-in when configured.
- Shopping bag, quantity updates, wishlists, and checkout integration.
- Product reviews with rating summaries and owner-only editing and deletion.
- Account settings, email verification, and order history.
- Protected administration pages for products, categories, and orders.
- Responsive layouts, light/dark themes, and keyboard-accessible controls.

## Tech stack

React 19 · Vite 8 · React Router · TanStack Query · Axios · Tailwind CSS · Google OAuth · Oxlint

## Getting started

Use Node.js **22.12 or newer** and npm. The installed Vite version also supports Node.js 20.19 or newer within the Node 20 release line.

Run these commands from the frontend repository:

```bash
npm ci
```

Create a `.env` file:

```dotenv
VITE_SERVER_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

| Variable | Purpose |
| --- | --- |
| `VITE_SERVER_URL` | Backend API base URL. Use the deployed API URL for a production build. |
| `VITE_GOOGLE_CLIENT_ID` | Optional Google OAuth client ID. Google sign-in is hidden when this is unset. |

Vite exposes `VITE_` variables to the browser. Keep database passwords, JWT secrets, and other private credentials in the backend environment.

Start the development server:

```bash
npm run dev
```

Vite normally serves the app at `http://localhost:5173`. Start the backend separately and make sure its CORS configuration allows the frontend origin. For Google sign-in, authorize the relevant frontend origin in the Google OAuth configuration.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create the production bundle in `dist/`. |
| `npm run preview` | Preview the production bundle locally. |
| `npm run lint` | Run Oxlint. |
| `npm test` | Run frontend utility and image-gallery regression tests. |

## Main routes

| Route | Page |
| --- | --- |
| `/` | Product collection |
| `/product/:id` | Product details and reviews |
| `/login` | Login |
| `/signup` | Signup; `/register` is also supported |
| `/cart` | Shopping bag and checkout |
| `/wishlist` | Saved products |
| `/profile` | Account settings |
| `/orders` | Active and past orders |
| `/order-status` | Payment/order status |
| `/verify-email` | Email verification |
| `/admin/products` | Product management |
| `/admin/categories` | Category management |
| `/admin/orders` | Order management |

## Project structure

```text
src/
├── components/       Shared UI, navigation, product cards, reviews, and admin forms
├── contexts/         Authentication and theme state
├── functions/        Validation, API error handling, and image helpers
├── hooks/            API queries and mutations
├── pages/            Storefront, account, authentication, and admin pages
├── assets/axios.js   Shared API client
├── App.jsx           Providers and routes
└── index.css         Design tokens and shared styles
public/               Static assets and illustrations
tests/                Automated regression tests
```

## Deployment

The storefront is hosted on Vercel. Configure `VITE_SERVER_URL` and, if used, `VITE_GOOGLE_CLIENT_ID` for the target deployment. The build command is `npm run build`, and the output directory is `dist`.

`vercel.json` rewrites application paths to `index.html` so direct links to React Router pages work. The backend's `CLIENT_URL` must match the deployed frontend origin:

```text
https://ecommerce-frontend-two-blush.vercel.app
```

Deploy the corresponding backend review changes alongside the redesigned frontend. See [REDESIGN.md](./REDESIGN.md) for implementation details, verification scope, and the deferred catalog replacement work.
