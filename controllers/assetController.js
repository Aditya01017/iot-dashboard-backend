const Asset = require('../models/Asset');

exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({});
    res.status(200).json({ success: true, count: assets.length, data: assets });
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
