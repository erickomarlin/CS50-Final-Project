const questions = [
  {
    field: "gender",
    type: "single",
    title: "Male or Female?",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
  },
  {
    field: "age",
    type: "number",
    title: "What is your age?",
    min: 16,
    max: 99,
  },
  {
    field: "goals",
    type: "multi",
    title: "What is your goal?",
    options: [
      { value: "get_info", label: "Get info today's calorie" },
      { value: "keep_weight", label: "Keep current body weight" },
      { value: "lose_weight", label: "Lose weight" },
    ],
  },
  {
    field: "goesToGym",
    type: "single",
    title: "Do you like going to the gym?",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  {
    field: "activityLocation",
    type: "single",
    title: "Where do you like to do your activity?",
    options: [
      { value: "outdoor", label: "Outdoor" },
      { value: "indoor", label: "Indoor" },
      { value: "both", label: "Both" },
    ],
  },
  {
    field: "sports",
    type: "multi",
    title: "What sport do you like to do?",
    options: [
      "Ball game",
      "Dance",
      "Bike",
      "Jogging",
      "Marathon",
      "Swim",
      "HIIT",
      "Badminton",
      "Climbing",
      "Boxing",
    ].map((s) => ({ value: s, label: s })),
  },
  {
    field: "spareTime",
    type: "multi",
    title: "How do you spend spare time?",
    options: [
      "Reading",
      "Cleaning",
      "Sleeping",
      "Watching",
      "Scrolling",
      "Walking",
      "Got no spare time",
    ].map((s) => ({ value: s, label: s })),
  },
  {
    field: "usesEquipment",
    type: "single",
    title: "Do you like to use equipment?",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  {
    field: "foundVia",
    type: "single",
    title: "Where did you find this app?",
    options: [
      { value: "ads", label: "Ads" },
      { value: "family", label: "Family" },
      { value: "friends", label: "Friends" },
      { value: "accidental", label: "Found accidentally" },
    ],
  },
];

let currentStep = 0;
const answers = {};

const progressBar = document.getElementById("progressBar");
const stepLabel = document.getElementById("stepLabel");
const questionTitle = document.getElementById("questionTitle");
const optionsContainer = document.getElementById("optionsContainer");
const errorMsg = document.getElementById("errorMsg");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

function renderProgress() {
  progressBar.innerHTML = "";
  questions.forEach((_, i) => {
    const bar = document.createElement("div");
    bar.className = `h-1 flex-1 rounded ${i <= currentStep ? "bg-gold" : "bg-line"}`;
    progressBar.appendChild(bar);
  });
}

function renderQuestion() {
  const q = questions[currentStep];
  stepLabel.textContent = `Question ${currentStep + 1} of ${questions.length}`;
  questionTitle.textContent = q.title;
  errorMsg.classList.add("hidden");
  optionsContainer.innerHTML = "";

  if (q.type === "number") {
    const input = document.createElement("input");
    input.type = "number";
    input.min = q.min;
    input.max = q.max;
    input.value = answers[q.field] || "";
    input.placeholder = `${q.min}–${q.max}`;
    input.className =
      "bg-brand border border-line text-white rounded-lg px-3 py-2 text-sm";
    input.id = "numberInput";
    optionsContainer.appendChild(input);
    return;
  }

  const selected = answers[q.field];
  q.options.forEach((opt) => {
    const isSelected =
      q.type === "multi"
        ? Array.isArray(selected) && selected.includes(opt.value)
        : selected === opt.value;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = opt.label;
    btn.className = isSelected
      ? "text-left px-3 py-2 rounded-lg border border-gold bg-gold/10 text-gold text-sm"
      : "text-left px-3 py-2 rounded-lg border border-line text-white text-sm";

    btn.addEventListener("click", () => {
      if (q.type === "multi") {
        const current = Array.isArray(answers[q.field]) ? answers[q.field] : [];
        answers[q.field] = current.includes(opt.value)
          ? current.filter((v) => v !== opt.value)
          : [...current, opt.value];
      } else {
        answers[q.field] = opt.value;
      }
      renderQuestion();
    });

    optionsContainer.appendChild(btn);
  });

  renderProgress();
}

function validateCurrent() {
  const q = questions[currentStep];
  if (q.type === "number") {
    const value = Number(document.getElementById("numberInput").value);
    if (!value || value < q.min || value > q.max) {
      errorMsg.textContent = `Enter an age between ${q.min} and ${q.max}`;
      errorMsg.classList.remove("hidden");
      return false;
    }
    answers[q.field] = value;
    return true;
  }

  const value = answers[q.field];
  const isEmpty =
    q.type === "multi"
      ? !Array.isArray(value) || value.length === 0
      : value === undefined;
  if (isEmpty) {
    errorMsg.textContent = "Please select at least one option";
    errorMsg.classList.remove("hidden");
    return false;
  }
  return true;
}

backBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", async () => {
  if (!validateCurrent()) return;

  if (currentStep < questions.length - 1) {
    currentStep++;
    renderQuestion();
    return;
  }

  // Last question — submit everything to the backend.
  nextBtn.disabled = true;
  nextBtn.textContent = "Saving...";
  try {
    await api.post("/onboarding", answers);
    window.location.href = "./food.html";
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
    nextBtn.disabled = false;
    nextBtn.textContent = "Next";
  }
});

renderQuestion();
