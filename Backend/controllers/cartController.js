const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name images price stock'
    );
    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [], totalPrice: 0 } });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, color, size } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (i) =>
        i.product.toString() === productId &&
        i.color === color &&
        i.size === size
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, color, size, price: product.price });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price stock');
    res.status(200).json({ success: true, data: cart, message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    item.quantity = quantity;
    if (quantity <= 0) {
      cart.items.pull({ _id: req.params.itemId });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price stock');
    res.status(200).json({ success: true, data: cart, message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** DELETE /api/v1/cart/:itemId — Remove item from cart */
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items.pull({ _id: req.params.itemId });
    await cart.save();
    await cart.populate('items.product', 'name images price stock');
    res.status(200).json({ success: true, data: cart, message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || !cart.items || cart.items.length === 0)
      return res.status(400).json({ success: false, message: 'Cart is empty' });

    const orderItems = cart.items.map((i) => {
      const prod = i.product;
      const imageUrl =
        prod?.images?.[0]?.url ||
        (typeof prod?.images?.[0] === 'string' ? prod.images[0] : '') ||
        '';

      return {
        product: prod?._id || i.product,
        name: prod?.name || 'Product',
        price: i.price ?? prod?.price ?? 0,
        quantity: i.quantity,
        image: imageUrl,
        color: i.color,
        size: i.size,
      };
    });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice: cart.totalPrice,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod || 'cash',
    });

    await order.populate('items.product', 'name images price');
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({ success: true, data: order, message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
