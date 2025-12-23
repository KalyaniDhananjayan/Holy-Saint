const express = require('express');
const orderController = require('../controllers/order-controller');
const { protect, restrictTo } = require('../controllers/auth-controller');

const router = express.Router();

router.post('/', protect, orderController.createOrder);

router.get(
  '/my-orders',
  protect,
  orderController.getMyOrders
);

router.get(
  '/',
  protect,
  restrictTo('admin'),
  orderController.getAllOrders
);

router.patch(
  '/:id/status',
  protect,
  restrictTo('admin'),
  orderController.updateOrderStatus
);

module.exports = router;
