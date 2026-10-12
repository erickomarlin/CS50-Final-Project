const foodListEl = document.getElementById("foodListEl");
const activityListEl = document.getElementById("activityListEl");
const foodTotalEl = document.getElementById("foodTotalEl");
const activityTotalEl = document.getElementById("activityTotalEl");

function renderRow(container, label, calorie) {
  const row = document.createElement("div");
  row.className =
    "flex justify-between px-3 py-2 border-b border-line text-sm text-white last:border-b-0";
  row.innerHTML = `<span>${label}</span><span class="text-gray-500">${calorie} cal</span>`;
  container.appendChild(row);
}

async function loadRecap() {
  try {
    const data = await api.get("/logs/recap");

    data.food.forEach((f) =>
      renderRow(foodListEl, `${f.name} (${f.gram}g)`, f.calorie),
    );
    data.activity.forEach((a) =>
      renderRow(activityListEl, `${a.name} (${a.minutes} min)`, a.calorie),
    );

    foodTotalEl.textContent = `${data.foodTotal} cal`;
    activityTotalEl.textContent = `${data.activityTotal} cal`;
  } catch (err) {
    foodListEl.innerHTML = `<p class="text-excess text-xs p-3">${err.message}</p>`;
  }
}

document.getElementById("submitBtn").addEventListener("click", () => {
  window.location.href = "./result.html";
});

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "./activity.html";
});

loadRecap();
