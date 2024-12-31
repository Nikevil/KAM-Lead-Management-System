const contactRepository = require('../../../api/repositories/contactRepository');
const db = require('../../../api/models');

jest.mock('../../../api/models', () => ({
  Contact: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    bulkCreate: jest.fn(),
  },
  Lead: {
    findByPk: jest.fn(),
  },
  LeadContacts: {
    bulkCreate: jest.fn(),
  },
}));

describe('ContactRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateContact', () => {
    it('should throw an error if contact already exists', async () => {
      db.Contact.findOne.mockResolvedValue({ phone: '1234567890' });

      await expect(
        contactRepository.validateContact('1234567890'),
      ).rejects.toThrow('Contact already exists');

      expect(db.Contact.findOne).toHaveBeenCalledWith({
        where: { phone: '1234567890' },
      });
    });

    it('should not throw an error if contact does not exist', async () => {
      db.Contact.findOne.mockResolvedValue(null);

      await expect(
        contactRepository.validateContact('1234567890'),
      ).resolves.not.toThrow();

      expect(db.Contact.findOne).toHaveBeenCalledWith({
        where: { phone: '1234567890' },
      });
    });
  });

  describe('getContactById', () => {
    it('should return a contact by ID', async () => {
      const mockContact = { id: 1, name: 'John Doe' };
      db.Contact.findByPk.mockResolvedValue(mockContact);

      const result = await contactRepository.getContactById(1);
      expect(result).toEqual(mockContact);
      expect(db.Contact.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw an error if something goes wrong', async () => {
      db.Contact.findByPk.mockRejectedValue(new Error('Database error'));

      await expect(contactRepository.getContactById(1)).rejects.toThrow(
        'Error fetching contact: Database error',
      );
    });
  });

  describe('getContactsByLeadId', () => {
    it('should return contacts for a given lead ID', async () => {
      const mockContacts = [{ id: 1, name: 'John Doe' }];
      db.Contact.findAll.mockResolvedValue(mockContacts);

      const result = await contactRepository.getContactsByLeadId(1);
      expect(result).toEqual(mockContacts);
      expect(db.Contact.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: db.Lead,
            through: { attributes: [] },
            where: { id: 1 },
          },
        ],
      });
    });

    it('should throw an error if something goes wrong', async () => {
      db.Contact.findAll.mockRejectedValue(new Error('Database error'));

      await expect(contactRepository.getContactsByLeadId(1)).rejects.toThrow(
        'Error fetching contacts by lead ID: Database error',
      );
    });
  });

  describe('updateContact', () => {
    it('should update and return the contact', async () => {
      const mockContact = {
        id: 1,
        update: jest.fn().mockResolvedValue(true),
      };
      db.Contact.findByPk.mockResolvedValue(mockContact);

      const updates = { name: 'Jane Doe', phone: '9876543210', email: 'jane@example.com', role: 'Manager' };
      const result = await contactRepository.updateContact(1, updates, 42);

      expect(mockContact.update).toHaveBeenCalledWith({
        ...updates,
        updatedBy: 42,
      });
      expect(result).toEqual(mockContact);
    });

    it('should throw an error if contact not found', async () => {
      db.Contact.findByPk.mockResolvedValue(null);

      await expect(
        contactRepository.updateContact(1, {}, 42),
      ).rejects.toThrow('Contact not found');
    });
  });

  describe('deleteContact', () => {
    it('should delete and return the contact', async () => {
      const mockContact = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      db.Contact.findByPk.mockResolvedValue(mockContact);

      const result = await contactRepository.deleteContact(1);

      expect(mockContact.destroy).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it('should return null if contact not found', async () => {
      db.Contact.findByPk.mockResolvedValue(null);

      const result = await contactRepository.deleteContact(1);
      expect(result).toBeNull();
    });
  });

  describe('addContactsToLead', () => {
    it('should add valid contacts to the lead and return them', async () => {
      const mockLead = { id: 1 };
      const mockContacts = [{ id: 1, phone: '1234567890' }];

      db.Lead.findByPk.mockResolvedValue(mockLead);
      db.Contact.findAll.mockResolvedValue([]);
      db.Contact.bulkCreate.mockResolvedValue(mockContacts);
      db.LeadContacts.bulkCreate.mockResolvedValue(true);

      const inputContacts = [
        { name: 'John Doe', phone: '1234567890', email: 'john@example.com' },
      ];

      const result = await contactRepository.addContactsToLead(
        { leadId: 1, contacts: inputContacts },
        42,
      );

      expect(result).toEqual(mockContacts);
      expect(db.Contact.bulkCreate).toHaveBeenCalledWith([
        {
          name: 'John Doe',
          phone: '1234567890',
          email: 'john@example.com',
          createdBy: 42,
          updatedBy: 42,
        },
      ]);
    });

    it('should throw an error if lead not found', async () => {
      db.Lead.findByPk.mockResolvedValue(null);

      await expect(
        contactRepository.addContactsToLead({ leadId: 1, contacts: [] }, 42),
      ).rejects.toThrow('Lead not found');
    });
  });
});
