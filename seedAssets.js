const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Asset = require('./models/Asset');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedAssets = [
  { name: 'SN-901-Alpha', assetType: 'Generator Module', status: 'online', health: 'Good', tags: ['Sector 7G', 'Primary'], alarms: { critical: 0, major: 0, minor: 0 }, location: { lat: 34.0522, lng: -118.2437 } },
  { name: 'SN-402-Beta', assetType: 'HVAC Unit', status: 'offline', health: 'Poor', tags: ['Sector 4', 'Secondary'], alarms: { critical: 1, major: 0, minor: 2 }, location: { lat: 34.0522, lng: -118.2437 } },
  { name: 'SN-777-Omega', assetType: 'Sensor Array', status: 'UNKNOWN', health: 'Unknown', tags: ['External Pipeline'], alarms: { critical: 0, major: 0, minor: 0 }, location: { lat: 34.0522, lng: -118.2437 } },
  { name: 'SN-105-Gamma', assetType: 'Pump Station', status: 'online', health: 'Good', tags: ['Water', 'Primary'], alarms: { critical: 0, major: 1, minor: 0 }, location: { lat: 34.0522, lng: -118.2437 } },
  { name: 'SN-222-Delta', assetType: 'Conveyor Motor', status: 'online', health: 'Good', tags: ['Assembly Line', 'Active'], alarms: { critical: 0, major: 0, minor: 5 }, location: { lat: 34.0522, lng: -118.2437 } },
];

const injectData = async () => {
  try {
    await Asset.deleteMany(); 
    await Asset.insertMany(seedAssets);
    console.log('Seeded database successfully');
    process.exit();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

injectData();
