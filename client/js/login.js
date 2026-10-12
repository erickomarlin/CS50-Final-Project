const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.classList.add("hidden");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await api.post("/auth/login", { email, password });
    setToken(data.token);
    window.location.href = "./food.html";
  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
  }
});
