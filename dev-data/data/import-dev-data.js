const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Tshirt = require('./../../models/tshirt');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const tshirts = JSON.parse(
  fs.readFileSync(`${__dirname}/tshirts.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tshirt.create(tshirts);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tshirt.deleteMany();  // fixed
    console.log('Data successfully deleted!');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

// Option 1 (always importing for now)
connectDB().then(() => importData());

// if you want delete instead:
// connectDB().then(() => deleteData());
