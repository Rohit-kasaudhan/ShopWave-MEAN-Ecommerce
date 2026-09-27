const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env", override: true });

const express = require("express");
const app = express();

app.set("etag", false);

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    next();
});

const connectDB = require("../config/db");
const cors = require("cors");

const userRoute = require('../routes/userRoute');
const authRoute = require('../routes/authRoute');
const productRoute = require('../routes/productRoute');
const categoryRoute = require('../routes/categoryRoute');
const cartRoute = require('../routes/cartRoute');
const orderRoute = require('../routes/orderRoute');
const { sanitizeResponse } = require("../middlewares/sanitizeResponse");

connectDB();

app.use(cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sanitizeResponse);

app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/orders', orderRoute);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;
