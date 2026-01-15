# HOLY SAINT
A full-stack e-commerce MVP for a fashion brand, focused on authentication, cart management, order lifecycle, and admin-controlled operations.

## Why this project?
This project was built to understand how a real-world full-stack application works end-to-end:
authentication, protected routes, cart management, and product management.
The goal was to build a complete and correct system flow which prioritizes correctness, clarity, and separation of concerns over feature count.

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
- Context API for authentication and cart state
- localStorage for cart persistence

### Tools
- Git & GitHub
- Postman

## Features

### User
- Signup & Login
- Persistent authentication using cookies
- Browse products
- View single product details
- **Cart Management**
  - Add products to cart (guest & logged-in users)
  - Guest cart persists across sessions
  - Automatic cart merge on login
  - Guest cart preserved during checkout flow
  - Cart abandonment handling
- **Flexible Checkout Options**
  - Buy Now (instant checkout for single product)
  - Cart checkout (multiple items)
  - Guest checkout with login requirement
- View personal order history

### Admin
- View all orders
- Update order status (paid, shipped, delivered, cancelled)
- Role-based route protection

## Cart System Architecture

### Guest Cart
- Stored in `localStorage` as `guest_cart`
- Persists across browser sessions
- Allows shopping without login

### User Cart
- Stored in `localStorage` as `cart_{userId}`
- User-specific cart data
- Persists per user account

### Cart Merge Logic
**Normal Login (Direct):**
- Guest cart + User cart → Merged cart
- Guest cart cleared after merge

**Checkout Flow (Guest → Login):**
- Guest cart preserved during login
- Checkout processes only guest cart items
- If checkout abandoned → carts merge automatically

**Logout:**
- User cart cleared
- Returns to empty guest cart

### Checkout Flows
1. **Buy Now:** Single product instant checkout
2. **Guest Cart Checkout:** Guest adds items → checkout → login → complete
3. **User Cart Checkout:** Logged-in user checks out their cart

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
```

### Create a `.env` file inside backend:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=90d
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Design Decisions

### Cart Implementation
- **localStorage over API calls:** Faster UX, reduces server load for cart operations
- **Guest cart support:** Allows shopping before account creation
- **Smart merge logic:** Preserves user intent during checkout vs normal login
- **Flow-based routing:** `FLOW_MODE` flag distinguishes checkout login from normal login

### Other Decisions
- No payment gateway yet (focus was on core system flow)
- Direct order model used for MVP
- Minimal UI animations to keep the project clean and readable

## Key Technical Challenges Solved

1. **Cart State Management**
   - Coordinating auth state with cart state
   - Preventing race conditions during login
   - Managing multiple cart sources (guest, user, checkout data)

2. **Checkout Flow Complexity**
   - Distinguishing between different login contexts
   - Preventing unwanted cart merges during checkout
   - Handling abandoned checkout scenarios

3. **User Experience**
   - Seamless guest-to-user transition
   - Cart persistence across sessions
   - No data loss during authentication flows

## Future Improvements
- Payment integration (Stripe/Razorpay)
- Product image uploads
- Search and filtering
- Wishlist feature
- Order tracking
- Email notifications
- Product reviews and ratings