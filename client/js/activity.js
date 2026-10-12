const activityListEl = document.getElementById("activityListEl");
const errorMsg = document.getElementById("errorMsg");

function renderEntry(entry) {
  const row = document.createElement("div");
  row.className =
    "flex justify-between text-sm text-white border-b border-line pb-1";

  // Handles caloriesBurned returned from backend (with fallbacks)
  const calories = entry.caloriesBurned ?? entry.calorie ?? 0;

  row.innerHTML = `<span>${entry.name} (${entry.minutes} min)</span><span class="text-gray-500">${calories} cal</span>`;
  activityListEl.appendChild(row);
}

document.getElementById("addActivity").addEventListener("click", async () => {
  errorMsg.classList.add("hidden");
  const nameInput = document.getElementById("activityName");
  const minutesInput = document.getElementById("activityMinutes");

  const name = nameInput.value.trim();
  const minutes = Number(minutesInput.value);

  if (!name || !minutes || minutes <= 0) {
    errorMsg.textContent = "Enter an activity name and minutes above 0";
    errorMsg.classList.remove("hidden");
    return;
  }

  try {
    const data = await api.post("/logs/activity", { name, minutes });

    // Safely extract entry whether data.activity is an object or an array
    const added = Array.isArray(data.activity)
      ? data.activity[data.activity.length - 1]
      : data.activity || data;

    renderEntry(added);
    nameInput.value = "";
    minutesInput.value = "";
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
  }
});

document.getElementById("submitBtn").addEventListener("click", () => {
  window.location.href = "./recap.html";
});

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "./food.html";
});
