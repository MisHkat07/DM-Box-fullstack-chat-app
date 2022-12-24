const mongoose = require('mongoose');

const connectDB = async () => {
  const URL = `${process.env.DATABASE_URL}`;
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('🔰Database has Connected!');
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
