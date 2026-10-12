const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const onboardingRoutes = require("./routes/onboarding");
const logRoutes = require("./routes/logs");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/logs", logRoutes);

app.use(express.static(path.join(__dirname, "../client")));

app.get("/api/checkStatus", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on localhost: ${PORT}`));
});
