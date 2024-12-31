const interactionRepository = require('../../../api/repositories/interactionRepository');
const db = require('../../../api/models');

jest.mock('../../../api/models', () => ({
  Interaction: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  Lead: {
    findByPk: jest.fn(),
  },
}));

describe('InteractionRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createInteraction', () => {
    it('should create a new interaction', async () => {
      const mockInteraction = { id: 1, description: 'Test Interaction' };
      db.Interaction.create.mockResolvedValue(mockInteraction);

      const result = await interactionRepository.createInteraction(
        { description: 'Test Interaction', leadId: 1 },
        42,
      );

      expect(result).toEqual(mockInteraction);
      expect(db.Interaction.create).toHaveBeenCalledWith({
        description: 'Test Interaction',
        leadId: 1,
        createdBy: 42,
        updatedBy: 42,
      });
    });

    it('should throw an error if creation fails', async () => {
      db.Interaction.create.mockRejectedValue(new Error('Database error'));

      await expect(
        interactionRepository.createInteraction({ description: 'Test' }, 42),
      ).rejects.toThrow('Error creating interaction: Database error');
    });
  });

  describe('getInteractionById', () => {
    it('should return an interaction by ID', async () => {
      const mockInteraction = { id: 1, description: 'Test Interaction' };
      db.Interaction.findByPk.mockResolvedValue(mockInteraction);

      const result = await interactionRepository.getInteractionById(1);

      expect(result).toEqual(mockInteraction);
      expect(db.Interaction.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw an error if fetching fails', async () => {
      db.Interaction.findByPk.mockRejectedValue(new Error('Database error'));

      await expect(
        interactionRepository.getInteractionById(1),
      ).rejects.toThrow('Error fetching interaction: Database error');
    });
  });

  describe('getInteractionsByLeadId', () => {
    it('should return interactions for a given lead ID', async () => {
      const mockLead = { id: 1 };
      const mockInteractions = [{ id: 1, description: 'Test Interaction' }];

      db.Lead.findByPk.mockResolvedValue(mockLead);
      db.Interaction.findAll.mockResolvedValue(mockInteractions);

      const result = await interactionRepository.getInteractionsByLeadId(1);

      expect(result).toEqual(mockInteractions);
      expect(db.Interaction.findAll).toHaveBeenCalledWith({ where: { leadId: 1 } });
    });

    it('should throw an error if lead not found', async () => {
      db.Lead.findByPk.mockResolvedValue(null);

      await expect(
        interactionRepository.getInteractionsByLeadId(1),
      ).rejects.toThrow('Lead not found');
    });

    it('should throw an error if fetching interactions fails', async () => {
      db.Lead.findByPk.mockResolvedValue({ id: 1 });
      db.Interaction.findAll.mockRejectedValue(new Error('Database error'));

      await expect(
        interactionRepository.getInteractionsByLeadId(1),
      ).rejects.toThrow('Error fetching interactions by lead ID: Database error');
    });
  });

  describe('updateInteraction', () => {
    it('should update and return the interaction', async () => {
      const mockInteraction = {
        id: 1,
        update: jest.fn().mockResolvedValue(true),
      };
      db.Interaction.findByPk.mockResolvedValue(mockInteraction);

      const updates = { description: 'Updated Interaction' };
      const result = await interactionRepository.updateInteraction(1, updates, 42);

      expect(mockInteraction.update).toHaveBeenCalledWith({
        ...updates,
        updatedBy: 42,
      });
      expect(result).toEqual(mockInteraction);
    });

    it('should throw an error if interaction not found', async () => {
      db.Interaction.findByPk.mockResolvedValue(null);

      await expect(
        interactionRepository.updateInteraction(1, {}, 42),
      ).rejects.toThrow('Interaction not found');
    });

    it('should throw an error if update fails', async () => {
      db.Interaction.findByPk.mockResolvedValue({
        id: 1,
        update: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(
        interactionRepository.updateInteraction(1, {}, 42),
      ).rejects.toThrow('Error updating interaction: Database error');
    });
  });

  describe('deleteInteraction', () => {
    it('should delete and return the interaction', async () => {
      const mockInteraction = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      db.Interaction.findByPk.mockResolvedValue(mockInteraction);

      const result = await interactionRepository.deleteInteraction(1);

      expect(mockInteraction.destroy).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it('should return null if interaction not found', async () => {
      db.Interaction.findByPk.mockResolvedValue(null);

      const result = await interactionRepository.deleteInteraction(1);
      expect(result).toBeNull();
    });

    it('should throw an error if deletion fails', async () => {
      db.Interaction.findByPk.mockResolvedValue({
        id: 1,
        destroy: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(
        interactionRepository.deleteInteraction(1),
      ).rejects.toThrow('Error deleting interaction: Database error');
    });
  });
});
