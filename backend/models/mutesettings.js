import mongoose from "mongoose";

const muteSettingSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true }, // e.g. "reminder"
  isMuted: { type: Boolean, default: false },
});

export default mongoose.model("MuteSetting", muteSettingSchema);
