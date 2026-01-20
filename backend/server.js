const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");

// ROUTES
const userRoutes = require("./routes/userRoutes");
const trainRoutes = require("./routes/trainRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/bookings", bookingRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Railway Backend Running 🚆");
});

// CONNECT DATABASE
connectDB();

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
