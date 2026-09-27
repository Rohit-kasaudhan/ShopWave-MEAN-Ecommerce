const express = require('express');
const { protect, allowedTo } = require('../middlewares/authMiddleware');
const {
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.use(protect);

// User routes
router.get('/my', getMyOrders);

// Admin routes
router.get('/admin/all', allowedTo('admin'), getAllOrders);
router.patch('/:id/status', allowedTo('admin'), updateOrderStatus);

// Single order route (must be last to avoid route collision)
router.get('/:id', getOrder);

module.exports = router;
