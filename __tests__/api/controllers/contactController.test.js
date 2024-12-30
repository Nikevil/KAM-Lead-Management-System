const { addContactsToLead, getContactById, getContactsByLeadId, updateContact, deleteContact } = require('../../../api/controllers/contactController');
const contactRepository = require('../../../api/repositories/contactRepository');

jest.mock('../../../api/repositories/contactRepository'); // Mock the contactRepository

describe('Contact Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  // Test case for addContactsToLead
  describe('addContactsToLead', () => {
    it('should add contacts successfully', async () => {
      const mockContacts = [{ id: 1, name: 'John Doe' }];
      req.body = { leadId: 1, contacts: [{ name: 'John Doe' }] };

      contactRepository.addContactsToLead.mockResolvedValue(mockContacts); // Mock the repository method

      await addContactsToLead(req, res, next);

      expect(contactRepository.addContactsToLead).toHaveBeenCalledWith(
        { leadId: 1, contacts: [{ name: 'John Doe' }] },
        1,
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Contacts created', contacts: mockContacts });
    });

    it('should return 500 if an error occurs in addContactsToLead', async () => {
      const errorMessage = 'Database error';
      req.body = { leadId: 1, contacts: [{ name: 'John Doe' }] };

      contactRepository.addContactsToLead.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await addContactsToLead(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });

  // Test case for getContactById
  describe('getContactById', () => {
    it('should return 200 and the contact when contact is found', async () => {
      const mockContact = { id: 1, name: 'John Doe' };
      req.params.id = 1; // Mock the contact ID in params

      contactRepository.getContactById.mockResolvedValue(mockContact); // Mock the repository method

      await getContactById(req, res, next);

      expect(contactRepository.getContactById).toHaveBeenCalledWith(1); // Check if getContactById is called with the correct ID
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockContact);
    });

    it('should return 404 if contact not found', async () => {
      req.params.id = 1; // Mock the contact ID in params

      contactRepository.getContactById.mockResolvedValue(null); // Mock contact not found

      await getContactById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Contact not found' });
    });

    it('should return 500 if an error occurs in getContactById', async () => {
      const errorMessage = 'Database error';
      req.params.id = 1; // Mock the contact ID in params

      contactRepository.getContactById.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await getContactById(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });

  // Test case for getContactsByLeadId
  describe('getContactsByLeadId', () => {
    it('should return 200 and the contacts when contacts are found for a lead', async () => {
      const mockContacts = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ];
      req.params.leadId = 1; // Mock the lead ID in params

      contactRepository.getContactsByLeadId.mockResolvedValue(mockContacts); // Mock the repository method

      await getContactsByLeadId(req, res, next);

      expect(contactRepository.getContactsByLeadId).toHaveBeenCalledWith(1); // Check if getContactsByLeadId is called with the correct lead ID
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockContacts);
    });

    it('should return 404 if no contacts are found for the lead', async () => {
      req.params.leadId = 1; // Mock the lead ID in params

      contactRepository.getContactsByLeadId.mockResolvedValue([]); // Mock no contacts found

      await getContactsByLeadId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No contacts found for this lead' });
    });

    it('should return 500 if an error occurs in getContactsByLeadId', async () => {
      const errorMessage = 'Database error';
      req.params.leadId = 1; // Mock the lead ID in params

      contactRepository.getContactsByLeadId.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await getContactsByLeadId(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });

  // Test case for updateContact
  describe('updateContact', () => {
    it('should update contact successfully', async () => {
      const mockUpdatedContact = { id: 1, name: 'John Doe Updated' };
      req.params.id = 1; // Mock the contact ID in params
      req.body = { name: 'John Doe Updated' }; // Mock the updated contact data

      contactRepository.updateContact.mockResolvedValue(mockUpdatedContact); // Mock the repository method

      await updateContact(req, res, next);

      expect(contactRepository.updateContact).toHaveBeenCalledWith(1, { name: 'John Doe Updated' }, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedContact);
    });

    it('should return 404 if contact not found during update', async () => {
      req.params.id = 1; // Mock the contact ID in params
      req.body = { name: 'John Doe Updated' }; // Mock the updated contact data

      contactRepository.updateContact.mockResolvedValue(null); // Mock contact not found

      await updateContact(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Contact not found' });
    });

    it('should return 500 if an error occurs in updateContact', async () => {
      const errorMessage = 'Database error';
      req.params.id = 1; // Mock the contact ID in params
      req.body = { name: 'John Doe Updated' }; // Mock the updated contact data

      contactRepository.updateContact.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await updateContact(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });

  // Test case for deleteContact
  describe('deleteContact', () => {
    it('should delete contact successfully', async () => {
      const mockDeletedContact = { id: 1, name: 'John Doe' };
      req.params.id = 1; // Mock the contact ID in params

      contactRepository.deleteContact.mockResolvedValue(mockDeletedContact); // Mock the repository method

      await deleteContact(req, res, next);

      expect(contactRepository.deleteContact).toHaveBeenCalledWith(1); // Check if deleteContact is called with the correct contact ID
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if contact not found during delete', async () => {
      req.params.id = 1; // Mock the contact ID in params

      contactRepository.deleteContact.mockResolvedValue(null); // Mock contact not found

      await deleteContact(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Contact not found' });
    });

    it('should return 500 if an error occurs in deleteContact', async () => {
      const errorMessage = 'Database error';
      req.params.id = 1; // Mock the contact ID in params

      contactRepository.deleteContact.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await deleteContact(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });
});
