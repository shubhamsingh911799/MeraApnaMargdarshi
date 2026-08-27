const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const wealthRoutes = require("./routes/wealthRoutes");
const dayProfileRoutes = require("./routes/dayProfileRoutes");
const dailyPlanRoutes = require("./routes/dailyPlanRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const growthRoutes = require("./routes/growthRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* =========================================================
   SECURITY
========================================================= */

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(mongoSanitize());

/* =========================================================
   PERFORMANCE
========================================================= */

app.use(compression());

/* =========================================================
   LOGGING
========================================================= */

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

/* =========================================================
   BODY PARSER
========================================================= */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MeraApnaMargdarshi API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   ROUTES
========================================================= */

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/wealth", wealthRoutes);
app.use("/api/growth", growthRoutes);
app.use("/api/day-profile", dayProfileRoutes);
app.use("/api/daily-plan", dailyPlanRoutes);
app.use("/api/dashboard", dashboardRoutes);
// 404 Handler

app.use((req,res)=>{

 return res.status(404).json({

  success:false,

  message:"Route not found"

 });

});


// Global Error Handler



app.use(errorHandler);
module.exports = app;