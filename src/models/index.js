const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');
const basename = path.basename(__filename);
const db = {};

// Load all models
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, require('sequelize').DataTypes);
    db[model.name] = model;
  });

// Run associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add migration logic
(async () => {
  try {
    const syncOptions = { alter: true }; // Adjust options: alter = modify, force = recreate
    console.log('Synchronizing database schema...');
    await sequelize.sync(syncOptions); // Sync all models with the database
    console.log('Database schema synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database schema:', error);
    process.exit(1); // Exit process on failure
  }
})();

db.sequelize = sequelize;
db.Sequelize = require('sequelize');

module.exports = db;
