module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures name is not empty
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures phone is not empty
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true, // Allow email to be nullable if not required
      validate: {
        isEmail: true, // Ensures the value is a valid email
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures role is not empty
      },
    },
  }, {
    tableName: 'contacts',
    timestamps: true, // Adds createdAt and updatedAt
    indexes: [
      { fields: ['email'], unique: true },
      { fields: ['phone'] },
    ],
  });

  // Associations
  Contact.associate = (models) => {
    // A contact can have many leads through the LeadContacts mapping table
    Contact.belongsToMany(models.Lead, {
      through: models.LeadContacts, // The mapping table
      foreignKey: 'contactId', // The foreign key in LeadContacts
      otherKey: 'leadId', // The other foreign key in LeadContacts
    });
    Contact.hasMany(models.Interaction, { foreignKey: 'contactId' });
  };

  return Contact;
};
