const express = require('express');
const router = express.Router();
const { getAssets, deleteAsset } = require('../controllers/assetController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getAssets);

router.route('/:id')
  .delete(protect, deleteAsset);

module.exports = router;
