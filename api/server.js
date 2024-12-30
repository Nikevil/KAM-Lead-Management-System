const app = require('./app');
const sequelize = require('./config/database');
const logger = require('./utils/logger');

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully.');
  } catch (error) {
    logger.error('Database connection failed:', error);
  }
});
