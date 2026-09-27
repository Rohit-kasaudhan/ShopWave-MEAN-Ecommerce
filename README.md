🛍️ ShopWave — MEAN Stack E-Commerce Platform

A full-stack e-commerce web application built with the MEAN stack:

MongoDB — database

Express.js 5 — REST API

Angular 22 — frontend

Node.js — backend runtime

ShopWave includes a customer storefront, authentication, email verification flow, product browsing, cart, orders, user profile, and an admin dashboard for products, categories, users, and orders.

🌐 Live Demo

Frontend: https://shop-wave-mean-ecommerce.vercel.app
Backend API: https://shopwave-mean-ecommerce.onrender.com

Deployment: Angular on Vercel, Node/Express on Render, MongoDB on MongoDB Atlas, and product media on Cloudinary.

📋 Table of Contents

Features

Technology Stack

Architecture

Project Structure

Prerequisites

Clone the Repository

Backend Setup

Frontend Setup

Database Setup

Seed Sample Data

Run Locally

Environment Variables

API Overview

Authentication

Admin Access

Image Uploads

Email Verification

Production Deployment

Troubleshooting

Security

Git Workflow

License

✨ Features

Customer Storefront

Responsive e-commerce storefront

Product search and filtering

Category filtering

Price/stock filtering

Pagination

Product detail pages

Product image gallery

Colors and sizes/variants

Related products

Shopping cart

Quantity management

Persistent cart state

Checkout/order flow

Order history

User profile

Signup and email verification

JWT-based login/logout

Protected customer routes

Toast notifications

Theme toggle

Admin Dashboard

Dashboard overview and statistics

Product CRUD

Product image uploads

Category CRUD

User management

Order management

Order status updates

Protected admin routes

Revenue/order/product/user statistics

🧰 Technology Stack

Frontend

Angular 22.x

TypeScript

RxJS 7.8

Angular Router

Angular Forms

Angular HTTP Client

CSS/SCSS

Angular CLI 22.1.x

Backend

Node.js

Express.js 5.2.1

MongoDB

Mongoose 9.1.3

JWT

bcrypt/bcryptjs

express-validator

CORS

Multer

Cloudinary

Nodemailer/Mailtrap integration

dotenv

Deployment

Vercel — frontend

Render — backend

MongoDB Atlas — database

Cloudinary — image storage

🏗️ Architecture

Browser
   │
   ▼
Angular 22 Frontend (Vercel / localhost:4200)
   │
   │ HTTP REST API
   ▼
Node.js + Express Backend (Render / localhost:5000)
   │
   ├──────────────► MongoDB Atlas / MongoDB
   │
   └──────────────► Cloudinary

📁 Project Structure

ShopWave-MEAN-Ecommerce/
│
├── Backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── config.env              # Local secrets - DO NOT COMMIT
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── apiError.js
│   │   ├── authMiddleware.js
│   │   ├── sanitizeResponse.js
│   │   ├── upload.js
│   │   └── validatorMiddleware.js
│   ├── models/
│   │   ├── cart.js
│   │   ├── category.js
│   │   ├── order.js
│   │   ├── product.js
│   │   └── user.js
│   ├── routes/
│   │   ├── authRoute.js
│   │   ├── cartRoute.js
│   │   ├── categoryRoute.js
│   │   ├── orderRoute.js
│   │   ├── productRoute.js
│   │   └── userRoute.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── validator/
│   │   ├── authValidator.js
│   │   ├── categoryValidator.js
│   │   ├── productValidator.js
│   │   └── userValidator.js
│   ├── src/
│   │   ├── app.js
│   │   └── server.js
│   ├── seeder.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   └── services/
│   │   │   ├── features/
│   │   │   │   ├── admin/
│   │   │   │   ├── auth/
│   │   │   │   ├── cart/
│   │   │   │   ├── home/
│   │   │   │   ├── orders/
│   │   │   │   ├── products/
│   │   │   │   └── profile/
│   │   │   ├── shared/
│   │   │   │   └── components/
│   │   │   ├── app-module.ts
│   │   │   └── app-routing-module.ts
│   │   ├── assets/
│   │   ├── environments/
│   │   │   ├── environment.ts
│   │   │   └── environment.prod.ts
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── styles.css
│   ├── angular.json
│   ├── proxy.conf.json
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md

💻 Prerequisites

Install the following before starting:

Node.js 22+ — https://nodejs.org/

Git — https://git-scm.com/

Angular CLI 22.x

MongoDB Atlas or local MongoDB

Cloudinary account for product images

