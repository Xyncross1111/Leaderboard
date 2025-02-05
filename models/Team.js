import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  members: [{
    name: {
      type: String,
      required: true
    }
  }],
  points: {
    type: Number,
    default: 700
  }
});

export default mongoose.models.Team || mongoose.model('Team', teamSchema);
