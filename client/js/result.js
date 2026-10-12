let resultData = null;
let activeLevel = "light";

const netCalorieEl = document.getElementById("netCalorieEl");
const activitiesSection = document.getElementById("activitiesSection");
const activitiesList = document.getElementById("activitiesList");
const nutrientsSection = document.getElementById("nutrientsSection");
const nutrientsList = document.getElementById("nutrientsList");
const mealPlanSection = document.getElementById("mealPlanSection");
const mealPlanList = document.getElementById("mealPlanList");

function renderLevel() {
  const level = resultData[activeLevel];

  netCalorieEl.textContent = `${level.netCalorie >= 0 ? "+" : ""}${level.netCalorie} cal`;
  netCalorieEl.className = `text-2xl font-medium ${level.netCalorie >= 0 ? "text-excess" : "text-loss"}`;

  document.querySelectorAll(".level-btn").forEach((btn) => {
    const isActive = btn.dataset.level === activeLevel;
    btn.className = isActive
      ? "level-btn flex-1 text-xs py-2 rounded-lg border border-gold bg-gold/10 text-gold"
      : "level-btn flex-1 text-xs py-2 rounded-lg border border-line text-gray-400";
  });

  activitiesList.innerHTML = "";
  const activities = level.suggestedActivities || [];
  activitiesSection.classList.toggle("hidden", activities.length === 0);
  activities.forEach((a) => {
    const row = document.createElement("div");
    row.className =
      "flex justify-between px-3 py-2 border border-line rounded-lg text-sm text-white";
    row.innerHTML = `<span>${a.name}</span><span class="text-gray-500">${a.minutes} min</span>`;
    activitiesList.appendChild(row);
  });

  nutrientsList.innerHTML = "";
  const nutrients = level.nutrients || [];
  nutrientsSection.classList.toggle("hidden", nutrients.length === 0);
  nutrients.forEach((n) => {
    const row = document.createElement("div");
    row.className =
      "flex justify-between px-3 py-2 border border-line rounded-lg text-sm text-white";
    row.innerHTML = `<span>${n.name}</span>`;
    nutrientsList.appendChild(row);
  });

  mealPlanList.innerHTML = "";
  const mealPlan = level.tomorrowMealPlan || [];
  mealPlanSection.classList.toggle("hidden", mealPlan.length === 0);
  mealPlan.forEach((m) => {
    const row = document.createElement("div");
    row.className =
      "flex justify-between px-3 py-2 border border-line rounded-lg text-sm text-white";
    row.innerHTML = `<span>${m.name}</span><span class="text-gray-500">${m.calorie} cal</span>`;
    mealPlanList.appendChild(row);
  });
}

document.querySelectorAll(".level-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    activeLevel = btn.dataset.level;
    renderLevel();
  });
});

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "/pages/recap.html";
});

document
  .getElementById("submitAnotherBtn")
  .addEventListener("click", async () => {
    const ok = confirm(
      "This will replace today's food and activity lists. Continue?",
    );
    if (!ok) return;

    try {
      await api.delete("/logs/food");
      await api.delete("/logs/activity");
      window.location.href = "/pages/food.html";
    } catch (err) {
      netCalorieEl.textContent = err.message;
    }
  });

async function loadResult() {
  try {
    resultData = await api.get("/logs/result");
    renderLevel();
  } catch (err) {
    netCalorieEl.textContent = err.message;
  }
}

loadResult();
