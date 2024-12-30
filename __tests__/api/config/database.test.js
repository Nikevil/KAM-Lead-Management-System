const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const sequelize = require('../../../api/config/database');

describe('Sequelize Configuration', () => {
  beforeAll(() => {
    // Mock environment variables
    process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/testdb';
    dotenv.config = jest.fn(() => ({
      parsed: {
        DATABASE_URL: process.env.DATABASE_URL,
      },
    }));
    dotenv.config();
  });

  it('should configure Sequelize with correct options', () => {
    expect(sequelize.options.dialect).toBe('postgres');
    expect(sequelize.options.logging).toBe(false);
    expect(sequelize.options.timezone).toBe('UTC');
    expect(sequelize.options.pool).toEqual({
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    });
    expect(sequelize.options.define).toEqual({
      timestamps: false,
      freezeTableName: true,
    });
    expect(sequelize.options.retry.max).toBe(3);
  });

  it('should create a valid Sequelize instance', () => {
    expect(sequelize).toBeInstanceOf(Sequelize);
  });

  describe('Database Connection', () => {
    it('should connect to the database successfully', async () => {
      sequelize.authenticate = jest.fn().mockResolvedValueOnce();

      await expect(sequelize.authenticate()).resolves.not.toThrow();
      expect(sequelize.authenticate).toHaveBeenCalled();
    });

    it('should fail to connect if there is an error', async () => {
      sequelize.authenticate = jest.fn().mockRejectedValueOnce(new Error('Connection failed'));

      await expect(sequelize.authenticate()).rejects.toThrow('Connection failed');
      expect(sequelize.authenticate).toHaveBeenCalled();
    });
  });
});
