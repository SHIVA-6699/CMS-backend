import mongoose from "mongoose";

const liveStreamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  streamLink: { type: String, required: true },
  thumbnail: { type: String, required: false  },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});
const LiveStream = mongoose.model('Livestream',liveStreamSchema);
export default LiveStream