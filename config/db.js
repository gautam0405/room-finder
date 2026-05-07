const mongoose = require('mongoose');
const seedAdminUser = require('./adminSeeder');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roomfinder';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    await seedAdminUser();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
