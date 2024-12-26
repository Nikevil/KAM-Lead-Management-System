const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Disable query logging
  timezone: 'UTC', // Use UTC for date/time handling
  pool: {
    max: 10,        // Max number of connections
    min: 0,         // Min number of connections
    acquire: 30000, // Max wait time for a connection
    idle: 10000     // Max idle time before release
  },
  define: {
    timestamps: false, // Disable automatic timestamp fields
    freezeTableName: true // Disable auto pluralization of model names
  },
  retry: {
    max: 3 // Retry connection up to 3 times
  }
});


module.exports = sequelize;