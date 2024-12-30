module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define(
    'Contact',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'contacts',
      timestamps: true,
      indexes: [{ fields: ['email'], unique: true }, { fields: ['phone'] }],
    },
  );

  // Associations
  Contact.associate = (models) => {
    Contact.belongsToMany(models.Lead, {
      through: models.LeadContacts,
      foreignKey: 'contactId',
      otherKey: 'leadId',
    });
    Contact.hasMany(models.Interaction, { foreignKey: 'contactId' });
  };

  return Contact;
};
