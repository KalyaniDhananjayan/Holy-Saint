# HOLY SAINT

A full-stack e-commerce MVP for a fashion brand, built with Node.js, Express, MongoDB, and Next.js.

## Why this project?

This project was built to understand how a real-world full-stack application works end-to-end:
authentication, protected routes, product management, order lifecycle, and admin controls.

Instead of focusing on many features, the goal was to build a complete and correct system flow.

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication (Cookies)
- Role-based access control

### Frontend
- Next.js (App Router)
- Tailwind CSS
- Context API for authentication state

### Tools
- Git & GitHub
- Postman

## Features

### User
- Signup & Login
- Persistent authentication using cookies
- Browse products
- View single product details
- Purchase products with quantity selection
- View personal order history

### Admin
- View all orders
- Update order status (paid, shipped, delivered, cancelled)
- Role-based route protection

## API Overview

### Auth
- POST `/api/v1/auth/signup`
- POST `/api/v1/auth/login`
- GET `/api/v1/auth/me`
- GET `/api/v1/auth/logout`

### Products
- GET `/api/v1/tshirts`
- GET `/api/v1/tshirts/:id`

### Orders
- POST `/api/v1/orders`
- GET `/api/v1/orders/me`
- GET `/api/v1/orders` (admin)
- PATCH `/api/v1/orders/:id/status` (admin)

## Run Locally

### Backend
```bash
cd backend
npm install
npm run dev

Create a .env file inside backend:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=90d

###Frontend

cd client
npm install
npm run dev


Design Decisions

No payment gateway yet (focus was on core system flow)

No cart system (direct order model used for MVP)

Minimal UI animations to keep the project clean and readable

```md
## Possible Extensions

- Payment integration (Stripe)
- Cart system
- Product image uploads
- Search and filtering