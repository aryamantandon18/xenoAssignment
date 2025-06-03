// In your routes file:
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authMiddleware');
const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  createCustomers
} = require('../controllers/customerController');

router.post("/bulk",createCustomers);
router.route('/')
  .get(isAuthenticated, getCustomers);

// router.route('/:id')
//   .get(isAuthenticated, getCustomer)
//   .put(isAuthenticated, updateCustomer)
//   .delete(isAuthenticated, deleteCustomer);

module.exports = router;