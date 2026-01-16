const Order = require('../models/order');
const Tshirt = require('../models/tshirt');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res, next) => {
  const { items, shippingAddress } = req.body; // ← Extract shippingAddress

  if (!items || items.length === 0) {
    return next(new AppError('No items in order', 400));
  }

  // Validate shipping address
  if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone) {
    return next(new AppError('Shipping address is required', 400));
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const tshirt = await Tshirt.findById(item.tshirt);

    if (!tshirt) {
      return next(new AppError('T-shirt not found', 404));
    }

    if (tshirt.stock < item.quantity) {
      return next(
        new AppError(`Not enough stock for ${tshirt.name}`, 400)
      );
    }

    totalAmount += tshirt.price * item.quantity;
    tshirt.stock -= item.quantity;
    await tshirt.save();

    orderItems.push({
      tshirt: tshirt._id,
      quantity: item.quantity,
      price: tshirt.price
    });
  }

  // Create order WITH shippingAddress
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    totalAmount,
    shippingAddress, 
    paymentMethod: req.body.paymentMethod || 'dummy'
  });

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});


const getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).populate(
    'items.tshirt',
    'name price designImages'
  );

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders
    }
  });
});

const getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.tshirt', 'name price designImages');

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.tshirt', 'name price designImages');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders }
  });
});

const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const allowedStatuses = ['paid', 'shipped', 'delivered', 'cancelled'];

  if (!allowedStatuses.includes(status)) {
    return next(new AppError('Invalid order status', 400));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
};
