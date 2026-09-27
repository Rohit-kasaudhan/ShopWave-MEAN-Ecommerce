<div align="center">

# 🛍️ ShopWave

### Full-Stack MEAN Stack E-Commerce Platform

A modern e-commerce application built with **MongoDB, Express.js, Angular, and Node.js**, featuring a customer storefront, JWT authentication, shopping cart, orders, product management, and an admin dashboard.

<br/>

[![Angular](https://img.shields.io/badge/Angular-22-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.1-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

<br/>

**🌐 Live Demo:** [ShopWave](https://shop-wave-mean-ecommerce.vercel.app)  
**📦 Repository:** [GitHub](https://github.com/Rohit-kasaudhan/ShopWave-MEAN-Ecommerce)

</div>

---

## 📖 About

**ShopWave** is a full-stack e-commerce platform developed using the **MEAN stack**.

The project separates the application into two independently runnable parts:

```text
┌──────────────────────────────────────────────────────────────┐
│                        SHOPWAVE                              │
├───────────────────────────────┬──────────────────────────────┤
│       Angular Frontend        │       Express Backend        │
│                               │                              │
│  • Storefront                 │  • REST API                  │
│  • Authentication             │  • JWT Authentication        │
│  • Products                   │  • Product Management        │
│  • Cart                       │  • Category Management       │
│  • Orders                     │  • Cart & Orders             │
│  • Admin Dashboard            │  • User Management           │
└───────────────────────────────┴──────────────┬───────────────┘
                                               │
                                               ▼
                                      ┌──────────────────┐
                                      │  MongoDB Atlas   │
                                      └──────────────────┘
                                               │
                                               ▼
                                      ┌──────────────────┐
                                      │    Cloudinary    │
                                      │  Image Storage   │
                                      └──────────────────┘
```

---

## ✨ Key Features

### 🛒 Customer Experience

- 🔍 Product search and filtering
- 🗂️ Category-based browsing
- 💰 Price and stock filtering
- 📄 Pagination
- 🖼️ Product image gallery
- 🎨 Product colors and sizes
- ⭐ Product ratings/review display
- 🔗 Related products
- 🛍️ Shopping cart
- ➕➖ Quantity management
- 💳 Checkout/order flow
- 📦 Order history
- 👤 User profile
- 🔔 Toast notifications
- 🌙 Theme toggle

### 🔐 Authentication & Security

- User registration
- Email verification
- Secure login
- JWT authentication
- Password hashing
- Auth guards
- Admin guards
- Protected API routes
- Request validation
- CORS configuration
- Response sanitization

### 🛡️ Admin Dashboard

- 📊 Dashboard overview
- 📦 Product management
- 🗂️ Category management
- 👥 User management
- 🚚 Order management
- 🖼️ Product image uploads
- 📈 Product/order/user statistics
- 💰 Revenue overview
- 🔄 Order status management
- 🔒 Role-based access control

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Angular 22, TypeScript, RxJS, Angular Router, Reactive Forms |
| **Backend** | Node.js, Express.js 5.2.1 |
| **Database** | MongoDB + Mongoose 9.1.3 |
| **Authentication** | JWT, bcrypt/bcryptjs |
| **Validation** | express-validator |
| **Uploads** | Multer + Cloudinary |
| **Email** | Nodemailer / Mailtrap integration |
| **Styling** | CSS / SCSS |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |
| **Database Hosting** | MongoDB Atlas |

---

# 🚀 Quick Start

If you just want to run ShopWave locally:

### 1️⃣ Clone

```powershell
git clone https://github.com/Rohit-kasaudhan/ShopWave-MEAN-Ecommerce.git
cd ShopWave-MEAN-Ecommerce
```

### 2️⃣ Backend

```powershell
cd Backend
npm install
npm start
```

Backend:

```text
http://localhost:5000
```

### 3️⃣ Frontend

Open a **second terminal**:

```powershell
cd frontend
npm install
npm start
```

Frontend:

```text
http://localhost:4200
```

> ⚠️ Before starting the backend, configure `Backend/config/config.env`. See the complete setup below.

---

# 📋 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Backend Setup](#️-backend-setup)
- [MongoDB Setup](#️-mongodb-setup)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [Frontend Setup](#-frontend-setup)
- [Running Locally](#-running-locally)
- [API Reference](#-api-reference)
- [Authentication Flow](#-authentication-flow)
- [Cloudinary Image Upload](#️-cloudinary-image-upload)
- [Email Verification](#-email-verification)
- [Production Deployment](#-production-deployment)
- [Troubleshooting](#-troubleshooting)
- [Security Checklist](#-security-checklist)
- [Git Workflow](#-git-workflow)
- [Project Status](#-project-status)
- [Author](#-author)

---

# 🏗️ Architecture

```text
                         ┌───────────────────┐
                         │      Browser      │
                         └─────────┬─────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │    Angular 22 Frontend   │
                    │          :4200           │
                    └────────────┬─────────────┘
                                 │
                              REST API
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   Express.js + Node.js   │
                    │          :5000           │
                    └──────┬─────────┬─────────┘
                           │         │
                           ▼         ▼
                 ┌─────────────┐  ┌─────────────┐
                 │  MongoDB    │  │  Cloudinary │
                 │    Atlas    │  │    Images   │
                 └─────────────┘  └─────────────┘
```

### Production

```text
Angular → Vercel
           │
           ▼
     Render API
       │     │
       ▼     ▼
 MongoDB   Cloudinary
  Atlas
```

---

# 📁 Project Structure

```text
ShopWave-MEAN-Ecommerce/
│
├── 📂 Backend/
│   ├── 📂 config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── config.env              🔒 Local secrets
│   │
│   ├── 📂 controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   │
│   ├── 📂 middlewares/
│   │   ├── apiError.js
│   │   ├── authMiddleware.js
│   │   ├── sanitizeResponse.js
│   │   ├── upload.js
│   │   └── validatorMiddleware.js
│   │
│   ├── 📂 models/
│   │   ├── cart.js
│   │   ├── category.js
│   │   ├── order.js
│   │   ├── product.js
│   │   └── user.js
│   │
│   ├── 📂 routes/
│   │   ├── authRoute.js
│   │   ├── cartRoute.js
│   │   ├── categoryRoute.js
│   │   ├── orderRoute.js
│   │   ├── productRoute.js
│   │   └── userRoute.js
│   │
│   ├── 📂 utils/
│   │   └── sendEmail.js
│   │
│   ├── 📂 validator/
│   │   ├── authValidator.js
│   │   ├── categoryValidator.js
│   │   ├── productValidator.js
│   │   └── userValidator.js
│   │
│   ├── 📂 src/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── seeder.js
│   ├── package.json
│   └── package-lock.json
│
├── 📂 frontend/
│   ├── 📂 public/
│   ├── 📂 src/
│   │   ├── 📂 app/
│   │   │   ├── 📂 core/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   └── services/
│   │   │   │
│   │   │   ├── 📂 features/
│   │   │   │   ├── admin/
│   │   │   │   ├── auth/
│   │   │   │   ├── cart/
│   │   │   │   ├── home/
│   │   │   │   ├── orders/
│   │   │   │   ├── products/
│   │   │   │   └── profile/
│   │   │   │
│   │   │   ├── 📂 shared/
│   │   │   │   └── components/
│   │   │   ├── app-module.ts
│   │   │   └── app-routing-module.ts
│   │   │
│   │   ├── 📂 assets/
│   │   ├── 📂 environments/
│   │   │   ├── environment.ts
│   │   │   └── environment.prod.ts
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── styles.css
│   │
│   ├── angular.json
│   ├── proxy.conf.json
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

# 💻 Prerequisites

Install the following before starting.

### Required

- **Node.js 22+**
- **npm**
- **Git**
- **Angular CLI 22.x**
- **MongoDB Atlas account** or local MongoDB
- **Cloudinary account** for image uploads
- Email provider credentials if real email delivery is required

### Check your installation

```powershell
node --version
npm --version
git --version
ng version
```

### Install Angular CLI

```powershell
npm install -g @angular/cli
```

---

# 📥 Clone the Repository

```powershell
git clone https://github.com/Rohit-kasaudhan/ShopWave-MEAN-Ecommerce.git
```

```powershell
cd ShopWave-MEAN-Ecommerce
```

---

# ⚙️ Backend Setup

Move into the backend:

```powershell
cd Backend
```

Install dependencies:

```powershell
npm install
```

---

# 🔐 Environment Variables

Create this file:

```text
Backend/config/config.env
```

### Local development example

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/shopwave

# JWT
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_HOST=your_smtp_host
EMAIL_PORT=2525
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password

# Frontend
FRONTEND_URL=http://localhost:4200
```

> 🔒 **Never commit this file.** It contains credentials and secrets.

---

# 🗄️ MongoDB Setup

ShopWave supports both local MongoDB and MongoDB Atlas.

## Option 1 — MongoDB Atlas

1. Create a MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Configure Network Access.
5. Copy the connection string.
6. Put it in `MONGO_URI`.

Example format:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/shopwave
```

### Do not publish your real URI.

It contains database credentials.

---

## Option 2 — Local MongoDB

If MongoDB is installed locally:

```env
MONGO_URI=mongodb://localhost:27017/shopwave
```

Make sure the MongoDB service is running.

---

# 🌱 Database Seeding

ShopWave includes:

```text
Backend/seeder.js
```

Run:

```powershell
node seeder.js
```

The current seeder:

- Clears existing products
- Clears existing categories
- Inserts sample categories
- Inserts sample products
- Creates or updates the admin account

### ⚠️ Important

The seeder **deletes existing products and categories first**.

Do not run it against a production database unless you intentionally want to reset that data.

### Seeded Admin

```text
Email:    admin@shopwave.com
Password: admin123456
```

> 🔒 Change/remove default credentials before using the application in a real production environment.

---

# ▶️ Start the Backend

From:

```text
ShopWave-MEAN-Ecommerce/Backend
```

run:

```powershell
npm start
```

Local backend:

```text
http://localhost:5000
```

API base:

```text
http://localhost:5000/api/v1
```

---

# 🎨 Frontend Setup

Open a **new terminal**.

From the project root:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

---

# 🔗 Frontend Environment

### Development

File:

```text
frontend/src/environments/environment.ts
```

The development API should point to:

```text
http://localhost:5000/api/v1
```

### Production

File:

```text
frontend/src/environments/environment.prod.ts
```

The current production API is:

```text
https://shopwave-mean-ecommerce.onrender.com/api/v1
```

The Angular production configuration uses `environment.prod.ts` when building with:

```powershell
ng build --configuration production
```

---

# ▶️ Start the Frontend

```powershell
npm start
```

or:

```powershell
ng serve
```

Open:

```text
http://localhost:4200
```

---

# 🖥️ Running the Complete Application

You need **two terminals**.

### Terminal 1 — Backend

```powershell
cd ShopWave-MEAN-Ecommerce\Backend
npm install
npm start
```

### Terminal 2 — Frontend

```powershell
cd ShopWave-MEAN-Ecommerce\frontend
npm install
npm start
```

Then open:

👉 **http://localhost:4200**

---

# 🔌 API Reference

### Base URLs

| Environment | Base URL |
|---|---|
| Local | `http://localhost:5000/api/v1` |
| Production | `https://shopwave-mean-ecommerce.onrender.com/api/v1` |

---

## 🔐 Authentication

`/api/v1/auth`

| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/signup` | Register user |
| `POST` | `/verify-email` | Verify email |
| `POST` | `/login` | Authenticate user |
| `POST` | `/logout` | Logout |
| `GET` | `/me` | Get current user |

---

## 🛍️ Products

`/api/v1/products`

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/` | Get products |
| `GET` | `/:id` | Get product |
| `POST` | `/` | Create product |
| `PUT` | `/:id` | Update product |
| `DELETE` | `/:id` | Delete product |

> Product write operations require admin authorization.

---

## 🗂️ Categories

`/api/v1/categories`

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/` | Get categories |
| `POST` | `/` | Create category |
| `PUT` | `/:id` | Update category |
| `DELETE` | `/:id` | Delete category |

---

## 🛒 Cart

`/api/v1/cart`

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/` | Get cart |
| `POST` | `/add` | Add item |
| `PUT` | `/:itemId` | Update quantity |
| `DELETE` | `/:itemId` | Remove item |
| `DELETE` | `/clear` | Clear cart |

---

## 📦 Orders

`/api/v1/orders`

Order functionality includes:

- Create orders
- View customer orders
- View individual orders
- Manage order status through admin functionality

---

## 👥 Users

`/api/v1/users`

Used for protected user-management operations, primarily through the admin dashboard.

---

# 🔑 Authentication Flow

```text
┌──────────────┐
│    Signup    │
└──────┬───────┘
       ▼
┌──────────────┐
│Email Verify  │
└──────┬───────┘
       ▼
┌──────────────┐
│    Login     │
└──────┬───────┘
       ▼
┌──────────────┐
│   JWT Token  │
└──────┬───────┘
       ▼
┌────────────────────┐
│ Angular Interceptor│
└─────────┬──────────┘
          ▼
 Authorization Header
          │
          ▼
┌────────────────────┐
│ Express Middleware │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ Protected API Route│
└────────────────────┘
```

Frontend route protection:

```text
auth.guard.ts
admin.guard.ts
```

Backend authentication:

```text
authMiddleware.js
```

---

# 🖼️ Cloudinary Image Upload

Product images use:

```text
Angular
   ↓
Express API
   ↓
Multer
   ↓
Cloudinary
   ↓
Image URL
   ↓
MongoDB
```

Required:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

# 📧 Email Verification

Email functionality is handled through:

```text
Backend/utils/sendEmail.js
```

The current implementation supports a Mailtrap-based delivery path when a valid Mailtrap token is configured.

If the required Mailtrap token is not configured, the application falls back to logging the email information and verification text in the backend console.

---

# 🚀 Production Deployment

ShopWave is currently deployed using:

```text
┌───────────────────────────────────────┐
│            Production                 │
├───────────────────────────────────────┤
│                                       │
│ Angular ───────────────► Vercel       │
│                                       │
│ Express + Node.js ─────► Render       │
│                                       │
│ MongoDB ───────────────► Atlas        │
│                                       │
│ Images ────────────────► Cloudinary   │
│                                       │
└───────────────────────────────────────┘
```

## Frontend — Vercel

Project directory:

```text
frontend/
```

Build:

```powershell
npm install
ng build --configuration production
```

Current Angular output:

```text
dist/frontend/browser
```

Production API:

```text
https://shopwave-mean-ecommerce.onrender.com/api/v1
```

---

## Backend — Render

Root directory:

```text
Backend/
```

Build command:

```text
npm install
```

Start command:

```text
node src/server.js
```

Production environment includes:

```env
NODE_ENV=production
FRONTEND_URL=https://shop-wave-mean-ecommerce.vercel.app
```

> Render manages the runtime environment and service port. Keep the application compatible with the port supplied by the hosting platform.

---

# 🧪 Build & Test

## Frontend production build

```powershell
cd frontend
npm run build
```

or:

```powershell
ng build --configuration production
```

## Frontend tests

```powershell
npm test
```

or:

```powershell
ng test
```

---

# 🛠️ Troubleshooting

<details>
<summary><b>❌ npm is not recognized</b></summary>

Install Node.js and restart PowerShell.

```powershell
node --version
npm --version
```

</details>

<details>
<summary><b>❌ Angular CLI is not recognized</b></summary>

```powershell
npm install -g @angular/cli
```

Then:

```powershell
ng version
```

</details>

<details>
<summary><b>❌ MongoDB connection failed</b></summary>

Check:

- `MONGO_URI`
- MongoDB username/password
- Atlas Network Access
- Database user permissions
- Cluster status

</details>

<details>
<summary><b>❌ Frontend cannot connect to backend</b></summary>

Confirm the backend is running:

```text
http://localhost:5000
```

Then check:

```text
frontend/src/environments/environment.ts
```

The local API should be:

```text
http://localhost:5000/api/v1
```

</details>

<details>
<summary><b>❌ CORS error</b></summary>

Check `Backend/src/app.js`.

Local frontend:

```text
http://localhost:4200
```

Production frontend:

```text
https://shop-wave-mean-ecommerce.vercel.app
```

Also verify the backend environment variable:

```env
FRONTEND_URL=https://shop-wave-mean-ecommerce.vercel.app
```

</details>

<details>
<summary><b>❌ Product images are not uploading</b></summary>

Verify:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

</details>

<details>
<summary><b>❌ Verification email is not received</b></summary>

Check the backend logs.

If the email service token is not configured, the current email utility can log the verification information to the backend console instead of sending a real email.

</details>

---

# 🔒 Security Checklist

Before publishing or deploying:

- [x] Environment files ignored by Git
- [x] Database credentials not committed
- [x] JWT secret not committed
- [x] Cloudinary secrets not committed
- [x] Email credentials not committed
- [x] Production environment variables stored on hosting platform
- [x] CORS configured
- [x] Authentication middleware enabled
- [x] Admin routes protected

### Never commit

```text
Backend/config/config.env
.env
.env.*
MONGO_URI
JWT_SECRET
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
EMAIL_PASS
MAILTRAP_TOKEN
```

If a secret is ever exposed:

1. Rotate the credential.
2. Replace it in the deployment environment.
3. Remove it from repository history if necessary.

---

# 🌿 Git Workflow

### Check changes

```powershell
git status
```

### Create a branch

```powershell
git checkout -b feature/my-feature
```

### Stage

```powershell
git add .
```

### Commit

```powershell
git commit -m "Add my feature"
```

### Push

```powershell
git push origin feature/my-feature
```

For the main branch:

```powershell
git push origin main
```

---

# 📊 Project Status

| Component | Status |
|---|:---:|
| Angular Frontend | 🟢 |
| Node.js Backend | 🟢 |
| Express REST API | 🟢 |
| MongoDB Atlas | 🟢 |
| JWT Authentication | 🟢 |
| Product Management | 🟢 |
| Category Management | 🟢 |
| Shopping Cart | 🟢 |
| Orders | 🟢 |
| Admin Dashboard | 🟢 |
| Cloudinary | 🟢 |
| CORS | 🟢 |
| Production Environment | 🟢 |
| Vercel Deployment | 🟢 |
| Render Deployment | 🟢 |

---

# 🌐 Useful Links

| Resource | Link |
|---|---|
| 🚀 Live Application | [ShopWave](https://shop-wave-mean-ecommerce.vercel.app) |
| ⚙️ Backend | [Render API](https://shopwave-mean-ecommerce.onrender.com) |
| 💻 GitHub | [ShopWave Repository](https://github.com/Rohit-kasaudhan/ShopWave-MEAN-Ecommerce) |

---

# 🤝 Contributing

Contributions are welcome.

```text
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test frontend + backend
5. Commit your changes
6. Push the branch
7. Open a Pull Request
```

---

# 📄 License

This repository does not currently declare a custom open-source license in the root README.

Before redistributing or publishing modified versions, review the license and terms associated with any upstream code or third-party assets used in the project.

---

<div align="center">

## 👨‍💻 Author

### Rohit Kasaudhan

[![GitHub](https://img.shields.io/badge/GitHub-Rohit--kasaudhan-181717?style=for-the-badge&logo=github)](https://github.com/Rohit-kasaudhan)

<br/>

**Built with ❤️ using the MEAN Stack**

⭐ If you found this project useful, consider starring the repository.

</div>
