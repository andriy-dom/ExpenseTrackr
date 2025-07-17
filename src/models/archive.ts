import mongoose from 'mongoose';

const archiveSchema = new mongoose.Schema({ 
  userId: String,
  category: String,
  amount: Number,
  currency: String,
  date: Date,
  archivedAt: Date
})

export default mongoose.model('Archive', archiveSchema);