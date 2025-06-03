const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authMiddleware');
const {
  createSegment,
  getAllSegments,
  getSegment,
  updateSegment,
  deleteSegment,
  previewSegment
} = require('../controllers/segmentController');

router.route('/')
  .post(isAuthenticated, createSegment)
  .get(isAuthenticated, getAllSegments);

router.route('/:id')
  .get(isAuthenticated, getSegment)
  .put(isAuthenticated, updateSegment)
  .delete(isAuthenticated, deleteSegment);

router.post('/preview', isAuthenticated, previewSegment);

module.exports = router;