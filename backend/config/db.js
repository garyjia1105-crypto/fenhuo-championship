const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fenguo-championship', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error(`数据库连接错误: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
