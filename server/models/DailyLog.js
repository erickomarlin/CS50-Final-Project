const mongoose = require("mongoose");

const foodEntrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["carbo", "protein"], required: true },
    gram: { type: Number, required: true },
    calorie: { type: Number, required: true },
  },
  { _id: false },
);

const activityEntrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    minutes: { type: Number, required: true },
    calorie: { type: Number, required: true }, // stored negative
  },
  { _id: false },
);

const dailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Store as 'YYYY-MM-DD' string, not a Date, so the 7-day profile chart
    // and "which day did I log" checks never fight timezone conversion.
    date: { type: String, required: true },

    food: [foodEntrySchema],
    activity: [activityEntrySchema],

    // Computed once on save instead of re-summed by every chart/result read.
    foodTotal: { type: Number, default: 0 },
    activityTotal: { type: Number, default: 0 },
    netCalorie: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// One log per user per day; also the exact shape of the profile chart's query
// (userId + last 7 dates), so it's a covering index for that read.
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

dailyLogSchema.pre("save", function computeTotals() {
  this.foodTotal = this.food.reduce((sum, f) => sum + f.calorie, 0);
  this.activityTotal = this.activity.reduce((sum, a) => sum + a.calorie, 0);
  this.netCalorie = this.foodTotal + this.activityTotal;
});

module.exports = mongoose.model("DailyLog", dailyLogSchema);
