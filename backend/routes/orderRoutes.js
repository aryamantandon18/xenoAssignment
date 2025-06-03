const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authMiddleware');
const {
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  createOrders
} = require('../controllers/orderController');

router.post('/bulk',createOrders);
// router.route('/')
//   // .post(isAuthenticated, createOrder)
//   .get(isAuthenticated, getOrders);

// router.route('/:id')
//   .get(isAuthenticated, getOrder)
//   .delete(isAuthenticated, deleteOrder);

// router.put('/:id/status', isAuthenticated, updateOrderStatus);

module.exports = router;