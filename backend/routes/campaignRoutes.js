// routes/campaignRoutes.js
const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignStats,
  getCampaignLogs
} = require('../controllers/campaignController');
const isAuthenticated = require('../middlewares/authMiddleware');

router.route('/')
  .post(isAuthenticated, createCampaign)
  .get(isAuthenticated, getCampaigns);

router.route('/:id')
  .get(isAuthenticated, getCampaign)
  .put(isAuthenticated, updateCampaign)
  .delete(isAuthenticated, deleteCampaign);

router.route('/:id/stats')
  .get(isAuthenticated, getCampaignStats);

router.route('/:id/logs')
  .get(isAuthenticated, getCampaignLogs);

module.exports = router;