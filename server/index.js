const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

const { connectDb } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary"); // Uncomment if needed

dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect to database
connectDb();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Uncomment and configure if cloudinary integration is needed
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes); // Uncomment if needed
app.use("/api/v1/reach", contactUsRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Simple test route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Server is running",
  });
});
