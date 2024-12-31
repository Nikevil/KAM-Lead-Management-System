const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Route for the landing page (Root URL)
app.get('/', (req, res) => {
  res.send('Welcome to KAM Lead Management System!');
});

// Dynamically import all route files from the api/routes directory
const routesPath = path.join(__dirname,  'routes');

// Function to load routes dynamically
const loadRoutes = () => {
  return new Promise((resolve, reject) => {
    try {
      fs.readdirSync(routesPath).forEach((file) => {
        if (file.endsWith('.js')) {
          const routeName = file.replace('.js', ''); // Remove .js extension for the route path
          const route = require(path.join(routesPath, file));
          app.use(`/api/${routeName}`, route); // Dynamically set the route
        }
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// Export loadRoutes so we can use it in server.js
module.exports = { app, loadRoutes };
