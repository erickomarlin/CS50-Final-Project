const carboList = document.getElementById("carboList");
const proteinList = document.getElementById("proteinList");
const errorMsg = document.getElementById("errorMsg");
const submitBtn = document.getElementById("submitBtn");

function renderEntry(listEl, entry) {
  const row = document.createElement("div");
  row.className =
    "flex justify-between text-sm text-white border-b border-line pb-1";
  row.innerHTML = `<span>${entry.name} (${entry.gram}g)</span><span class="text-gray-500">${entry.calorie} cal</span>`;
  listEl.appendChild(row);
}

async function addFood(category, nameInputId, gramInputId, listEl) {
  errorMsg.classList.add("hidden");
  const nameInput = document.getElementById(nameInputId);
  const gramInput = document.getElementById(gramInputId);

  const name = nameInput.value.trim();
  const gram = Number(gramInput.value);

  if (!name || !gram || gram <= 0) {
    errorMsg.textContent = "Enter a food name and a gram amount above 0";
    errorMsg.classList.remove("hidden");
    return;
  }

  try {
    const data = await api.post("/logs/food", { name, category, gram });
    const added = Array.isArray(data.food)
      ? data.food[data.food.length - 1]
      : data.food;
    renderEntry(listEl, added);
    nameInput.value = "";
    gramInput.value = "";
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
  }
}

document.getElementById("addCarbo").addEventListener("click", () => {
  addFood("carbo", "carboName", "carboGram", carboList);
});

document.getElementById("addProtein").addEventListener("click", () => {
  addFood("protein", "proteinName", "proteinGram", proteinList);
});

submitBtn.addEventListener("click", () => {
  window.location.href = "/pages/activity.html";
});
