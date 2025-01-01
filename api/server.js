const { app, loadRoutes } = require('./app');
const sequelize = require('./config/database');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');

// Start the server
const PORT = process.env.PORT || 3000;

const init = async () => {
  try {
    // Ensure routes are loaded before starting the server
    await loadRoutes();
    logger.info('Routes loaded successfully.');

    app.use(errorHandler);

    // Attempt to connect to the database
    await sequelize.authenticate();
    logger.info('Database connected successfully.');

    // Start the server only after routes are loaded and DB connection is successful
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // Log any error that occurs during route loading or DB connection
    logger.error('Error during startup:', error);
    process.exit(1);  // Exit with failure status
  }
};

// Start the server
init();