An email service configuration if real email delivery is required

Check Node/npm:

node --version
npm --version

Install Angular CLI:

npm install -g @angular/cli

Check Angular:

ng version

📥 Clone the Repository

git clone https://github.com/Rohit-kasaudhan/ShopWave-MEAN-Ecommerce.git
cd ShopWave-MEAN-Ecommerce

This repository contains two separate npm projects, so dependencies must be installed separately.

⚙️ Backend Setup

Go to the backend:

cd Backend

Install dependencies:

npm install

The backend entry point is:

Backend/src/server.js

The API runs locally on:

http://localhost:5000

API base path:

http://localhost:5000/api/v1

🔐 Backend Environment Variables

Create this file locally:

Backend/config/config.env

Example:

PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/shopwave

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=your_smtp_host
EMAIL_PORT=2525
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password

FRONTEND_URL=http://localhost:4200

Never commit the real config.env file. The repository .gitignore excludes it.

🗄️ Database Setup

MongoDB Atlas

Create a MongoDB Atlas account.

Create a cluster.

Create a database user.

Configure Network Access/IP access.

Copy the connection string.

Put it into MONGO_URI.

Example format:

MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/shopwave

Never publish the real connection string.

Local MongoDB

If MongoDB is installed locally:

MONGO_URI=mongodb://localhost:27017/shopwave

Make sure MongoDB is running before starting the backend.

🌱 Seed Sample Data

The project contains:

Backend/seeder.js

From the Backend directory:

node seeder.js

The current seeder creates sample categories/products and ensures an admin account exists. The seeded dataset currently contains 5 categories and 20 products.

Default seeded admin

Email:    admin@shopwave.com
Password: admin123456
Role:     admin

Important: change/remove this default credential before using the project in a real production environment.

⚠️ Seeder warning

The seeder deletes existing products and categories before inserting the sample data. Do not run it against a production database unless you intentionally want to reset those collections.

▶️ Start the Backend

From Backend/:

npm start

Backend:

http://localhost:5000

If you want to run the server directly:

node src/server.js

🎨 Frontend Setup

Open a new PowerShell terminal and go to:

cd ShopWave-MEAN-Ecommerce\frontend

Install dependencies:

npm install

Start Angular:

npm start

or:

ng serve

Open:

http://localhost:4200

🔗 Frontend API Configuration

Development:

frontend/src/environments/environment.ts

Production:

frontend/src/environments/environment.prod.ts

For local development, the API base URL should be:

http://localhost:5000/api/v1

The deployed production frontend uses:

https://shopwave-mean-ecommerce.onrender.com/api/v1

The Angular production build is configured to use environment.prod.ts.

▶️ Run Locally

Use two terminals.

Terminal 1 — Backend

cd ShopWave-MEAN-Ecommerce\Backend
npm install
npm start

Terminal 2 — Frontend

cd ShopWave-MEAN-Ecommerce\frontend
npm install
npm start

Open:

http://localhost:4200

Architecture:

Angular :4200
     │
     ▼
Express :5000
     │
     ▼
MongoDB

🔌 API Overview

Base URL:

http://localhost:5000/api/v1

Production base URL:

https://shopwave-mean-ecommerce.onrender.com/api/v1

Authentication — /auth

Method

Endpoint

Description

POST

/signup

Register a user

POST

/verify-email

Verify email

POST

/login

Login

POST

/logout

Logout

GET

/me

Get authenticated user

Products — /products

Method

Endpoint

Description

GET

/

Get products/search/filter

GET

/:id

Get product details

POST

/

Create product — Admin

PUT

/:id

Update product — Admin

DELETE

/:id

Delete product — Admin

Categories — /categories

Method

Endpoint

Description

GET

/

Get categories

POST

/

Create category — Admin

PUT

/:id

Update category — Admin

DELETE

/:id

Delete category — Admin

Cart — /cart

Method

Endpoint

Description

GET

/

Get current user's cart

POST

/add

Add item

PUT

/:itemId

Update quantity

DELETE

/:itemId

Remove item

DELETE

/clear

Clear cart

Cart operations require authentication.

Orders — /orders

Order functionality includes order creation, customer order retrieval, individual order retrieval, and administrative order-status updates.

Users — /users

User routes provide administrative user-management functionality and are protected by authentication/authorization rules.

🔑 Authentication Flow

ShopWave uses JWT authentication:

Signup
  ↓
Email verification
  ↓
Login
  ↓
JWT token
  ↓
Angular AuthService
  ↓
HTTP interceptor
  ↓
