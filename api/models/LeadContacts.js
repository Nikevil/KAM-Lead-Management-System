module.exports = (sequelize, DataTypes) => {
  const LeadContacts = sequelize.define(
    'LeadContacts',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      leadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Leads',
          key: 'id',
        },
      },
      contactId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Contacts',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
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
      tableName: 'lead_contacts',
      timestamps: true,
      indexes: [
        { fields: ['leadId', 'contactId'], unique: true },
        { fields: ['status'] },
      ],
    },
  );

  return LeadContacts;
};
