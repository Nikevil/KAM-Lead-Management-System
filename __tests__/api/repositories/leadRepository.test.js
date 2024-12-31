const leadRepository = require('../../../api/repositories/leadRepository');
const db = require('../../../api/models');
const { Op } = db.Sequelize;

jest.mock('../../../api/models');

describe('LeadRepository', () => {
  beforeEach(() => {
    db.Lead.create.mockReset();
    db.Lead.findAll.mockReset();
    db.Lead.findByPk.mockReset();
    db.Lead.update.mockReset();
    db.Lead.destroy.mockReset();
    db.Lead.findOne.mockReset();
    db.Lead.update.mockReset();
    db.Order.findAll.mockReset();
  });

  describe('getAllLeads', () => {
    it('should return all leads with filters applied', async () => {
      const mockLeads = [{ id: 1, restaurantName: 'Restaurant 1' }];
      db.Lead.findAll.mockResolvedValue(mockLeads);

      const result = await leadRepository.getAllLeads({ restaurantName: 'Restaurant 1' });

      expect(db.Lead.findAll).toHaveBeenCalledWith({ where: { restaurantName: 'Restaurant 1' } });
      expect(result).toEqual(mockLeads);
    });

    it('should return all leads when no filters are provided', async () => {
      const mockLeads = [{ id: 1, restaurantName: 'Restaurant 1' }];
      db.Lead.findAll.mockResolvedValue(mockLeads);

      const result = await leadRepository.getAllLeads();

      expect(db.Lead.findAll).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual(mockLeads);
    });
  });

  describe('findLeadById', () => {
    it('should return a lead by ID', async () => {
      const mockLead = { id: 1, restaurantName: 'Restaurant 1' };
      db.Lead.findByPk.mockResolvedValue(mockLead);

      const result = await leadRepository.findLeadById(1);

      expect(db.Lead.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockLead);
    });

    it('should return null if lead is not found', async () => {
      db.Lead.findByPk.mockResolvedValue(null);

      const result = await leadRepository.findLeadById(999);

      expect(db.Lead.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('validateLead', () => {
    it('should throw an error if the lead already exists', async () => {
      db.Lead.findOne.mockResolvedValue({});

      await expect(leadRepository.validateLead('Restaurant 1', 'Location 1'))
        .rejects
        .toThrow('Lead already exists');
    });

    it('should not throw an error if the lead does not exist', async () => {
      db.Lead.findOne.mockResolvedValue(null);

      await expect(leadRepository.validateLead('Restaurant 1', 'Location 1'))
        .resolves
        .not
        .toThrow();
    });
  });

  describe('createLead', () => {
    it('should create a new lead', async () => {
      const mockLead = { id: 1, restaurantName: 'Restaurant 1' };
      db.Lead.create.mockResolvedValue(mockLead);

      const result = await leadRepository.createLead({ restaurantName: 'Restaurant 1' }, 1);

      expect(db.Lead.create).toHaveBeenCalledWith({
        restaurantName: 'Restaurant 1',
        createdBy: 1,
        updatedBy: 1,
      });
      expect(result).toEqual(mockLead);
    });
  });

  describe('updateLead', () => {
    it('should update the lead successfully', async () => {
      const mockLead = { id: 1, restaurantName: 'Restaurant 1' };
      db.Lead.findByPk.mockResolvedValue(mockLead);
      mockLead.update = jest.fn().mockResolvedValue(mockLead);

      const result = await leadRepository.updateLead(1, { restaurantName: 'Updated Restaurant' }, 2);

      expect(db.Lead.findByPk).toHaveBeenCalledWith(1);
      expect(mockLead.update).toHaveBeenCalledWith({
        restaurantName: 'Updated Restaurant',
        updatedBy: 2,
      });
      expect(result).toEqual(mockLead);
    });

    it('should throw an error if the lead is not found', async () => {
      db.Lead.findByPk.mockResolvedValue(null);

      await expect(leadRepository.updateLead(999, { restaurantName: 'Updated Restaurant' }, 2))
        .rejects
        .toThrow('Lead not found');
    });
  });

  describe('deleteLead', () => {
    it('should delete a lead successfully', async () => {
      const mockLead = { id: 1, restaurantName: 'Restaurant 1' };
      db.Lead.findByPk.mockResolvedValue(mockLead);
      mockLead.destroy = jest.fn().mockResolvedValue(true);

      const result = await leadRepository.deleteLead(1);

      expect(db.Lead.findByPk).toHaveBeenCalledWith(1);
      expect(mockLead.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return null if the lead is not found', async () => {
      db.Lead.findByPk.mockResolvedValue(null);

      const result = await leadRepository.deleteLead(999);

      expect(db.Lead.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('getLeadsRequiringCalls', () => {
    it('should return leads requiring calls', async () => {
      const mockLeads = [{ id: 1, nextCallDate: new Date() }];
      db.Lead.findAll.mockResolvedValue(mockLeads);

      const result = await leadRepository.getLeadsRequiringCalls();

      expect(db.Lead.findAll).toHaveBeenCalledWith({
        where: {
          nextCallDate: {
            [Op.lte]: expect.any(Date),
          },
        },
      });
      expect(result).toEqual(mockLeads);
    });

    it('should throw an error if fetching leads requires calls fails', async () => {
      db.Lead.findAll.mockRejectedValue(new Error('Database error'));

      await expect(leadRepository.getLeadsRequiringCalls())
        .rejects
        .toThrow('Error fetching leads requiring calls: Database error');
    });
  });

  describe('recordCall', () => {
    it('should record a call and update the lead', async () => {
      const mockLead = { id: 1, callFrequency: 5 };
      db.Lead.findByPk.mockResolvedValue(mockLead);
      mockLead.update = jest.fn().mockResolvedValue(mockLead);

      const result = await leadRepository.recordCall(1, 2);

      expect(db.Lead.findByPk).toHaveBeenCalledWith(1);
      expect(mockLead.update).toHaveBeenCalledWith({
        lastCallDate: expect.any(Date),
        nextCallDate: expect.any(Date),
        updatedBy: 2,
      });
      expect(result).toEqual(mockLead);
    });

    it('should throw an error if the lead is not found', async () => {
      db.Lead.findByPk.mockResolvedValue(null);

      await expect(leadRepository.recordCall(999, 2))
        .rejects
        .toThrow('Lead not found');
    });
  });

  describe('updateCallFrequency', () => {
    it('should update the call frequency and next call date', async () => {
      const mockLead = { id: 1, callFrequency: 5 };
      db.Lead.findByPk.mockResolvedValue(mockLead);
      mockLead.update = jest.fn().mockResolvedValue(mockLead);

      const result = await leadRepository.updateCallFrequency(1, 10, 2);

      expect(db.Lead.findByPk).toHaveBeenCalledWith(1);
      expect(mockLead.update).toHaveBeenCalledWith({
        callFrequency: 10,
        nextCallDate: expect.any(Date),
        updatedBy: 2,
      });
      expect(result).toEqual(mockLead);
    });

    it('should throw an error if the lead is not found', async () => {
      db.Lead.findByPk.mockResolvedValue(null);

      await expect(leadRepository.updateCallFrequency(999, 10, 2))
        .rejects
        .toThrow('Lead not found');
    });
  });

  describe('getWellPerformingAccounts', () => {
    it('should return well-performing accounts', async () => {
      const mockLeads = [
        {
          id: 1,
          restaurantName: 'High Performer',
          Orders: [
            { id: 101, orderDate: new Date(), amount: 300 },
            { id: 102, orderDate: new Date(), amount: 250 },
          ],
        },
      ];
  
      // Mock `findAll` to return the expected result
      db.Lead.findAll.mockResolvedValue(mockLeads);
  
      const result = await leadRepository.getWellPerformingAccounts();
  
      expect(result).toEqual([
        {
          id: 1,
          restaurantName: 'High Performer',
          totalOrderValue: 550,
          orderCount: 2,
        },
      ]);
  
      // Ensure the mock was called with the correct include and filter conditions
      expect(db.Lead.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: db.Order,
            attributes: ['id', 'orderDate', 'amount'],
            where: {
              orderDate: {
                [Op.gte]: expect.any(Date), // Date threshold
              },
            },
            required: true,
          },
        ],
        attributes: ['id', 'restaurantName'],
      });
    });
  });

  describe('getUnderPerformingAccounts', () => {
    it('should return under-performing accounts', async () => {
      const mockLeads = [
        {
          id: 1,
          restaurantName: 'Under Performer',
          Orders: [
            { id: 101, orderDate: new Date(), amount: 200 },
            { id: 102, orderDate: new Date(), amount: 100 },
          ],
        },
      ];
  
      // Mock `findAll` to return the expected result
      db.Lead.findAll.mockResolvedValue(mockLeads);
  
      const result = await leadRepository.getUnderPerformingAccounts();
  
      expect(result).toEqual([
        {
          id: 1,
          restaurantName: 'Under Performer',
          totalOrderValue: 300,
          orderCount: 2,
        },
      ]);
  
      // Ensure the mock was called with the correct include and filter conditions
      expect(db.Lead.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: db.Order,
            attributes: ['id', 'orderDate', 'amount'],
            where: {
              orderDate: {
                [Op.lte]: expect.any(Date), // Date threshold
              },
            },
            required: false, // Include leads with no orders as well
          },
        ],
        attributes: ['id', 'restaurantName'],
      });
    });
  });  

  describe('getLeadPerformanceMetrics', () => {
    it('should return performance metrics for a lead', async () => {
      const mockLead = { id: 1, restaurantName: 'Restaurant 1', Orders: [{ amount: 600 }] };
      db.Lead.findByPk.mockResolvedValue(mockLead);

      const result = await leadRepository.getLeadPerformanceMetrics(1);

      expect(db.Lead.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: db.Order, attributes: ['id', 'orderDate', 'amount'] }],
        attributes: ['id', 'restaurantName'],
      });
      expect(result).toEqual({ id: 1, restaurantName: 'Restaurant 1', totalOrderValue: 600, orderFrequency: 1 });
    });

    it('should throw an error if the lead is not found', async () => {
      db.Lead.findByPk.mockResolvedValue(null);

      await expect(leadRepository.getLeadPerformanceMetrics(999))
        .rejects
        .toThrow('Lead not found');
    });
  });

  describe('transferLeads', () => {
    it('should transfer leads to a new user', async () => {
      db.Lead.update.mockResolvedValue([1]);

      const result = await leadRepository.transferLeads(1, 2, 3);

      expect(db.Lead.update).toHaveBeenCalledWith(
        { userId: 2, updatedById: 3 },
        { where: { userId: 1 } },
      );
      expect(result).toEqual([1]);
    });

    it('should throw an error if the transfer fails', async () => {
      db.Lead.update.mockRejectedValue(new Error('Error transferring leads'));

      await expect(leadRepository.transferLeads(1, 2, 3))
        .rejects
        .toThrow('Error transferring leads: Error transferring leads');
    });
  });
});
