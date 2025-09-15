import MuteSetting from "../models/muteSetting.js";

export const getMuteState = async (req, res) => {
  try {
    let setting = await MuteSetting.findOne();
    if (!setting) {
      setting = await MuteSetting.create({ isMuted: false });
    }
    res.status(200).json({ isMuted: setting.isMuted });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch mute state" });
  } 
};

export const toggleMute = async (req, res) => {
  try {
    let setting = await MuteSetting.findOne();
    if (!setting) {
      setting = await MuteSetting.create({ isMuted: false });
    }

    if (typeof req.body.mute === "boolean") {
      setting.isMuted = req.body.mute;
    } else {
      setting.isMuted = !setting.isMuted;
    }

    await setting.save();
    res.status(200).json({ isMuted: setting.isMuted });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle mute" });
  }
};
