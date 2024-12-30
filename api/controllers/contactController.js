const contactRepository = require('../repositories/contactRepository');

exports.addContactsToLead = async (req, res, next) => {
  const { leadId, contacts } = req.body;
  const userId = req.user.id;
  try {
    const contactResponses = await contactRepository.addContactsToLead({
      leadId,
      contacts,
    }, userId);

    res
      .status(201)
      .json({ message: 'Contacts created', contacts: contactResponses });
  } catch (error) {
    next(error);
  }
};

// Get a contact by ID
exports.getContactById = async (req, res, next) => {
  try {
    const contact = await contactRepository.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

// Get contacts by Lead ID
exports.getContactsByLeadId = async (req, res, next) => {
  try {
    const contacts = await contactRepository.getContactsByLeadId(
      req.params.leadId,
    );
    if (contacts.length === 0) {
      return res
        .status(404)
        .json({ message: 'No contacts found for this lead' });
    }
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

// Update a contact by ID
exports.updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updatedContact = await contactRepository.updateContact(
      req.params.id,
      req.body,
      userId,
    );
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

// Delete a contact by ID
exports.deleteContact = async (req, res, next) => {
  try {
    const deletedContact = await contactRepository.deleteContact(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
