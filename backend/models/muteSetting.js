import mongoose from "mongoose";

const muteSettingSchema = new mongoose.Schema({
  isMuted: { type: Boolean, default: false },
});

const MuteSetting =
  mongoose.models.MuteSetting ||
  mongoose.model("MuteSetting", muteSettingSchema);

export default MuteSetting;
