import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('🟢 MongoDB connected successfully.'))
  .catch((err) => {
    console.error('🔴 MongoDB connection error:', err.message);
    process.exit(1);
  });

export default mongoose.connection;
