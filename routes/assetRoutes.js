const express = require('express');
const router = express.Router();
const { getAssets, deleteAsset, createAsset, updateAsset } = require('../controllers/assetController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getAssets)
  .post(protect, createAsset);

router.route('/:id')
  .put(protect, updateAsset)
  .delete(protect, deleteAsset);

module.exports = router;
