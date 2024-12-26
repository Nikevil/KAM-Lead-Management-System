const { Op } = require("sequelize");
const db = require("../models");

class ContactRepository {
  // Create a new contact
  async createContact({ name, phone, email, role }) {
    try {
      const newContact = await db.Contact.create({
        name,
        phone,
        email,
        role,
      });
      return newContact;
    } catch (error) {
      throw new Error("Error creating contact: " + error.message);
    }
  }

  async validateContact(phone) {
    const existingContact = await db.Contact.findOne({
      where: {
        phone,
      },
    });
    if (existingContact) {
      throw new Error("Contact already exists");
    }
  }

  // Get a contact by its ID
  async getContactById(id) {
    try {
      const contact = await db.Contact.findByPk(id);
      return contact;
    } catch (error) {
      throw new Error("Error fetching contact: " + error.message);
    }
  }

  // Get all contacts by Lead ID
  async getContactsByLeadId(leadId) {
    try {
      const contacts = await db.Contact.findAll({
        include: [
          {
            model: db.Lead,
            through: { attributes: [] },
            where: { id: leadId },
          },
        ],
      });
      return contacts;
    } catch (error) {
      throw new Error("Error fetching contacts by lead ID: " + error.message);
    }
  }

  // Update a contact by its ID
  async updateContact(id, { name, phone, email, role }) {
    try {
      const contact = await db.Contact.findByPk(id);
      if (!contact) {
        throw new Error("Contact not found");
      }

      // Update contact details
      await contact.update({
        name,
        phone,
        email,
        role,
      });
      return contact;
    } catch (error) {
      throw new Error("Error updating contact: " + error.message);
    }
  }

  // Delete a contact by its ID
  async deleteContact(id) {
    try {
      const contact = await db.Contact.findByPk(id);
      if (!contact) {
        return null;
      }
      await contact.destroy(); // Delete the contact from the database
      return contact;
    } catch (error) {
      throw new Error("Error deleting contact: " + error.message);
    }
  }

    // Add contacts to a lead
  async addContactsToLead(leadId, contacts) {
    try {
      const lead = await db.Lead.findByPk(leadId);
      if (!lead) {
        throw new Error("Lead not found");
      }

      // Fetch all existing phone numbers
      const existingContacts = await db.Contact.findAll({
        attributes: ["phone"],
      });
      const existingPhoneNumbers = existingContacts.map(
        (contact) => contact.phone
      );

      // Filter out contacts with existing phone numbers
      const validContacts = contacts.filter(
        (contact) => !existingPhoneNumbers.includes(contact.phone)
      );

      // Use bulkCreate to create valid contacts
      if (validContacts.length > 0) {
        const createdContacts = await db.Contact.bulkCreate(validContacts);
        await lead.addContacts(createdContacts);
      }

      return lead;
    } catch (error) {
      throw new Error("Error adding contacts to lead: " + error.message);
    }
  }
}
module.exports = new ContactRepository();
