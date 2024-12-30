const { addInteraction, getInteractionById, getInteractionsByLeadId, updateInteraction, deleteInteraction } = require('../../../api/controllers/interactionController');
const interactionRepository = require('../../../api/repositories/interactionRepository');

jest.mock('../../../api/repositories/interactionRepository'); // Mock the interactionRepository

describe('Interaction Controller', () => {
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

  // Test case for addInteraction
  describe('addInteraction', () => {
    it('should create a new interaction successfully', async () => {
      const mockInteraction = { id: 1, type: 'Call', details: 'Details of interaction' };
      req.body = { type: 'Call', details: 'Details of interaction' };

      interactionRepository.createInteraction.mockResolvedValue(mockInteraction); // Mock the repository method

      await addInteraction(req, res, next);

      expect(interactionRepository.createInteraction).toHaveBeenCalledWith(
        { type: 'Call', details: 'Details of interaction' },
        1,
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Interaction created', interaction: mockInteraction });
    });

    it('should return 500 if an error occurs in addInteraction', async () => {
      const errorMessage = 'Database error';
      req.body = { type: 'Call', details: 'Details of interaction' };

      interactionRepository.createInteraction.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await addInteraction(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });

  // Test case for getInteractionById
  describe('getInteractionById', () => {
    it('should return 200 and the interaction when interaction is found', async () => {
      const mockInteraction = { id: 1, type: 'Call', details: 'Details of interaction' };
      req.params.id = 1; // Mock the interaction ID in params

      interactionRepository.getInteractionById.mockResolvedValue(mockInteraction); // Mock the repository method

      await getInteractionById(req, res, next);

      expect(interactionRepository.getInteractionById).toHaveBeenCalledWith(1); // Check if getInteractionById is called with the correct ID
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInteraction);
    });

    it('should return 404 if interaction not found', async () => {
      req.params.id = 1; // Mock the interaction ID in params

      interactionRepository.getInteractionById.mockResolvedValue(null); // Mock interaction not found

      await getInteractionById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Interaction not found' });
    });

    it('should return 500 if an error occurs in getInteractionById', async () => {
      const errorMessage = 'Database error';
      req.params.id = 1; // Mock the interaction ID in params

      interactionRepository.getInteractionById.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await getInteractionById(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });

  // Test case for getInteractionsByLeadId
  describe('getInteractionsByLeadId', () => {
    it('should return 200 and interactions for the lead', async () => {
      const mockInteractions = [
        { id: 1, type: 'Call', details: 'Details of interaction' },
        { id: 2, type: 'Email', details: 'Details of interaction' },
      ];
      req.params.leadId = 1; // Mock the lead ID in params

      interactionRepository.getInteractionsByLeadId.mockResolvedValue(mockInteractions); // Mock the repository method

      await getInteractionsByLeadId(req, res, next);

      expect(interactionRepository.getInteractionsByLeadId).toHaveBeenCalledWith(1); // Check if getInteractionsByLeadId is called with the correct lead ID
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockInteractions);
    });

    it('should return 500 if an error occurs in getInteractionsByLeadId', async () => {
      const errorMessage = 'Database error';
      req.params.leadId = 1; // Mock the lead ID in params

      interactionRepository.getInteractionsByLeadId.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await getInteractionsByLeadId(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });

  // Test case for updateInteraction
  describe('updateInteraction', () => {
    it('should update interaction successfully', async () => {
      const mockUpdatedInteraction = { id: 1, type: 'Call', details: 'Updated details' };
      req.params.id = 1; // Mock the interaction ID in params
      req.body = { type: 'Call', details: 'Updated details' }; // Mock the updated interaction data

      interactionRepository.updateInteraction.mockResolvedValue(mockUpdatedInteraction); // Mock the repository method

      await updateInteraction(req, res, next);

      expect(interactionRepository.updateInteraction).toHaveBeenCalledWith(1, { type: 'Call', details: 'Updated details' }, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Interaction updated',
        interaction: mockUpdatedInteraction,
      });
    });

    it('should return 404 if interaction not found during update', async () => {
      req.params.id = 1; // Mock the interaction ID in params
      req.body = { type: 'Call', details: 'Updated details' }; // Mock the updated interaction data

      interactionRepository.updateInteraction.mockResolvedValue(null); // Mock interaction not found

      await updateInteraction(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Interaction not found' });
    });

    it('should return 500 if an error occurs in updateInteraction', async () => {
      const errorMessage = 'Database error';
      req.params.id = 1; // Mock the interaction ID in params
      req.body = { type: 'Call', details: 'Updated details' }; // Mock the updated interaction data

      interactionRepository.updateInteraction.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await updateInteraction(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });

  // Test case for deleteInteraction
  describe('deleteInteraction', () => {
    it('should delete interaction successfully', async () => {
      const mockDeletedInteraction = { id: 1, type: 'Call', details: 'Details of interaction' };
      req.params.id = 1; // Mock the interaction ID in params

      interactionRepository.deleteInteraction.mockResolvedValue(mockDeletedInteraction); // Mock the repository method

      await deleteInteraction(req, res, next);

      expect(interactionRepository.deleteInteraction).toHaveBeenCalledWith(1); // Check if deleteInteraction is called with the correct interaction ID
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedInteraction);
    });

    it('should return 404 if interaction not found during delete', async () => {
      req.params.id = 1; // Mock the interaction ID in params

      interactionRepository.deleteInteraction.mockResolvedValue(null); // Mock interaction not found

      await deleteInteraction(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Interaction not found' });
    });

    it('should return 500 if an error occurs in deleteInteraction', async () => {
      const errorMessage = 'Database error';
      req.params.id = 1; // Mock the interaction ID in params

      interactionRepository.deleteInteraction.mockRejectedValue(new Error(errorMessage)); // Mock error in repository method

      await deleteInteraction(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error(errorMessage)); // Check if error is passed to the next middleware
    });
  });
});
