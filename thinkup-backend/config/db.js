const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/thinkup', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectat cu succes!');
  } catch (err) {
    console.error('Eroare conectare DB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
