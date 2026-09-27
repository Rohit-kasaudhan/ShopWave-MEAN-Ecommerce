const mongoose = require('mongoose');
const Order = require('../models/order');

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: orders, count: orders.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId
      ? { $or: [{ uuid: req.params.id }, { _id: req.params.id }] }
      : { uuid: req.params.id };

    const order = await Order.findOne(query).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

////////for admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'FirstName LastName email')
      .populate('items.product', 'name images')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: orders, count: orders.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/////////////for admin update
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { uuid: req.params.id },
      {
        status,
        ...(status === 'delivered' ? { deliveredAt: new Date() } : {}),
        ...(status === 'processing' ? { paidAt: new Date() } : {}),
      },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order, message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
