const mongoose = require("mongoose");

const preferencesSchema = new mongoose.Schema(
  {
    gender: { type: String, enum: ["male", "female"] },
    age: { type: Number, min: 16, max: 99 },
    goals: [{ type: String, enum: ["get_info", "keep_weight", "lose_weight"] }],
    goesToGym: Boolean,
    activityLocation: { type: String, enum: ["outdoor", "indoor", "both"] },
    sports: [String],
    spareTime: [String],
    usesEquipment: Boolean,
    foundVia: {
      type: String,
      enum: ["ads", "family", "friends", "accidental"],
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: { type: String, required: true },
  preferences: preferencesSchema,
  subscriptionTier: {
    type: String,
    enum: ["light", "balance", "determined"],
    default: "light",
  },
  subscriptionExpiredsAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
