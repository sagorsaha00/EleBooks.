# 📚 Digital Library Management System

A modern full-stack Digital Library platform built with role-based access control, Stripe-powered delivery checkout, real-time order processing, and secure librarian moderation workflows.

---

# 🚀 Core Workflow

The platform follows a structured delivery approval pipeline:

```txt
User Login
   ↓
Browse & Read Books
   ↓
Request Physical Delivery
   ↓
Stripe Payment Checkout
   ↓
Librarian Receives Request
   ↓
Approve Order
   ↓
Dispatch Delivery
   ↓
Mark as Completed
```

---

# 👥 Role-Based Access Control (RBAC)

The application uses a strict permission hierarchy to secure platform operations and isolate creator privileges.

---

## 📑 Permission Matrix

| Feature / Action          | 📖 User | 🔑 Librarian | 🛡️ Admin |
| :------------------------ | :-----: | :----------: | :-------: |
| Browse Book Catalog       |    ✅    |       ✅      |     ✅     |
| Read Book Details         |    ✅    |       ✅      |     ✅     |
| Request Book Delivery     |    ✅    |       ❌      |     ❌     |
| Stripe Payment Checkout   |    ✅    |       ❌      |     ❌     |
| Add to Wishlist           |    ✅    |       ❌      |     ❌     |
| Submit Reviews            |    ✅    |       ❌      |     ❌     |
| Upload New Books          |    ❌    |       ✅      |     ✅     |
| Edit Own Uploaded Books   |    ❌    |       ✅      |     ✅     |
| Publish / Unpublish Books |    ❌    |       ✅      |     ✅     |
| Approve Delivery Requests |    ❌    |       ✅      |     ✅     |
| Dispatch Orders           |    ❌    |       ✅      |     ✅     |
| Complete Deliveries       |    ❌    |       ✅      |     ✅     |
| Delete Any Book           |    ❌    |       ❌      |     ✅     |

---

# 📖 User Role (Reader)

Standard authenticated users can:

* Browse all published books
* Read complete book metadata
* Add books to personal wishlist
* Complete Stripe-powered delivery checkout
* Track delivery request status
* Submit reviews after verified purchase

### 🔒 Restrictions

Users cannot:

* Upload books
* Modify metadata
* Publish/unpublish assets
* Access librarian controls

---

# 🔑 Librarian Role

Librarians manage and moderate literary assets they own.

### Librarian Privileges

* Upload new books
* Edit owned book metadata
* Toggle publish/unpublish state
* Approve delivery requests
* Dispatch physical book deliveries
* Mark orders as completed

### Ownership Protection

Librarians can only manage books where:

```js
currentUser.email === book.librarianEmail
```

---

# 🛡️ Admin Role

The Admin tier acts as the global supervisor.

### Admin Permissions

* Universal edit access
* Global delete permissions
* Override librarian restrictions
* Audit uploaded assets
* Manage all delivery pipelines
* Moderate unauthorized content

---

# 💳 Stripe Payment Integration

The system integrates Stripe Checkout for secure payment processing.

### Payment Flow

```txt
Book Delivery Request
        ↓
Stripe Checkout Session
        ↓
Successful Payment
        ↓
Backend Verification
        ↓
Delivery Request Created
```

### Supported Features

* Stripe Checkout Session
* Payment Verification
* Order Tracking
* Delivery Status Updates
* Secure Transaction Logging

---

# 📦 Delivery Lifecycle

Every delivery request passes through multiple synchronized states.

| Status       | Description                                   |
| :----------- | :-------------------------------------------- |
| `pending`    | Payment completed, waiting librarian approval |
| `approved`   | Librarian accepted request                    |
| `dispatched` | Book shipped for delivery                     |
| `completed`  | Delivery successfully finished                |

---

# 🧠 Optimistic UI Features

The frontend uses realtime optimistic state updates for:

* Publish/Unpublish toggles
* Wishlist interactions
* Delivery tracking
* Order approvals
* Dispatch updates

---

# ⚙️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Framer Motion
* React Router
* TanStack Query

## Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* Stripe API

## Deployment

* Vercel (Frontend)
* Vercel Serverless Functions / Node Backend
* MongoDB Atlas

---

# 🔐 Security Features

* JWT Authentication
* Protected Routes
* Role-Based Authorization
* Ownership Validation
* Secure Stripe Verification
* MongoDB Connection Pooling
* Serverless Safe Architecture

---

# 📂 Project Architecture

```txt
src/
├── components/
├── pages/
├── routes/
├── hooks/
├── middleware/
├── services/
├── controllers/
├── database/
└── utils/
```

---

# 🌐 Environment Variables

```env
CONNECTION_URL=your_mongodb_uri
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=your_key
CLIENT_URL=your_frontend_url
```

---

# ✨ Key Highlights

* Full RBAC system
* Real-time delivery workflow
* Secure Stripe payments
* Optimistic UI interactions
* Librarian ownership protection
* Serverless MongoDB architecture
* Fully responsive interface
