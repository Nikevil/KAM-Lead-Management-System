const db = require('../models');

class UserRepository {
  async createUser(username, password, email, status = 'active') {
    return await db.User.create({ username, password, email, status });
  }

  async getAllUsers() {
    return db.User.findAll(
      {
      attributes: ['id', 'username', 'email', 'status', 'createdAt', 'updatedAt'],
      include: [{
        model: db.Role,
        attributes: ['id', 'name'],
        through: { attributes: [] },
      }]
    });
  }

  async validateUser(username, status = 'active') {
    const user = await db.User.findOne({ where: { username, status } });
    if (user) {
      throw new Error('User already exists');
    }
  }

  async findUserById(id) {
    return db.User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'status', 'createdAt', 'updatedAt'],
      include: [{
        model: db.Role,
        attributes: ['id', 'name'],
        through: { attributes: [] },
      }]
    });
  }
  

  async findUserByUsername(username, status = 'active') {
    return await db.User.findOne({
      where: { username, status },
      include: [{
        model: db.Role,
        through: { attributes: [] },
      }]
    });
  }
  

  async addUserRoles(userRoles) {
    return await db.UserRole.bulkCreate(userRoles);
  }
}

module.exports = new UserRepository();