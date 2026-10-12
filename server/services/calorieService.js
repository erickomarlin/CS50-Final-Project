const foods = require("../data/foods.json");
const activities = require("../data/activities.json");
const mealPlans = require("../data/mealPlans.json");
const nutrients = require("../data/nutrients.json");

const DEFAULT_CAL_PER_GRAM = { carbo: 1.3, protein: 1.6 };
const DEFAULT_CAL_PER_MINUTE = 6;

function findFood(name) {
  return foods.find((f) => f.name.toLowerCase() === name.toLowerCase());
}

function findActivity(name) {
  return activities.find((a) => a.name.toLowerCase() === name.toLowerCase());
}

exports.calculateFoodCalorie = (name, gram, category) => {
  const match = findFood(name);
  const calPerGram = match
    ? match.calPerGram
    : DEFAULT_CAL_PER_GRAM[category] || 1.3;
  return Math.round(gram * calPerGram);
};

exports.calculateActivityCalorie = (name, minutes) => {
  const match = findActivity(name);
  const calPerMinute = match ? match.calPerMinute : DEFAULT_CAL_PER_MINUTE;
  return -Math.round(minutes * calPerMinute);
};

exports.suggestActivities = (targetCalorie) => {
  if (targetCalorie <= 0) return [];

  const sorted = [...activities].sort(
    (a, b) => b.calPerMinute - a.calPerMinute,
  );
  const primary = sorted[0];
  const secondary = sorted[1];

  const primaryMinutes = Math.round(
    (targetCalorie * 0.6) / primary.calPerMinute,
  );
  const primaryBurn = primaryMinutes * primary.calPerMinute;
  const secondaryMinutes = Math.round(
    (targetCalorie - primaryBurn) / secondary.calPerMinute,
  );

  const suggestions = [];
  if (primaryMinutes > 0) {
    suggestions.push({
      name: primary.name,
      minutes: primaryMinutes,
      calorie: -primaryBurn,
    });
  }
  if (secondaryMinutes > 0) {
    suggestions.push({
      name: secondary.name,
      minutes: secondaryMinutes,
      calorie: -(secondaryMinutes * secondary.calPerMinute),
    });
  }
  return suggestions;
};

exports.buildResult = (dailyLog) => {
  const netCalorie = dailyLog.netCalorie;
  const light = { netCalorie };
  const balance = {
    netCalorie,
    suggestedActivities:
      netCalorie > 0 ? exports.suggestActivities(netCalorie) : [],
  };
  const determinedTarget = netCalorie + 200;
  const determined = {
    netCalorie,
    suggestedActivities:
      determinedTarget > 0 ? exports.suggestActivities(determinedTarget) : [],
    nutrients: nutrients.slice(0, 1),
    tomorrowMealPlan: mealPlans,
  };
  return { light, balance, determined };
};

// Plan (Section 8c): scales food calories toward a target, respecting floors.
// mode 'optimize' -> target net calorie = 0. mode 'burn' -> target net calorie = -200.
exports.applyPlanAdjustment = (foods, activityTotal, mode) => {
  const minCalFor = (f) => (f.category === "protein" ? f.calorie * 0.5 : 0);

  const currentTotal = foods.reduce((sum, f) => sum + f.calorie, 0);
  const floorTotal = foods.reduce((sum, f) => sum + minCalFor(f), 0);

  const rawTarget = mode === "burn" ? -activityTotal - 200 : -activityTotal;
  const target = Math.max(floorTotal, Math.min(currentTotal, rawTarget));

  if (currentTotal === floorTotal) {
    return foods.map((f) => {
      const min = minCalFor(f);
      return { ...f, gram: f.gram * (min / f.calorie), calorie: min };
    });
  }

  const t = (currentTotal - target) / (currentTotal - floorTotal);
  return foods.map((f) => {
    const min = minCalFor(f);
    const calorie = f.calorie - t * (f.calorie - min);
    const gram = f.gram * (calorie / f.calorie);
    return { ...f, gram, calorie };
  });
};
