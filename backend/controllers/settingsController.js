import SettingsModel from "../models/settingsModel.js";

export const getDeliveryFee = async (req, res) => {
  let settings = await SettingsModel.findOne();
  if (!settings) {
    settings = await SettingsModel.create({ deliveryFee: 10 });
  }
  res.json({ success: true, deliveryFee: settings.deliveryFee });
};

export const updateDeliveryFee = async (req, res) => {
  const { deliveryFee } = req.body;

  let settings = await SettingsModel.findOne();
  if (!settings) {
    settings = await SettingsModel.create({ deliveryFee });
  } else {
    settings.deliveryFee = deliveryFee;
    await settings.save();
  }

  res.json({ success: true });
};
