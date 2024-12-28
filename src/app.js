const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Import routes
const leadRoutes = require("./routes/leadRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Use routes
app.use("/api/leads", leadRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

module.exports = app;
