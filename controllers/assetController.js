const Asset = require('../models/Asset');

exports.getAssets = async (req, res) => {
  try {

    const { page = 1, limit = 5, status, name } = req.query;

    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalCount = await Asset.countDocuments(query);
    const assets = await Asset.find(query).skip(skip).limit(parseInt(limit));
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({ 
      success: true, 
      count: assets.length, 
      totalCount,
      totalPages,
      currentPage: parseInt(page),
      data: assets 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    await asset.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error deleting asset' });
  }
};

exports.createAsset = async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json({ success: true, data: asset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error creating asset' });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    res.status(200).json({ success: true, data: asset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error updating asset' });
  }
};
