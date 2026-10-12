const DailyLog = require("../models/DailyLog");
const calorieService = require("../services/calorieService");

function todayString() {
  return new Date().toISOString().split("T")[0];
}

async function getOrCreateTodayLog(userId) {
  const date = todayString();
  let log = await DailyLog.findOne({ userId, date });
  if (!log) {
    log = await DailyLog.create({ userId, date, food: [], activity: [] });
  }
  return log;
}

// Section 2
exports.addFood = async (req, res) => {
  try {
    const { name, category, gram } = req.body;
    const calorie = calorieService.calculateFoodCalorie(name, gram, category);

    const log = await getOrCreateTodayLog(req.userId);
    log.food.push({ name, category, gram, calorie });
    await log.save();

    res.json({ food: log.food, foodTotal: log.foodTotal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.clearFood = async (req, res) => {
  try {
    const log = await getOrCreateTodayLog(req.userId);
    log.food = [];
    await log.save();
    res.json({ food: log.food, foodTotal: log.foodTotal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Section 3
exports.addActivity = async (req, res) => {
  try {
    const { name, minutes } = req.body;
    const calorie = calorieService.calculateActivityCalorie(name, minutes);

    const log = await getOrCreateTodayLog(req.userId);
    log.activity.push({ name, minutes, calorie });
    await log.save();

    res.json({ activity: log.activity, activityTotal: log.activityTotal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.clearActivity = async (req, res) => {
  try {
    const log = await getOrCreateTodayLog(req.userId);
    log.activity = [];
    await log.save();
    res.json({ activity: log.activity, activityTotal: log.activityTotal });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Section 4
exports.getRecap = async (req, res) => {
  try {
    const log = await getOrCreateTodayLog(req.userId);
    res.json({
      food: log.food,
      activity: log.activity,
      foodTotal: log.foodTotal,
      activityTotal: log.activityTotal,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Section 5
exports.getResult = async (req, res) => {
  try {
    const log = await getOrCreateTodayLog(req.userId);
    const result = calorieService.buildResult(log);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
