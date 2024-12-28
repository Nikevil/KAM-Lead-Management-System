const db = require('../models');

class RoleRepository {

  // Get all roles with optional filters
  async getAllRoles(filters = {}) {
    return db.Role.findAll({ where: filters });
  }

  // Get a role by ID
  async findRoleById(id) {
    return db.Role.findByPk(id);
  }


}

module.exports = new RoleRepository();
