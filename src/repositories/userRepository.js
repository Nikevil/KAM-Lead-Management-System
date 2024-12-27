const db = require('../models');

class UserRepository {
  async createUser(name, username, password, email, status = 'active', phone) {
    return await db.User.create({ name, username, password, email, status, phone });
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

  async validateUser(whereCondition) {
    const user = await db.User.findOne({ where: whereCondition });
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
  
  async updateUser({ name, username, email, phone, status, roles }, id) {
    const user = await db.User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    const whereCondition = {
      status: 'active',
    };
    if (username) {
      whereCondition.username = username;
    }
    if (email) {
      whereCondition.email = email;
    }
    if (phone) {
      whereCondition.phone = phone;
    }
    await this.validateUser(whereCondition);

    await db.User.update({ name, email, username, phone, status }, { where: { id } });
    return user;
  }

  async addUserRoles(userRoles) {
    return await db.UserRole.bulkCreate(userRoles);
  }
}

module.exports = new UserRepository();