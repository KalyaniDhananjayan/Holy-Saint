const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://KalyaniDhananjayan:KalyaniDhananjayan2005@ecommerce-backend-db.8uclcer.mongodb.net/?appName=ecommerce-backend-db');
  console.log('MongoDB connected successfully');
  }
  catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;