const db = require('../models');

class UserRepository {
  
  // create a new user
  async createUser({name, username, password, email, status = 'active', phone}, userId) {
    return await db.User.create({ name, username, password, email, status, phone, createdBy: userId, updatedBy: userId });
  }

  // get all users
  async getAllUsers() {
    return db.User.findAll(
      {
        attributes: ['id', 'username', 'email', 'status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
        include: [{
          model: db.Role,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        }],
      });
  }

  // validate user
  async validateUser(whereCondition) {
    const user = await db.User.findOne({ where: whereCondition });
    if (user) {
      throw new Error('User already exists');
    }
  }

  // find user by id
  async findUserById(id) {
    return db.User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'status', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
      include: [{
        model: db.Role,
        attributes: ['id', 'name'],
        through: { attributes: [] },
      }],
    });
  }

  // find user by username
  async findUserByUsername(username, status = 'active') {
    return await db.User.findOne({
      where: { username, status },
      include: [{
        model: db.Role,
        through: { attributes: [] },
      }],
    });
  }
  
  // update user
  async updateUser({ name, username, email, phone, status }, id, userId) {
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

    await db.User.update({ name, email, username, phone, status, updatedBy: userId }, { where: { id } });
    return user;
  }

  // add user roles
  async addUserRoles(userRoles) {
    return await db.UserRole.bulkCreate(userRoles);
  }

  // Delete User by its ID
  async deleteUser(id) {
    try {
      const user = await db.User.findByPk(id);
      if (!user) {
        return null;
      }
      return await user.destroy(); // Delete the user from the database
    } catch (error) {
      throw new Error('Error deleting order: ' + error.message);
    }
  }

  // Update user password
  async updateUserPassword(userId, newPassword) {
    try {
      return await db.User.update(
        { password: newPassword, updatedBy: userId },
        { where: { id: userId }, individualHooks: true },
      );
    } catch (error) {
      throw new Error('Error updating password: ' + error.message);
    }
  }
}

module.exports = new UserRepository();