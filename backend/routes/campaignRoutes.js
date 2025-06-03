const express = require('express');
const router = express.Router();
const { createCampaign, getCampaigns, getCampaign, updateCampaign, deleteCampaign } = require('../controllers/campaignController');
const isAuthenticated = require('../middlewares/authMiddleware');

router.route('/')
  .post(isAuthenticated, createCampaign)
  .get(isAuthenticated, getCampaigns);

router.route('/:id')
  .get(isAuthenticated,getCampaign)
  .put(isAuthenticated,updateCampaign)
  .delete(isAuthenticated,deleteCampaign)
module.exports = router;