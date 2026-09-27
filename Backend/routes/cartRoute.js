const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout,
} = require('../controllers/cartController');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.route('/').get(getCart).delete(clearCart);
router.post('/items', addToCart);
router.patch('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeFromCart);
router.post('/checkout', checkout);

module.exports = router;