Authorization: Bearer <token>
  ↓
Express authentication middleware
  ↓
Protected API

Frontend route protection includes:

frontend/src/app/core/guards/auth.guard.ts
frontend/src/app/core/guards/admin.guard.ts

🖼️ Image Uploads

Product images use:

Angular
  ↓
Express API
  ↓
Multer
  ↓
Cloudinary
  ↓
Image URL stored with product data

Configure:

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

📧 Email Verification

Email functionality is implemented in:

Backend/utils/sendEmail.js

The current implementation can use Mailtrap when a valid MAILTRAP_TOKEN is configured. If the Mailtrap token is not configured, the utility falls back to logging the email recipient, subject, and message in the backend console instead of sending a real email.

Do not commit email credentials or tokens.

🚀 Production Deployment

Current deployment:

Angular 22  ─────► Vercel
Express API ─────► Render
MongoDB     ─────► MongoDB Atlas
Images      ─────► Cloudinary

Vercel — Frontend

Frontend directory:

frontend/

Production build:

npm run build

or:

ng build --configuration production

Current Angular output directory:

dist/frontend/browser

The production API URL is configured in:

frontend/src/environments/environment.prod.ts

Render — Backend

Backend root directory:

Backend/

Build command:

npm install

Start command:

node src/server.js

Production variables should include:

NODE_ENV=production
MONGO_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://shop-wave-mean-ecommerce.vercel.app

For managed hosts, follow the platform's port requirement and prefer its provided PORT value rather than hard-coding a production port.

🧪 Build and Test the Frontend

Build:

cd frontend
npm run build

Run tests configured by the Angular project:

npm test

🛠️ Troubleshooting

npm is not recognized

Install Node.js and restart PowerShell:

node --version
npm --version

ng is not recognized

npm install -g @angular/cli
ng version

MongoDB connection fails

Check MONGO_URI, Atlas Network Access, database username/password, and that the database is reachable.

Frontend cannot reach backend

Confirm backend is running on http://localhost:5000 and that the frontend environment points to:

http://localhost:5000/api/v1

CORS error

Check Backend/src/app.js and ensure the frontend origin is allowed. Local frontend:

http://localhost:4200

Production frontend:

https://shop-wave-mean-ecommerce.vercel.app

Also verify the production FRONTEND_URL variable.

Images fail to upload

Verify all Cloudinary credentials and check backend logs.

Email verification does not arrive

Check the backend logs and Mailtrap configuration. Without the required Mailtrap token, the current implementation logs the email instead of delivering it.

Admin page is inaccessible

Verify that the logged-in account has role: admin. Both frontend route guards and backend authorization protect administrative functionality.

🔒 Security Notes

Never commit:

Backend/config/config.env
.env
.env.*
node_modules/
dist/
.angular/

Never publish:

MONGO_URI
JWT_SECRET
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
EMAIL_PASS
MAILTRAP_TOKEN

If a secret is accidentally exposed, rotate the credential immediately and update the deployment environment.

🧹 Before Pushing to GitHub

Check:

git status

Make sure secrets and generated folders are not staged.

Then:

git add .
git commit -m "Update project"
git push origin main

🌿 Recommended Git Workflow

Create a feature branch:

git checkout -b feature/my-feature

After making and testing changes:

git add .
git commit -m "Add my feature"
git push origin feature/my-feature

📊 Project Status

Component

Status

Angular Frontend

✅

Node.js Backend

✅

Express REST API

✅

MongoDB Atlas

✅

JWT Authentication

✅

Product Management

✅

Category Management

✅

Shopping Cart

✅

Orders

✅

Admin Dashboard

✅

Cloudinary Integration

✅

CORS

✅

Production Environment

✅

Vercel Deployment

✅

Render Deployment

✅

📍 Useful Links

Live App: https://shop-wave-mean-ecommerce.vercel.app

Backend: https://shopwave-mean-ecommerce.onrender.com

GitHub: https://github.com/Rohit-kasaudhan/ShopWave-MEAN-Ecommerce

🤝 Contributing

Fork the repository.

Create a feature branch.

Make your changes.

Test frontend and backend.

Commit your changes.

Push your branch.

Open a pull request.

📄 License

This repository currently does not declare a custom open-source license in the root README. Before redistributing or publishing modified versions, review the license/terms of any upstream code or third-party assets used in the project.

👨‍💻 Author

Rohit Kasaudhan

GitHub: https://github.com/Rohit-kasaudhan

⭐ If you find this project useful, consider starring the repository.

Built with MongoDB + Express.js + Angular + Node.js.
