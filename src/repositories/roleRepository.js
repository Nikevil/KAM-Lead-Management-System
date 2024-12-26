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

  // Check if a role name already exists
  async roleNameExists(name, excludeId = null) {
    const role = await db.Role.findOne({
      where: {
        name,
        ...(excludeId && { id: { [db.Sequelize.Op.ne]: excludeId } }) // Exclude the current role when updating
      }
    });
    return role !== null;
  }

  // Create a new role
  async createRole(roleData) {
    const { name } = roleData;

    // Check for duplicate role name before creation
    const exists = await this.roleNameExists(name);
    if (exists) {
      throw new Error('Role name already exists');
    }

    return db.Role.create(roleData);
  }

  // Update a role by ID
  async updateRole(id, roleData) {
    const { name } = roleData;

    // Find the role by ID
    const role = await db.Role.findByPk(id);
    if (!role) throw new Error('Role not found');

    // Check if the role name already exists
    const exists = await this.roleNameExists(name, id);
    if (exists) {
      throw new Error('Role name already exists');
    }

    // Update the role with the new data
    return role.update(roleData);
  }

  // "Delete" a role (set status to inactive)
  async deleteRole(id) {
    const role = await db.Role.findByPk(id);
    if (!role) throw new Error('Role not found');

    // Deactivate the role instead of removing it
    return role.update({ status: 'inactive' });
  }
}

module.exports = new RoleRepository();
