const { getLeads, getLeadById, addLead, updateLead, deleteLead, getLeadsRequiringCalls, recordCall, updateCallFrequency, getWellPerformingAccounts, getUnderPerformingAccounts, getLeadPerformanceMetrics, transferLeads } = require('../../../api/controllers/leadController');
const leadRepository = require('../../../api/repositories/leadRepository');

jest.mock('../../../api/repositories/leadRepository');

describe('Lead Controller', () => {

  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {}, user: { id: 1 } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis(), send: jest.fn().mockReturnThis() };
    next = jest.fn();
  });

  // Test for getLeads
  it('should return all leads successfully', async () => {
    const mockLeads = [{ id: 1, name: 'Lead 1' }];
    leadRepository.getAllLeads.mockResolvedValue(mockLeads);

    await getLeads(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLeads);
  });

  // Test for getLeadById
  it('should return lead by id successfully', async () => {
    const mockLead = { id: 1, name: 'Lead 1' };
    req.params.id = 1;
    leadRepository.findLeadById.mockResolvedValue(mockLead);

    await getLeadById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLead);
  });

  it('should return 404 if lead not found by id', async () => {
    req.params.id = 1;
    leadRepository.findLeadById.mockResolvedValue(null);

    await getLeadById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Lead not found' });
  });

  // Test for addLead
  it('should add a lead successfully', async () => {
    const leadData = { restaurantName: 'Restaurant 1', cuisineType: 'Indian', location: 'Location 1', leadSource: 'Web', leadStatus: 'New', kamId: 1 };
    req.body = leadData;
    leadRepository.validateLead.mockResolvedValue();
    const mockLead = { id: 1, ...leadData };
    leadRepository.createLead.mockResolvedValue(mockLead);

    await addLead(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Lead added successfully', lead: mockLead });
  });

  it('should return 400 if validation fails during addLead', async () => {
    const leadData = { restaurantName: 'Restaurant 1', cuisineType: 'Indian', location: 'Location 1', leadSource: 'Web', leadStatus: 'New', kamId: 1 };
    req.body = leadData;
    leadRepository.validateLead.mockRejectedValue(new Error('Lead already exists'));

    await addLead(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('Lead already exists'));
  });

  // Test for updateLead
  it('should update lead successfully', async () => {
    const updatedLeadData = { restaurantName: 'Updated Restaurant', cuisineType: 'Chinese' };
    req.params.id = 1;
    req.body = updatedLeadData;
    const updatedLead = { id: 1, ...updatedLeadData };
    leadRepository.updateLead.mockResolvedValue(updatedLead);

    await updateLead(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedLead);
  });


  
  it('should return 404 if user not found', async () => {
    req.params.id = 1;
    leadRepository.deleteLead.mockResolvedValue(null);
 
    await deleteLead(req, res, next);
 
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Lead not found' });
  });
 
  it('should delete the user successfully', async () => {
    // Mock request parameters
    req.params = { id: 1 };
       
    // Mock the repository function to resolve with a user object
    leadRepository.deleteLead.mockResolvedValue({ id: 1, destroy: jest.fn() });
       
    // Mock response object
    const res = {
      status: jest.fn().mockReturnThis(),  // Mock chainable status function
      json: jest.fn(),  // Mock json function
    };
       
    // Call the controller function
    await deleteLead(req, res, next);
       
    // Assertions
    expect(res.status).toHaveBeenCalledWith(204);
  });
  
  

  // Test for getLeadsRequiringCalls
  it('should return leads requiring calls successfully', async () => {
    const mockLeads = [{ id: 1, name: 'Lead 1' }];
    leadRepository.getLeadsRequiringCalls.mockResolvedValue(mockLeads);

    await getLeadsRequiringCalls(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLeads);
  });

  it('should return 404 if no leads requiring calls', async () => {
    leadRepository.getLeadsRequiringCalls.mockResolvedValue([]);

    await getLeadsRequiringCalls(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'No leads requiring calls today' });
  });

  // Test for recordCall
  it('should record a call successfully', async () => {
    req.params.leadId = 1;
    const mockUpdatedLead = { id: 1, name: 'Lead 1', callStatus: 'Completed' };
    leadRepository.recordCall.mockResolvedValue(mockUpdatedLead);

    await recordCall(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Call recorded successfully',
      lead: mockUpdatedLead,
    });
  });

  // Test for updateCallFrequency
  it('should update call frequency successfully', async () => {
    req.params.leadId = 1;
    req.body = { callFrequency: 'Weekly' };
    const mockUpdatedLead = { id: 1, name: 'Lead 1', callFrequency: 'Weekly' };
    leadRepository.updateCallFrequency.mockResolvedValue(mockUpdatedLead);

    await updateCallFrequency(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Call frequency updated successfully',
      lead: mockUpdatedLead,
    });
  });

  it('should return 400 if callFrequency is not provided', async () => {
    req.params.leadId = 1;
    req.body = {}; // Missing callFrequency

    await updateCallFrequency(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'callFrequency are required' });
  });

  // Test for getWellPerformingAccounts
  it('should return well-performing accounts successfully', async () => {
    const mockLeads = [{ id: 1, name: 'Lead 1' }];
    leadRepository.getWellPerformingAccounts.mockResolvedValue(mockLeads);

    await getWellPerformingAccounts(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLeads);
  });

  // Test for getUnderPerformingAccounts
  it('should return under-performing accounts successfully', async () => {
    const mockLeads = [{ id: 1, name: 'Lead 1' }];
    leadRepository.getUnderPerformingAccounts.mockResolvedValue(mockLeads);

    await getUnderPerformingAccounts(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLeads);
  });

  // Test for getLeadPerformanceMetrics
  it('should return lead performance metrics successfully', async () => {
    const mockMetrics = { performance: 'high' };
    req.query.id = 1;
    leadRepository.getLeadPerformanceMetrics.mockResolvedValue(mockMetrics);

    await getLeadPerformanceMetrics(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockMetrics);
  });

  // Test for transferLeads
  it('should transfer leads successfully', async () => {
    req.body = { oldUserId: 1, newUserId: 2 };
    leadRepository.transferLeads.mockResolvedValue([1]);

    await transferLeads(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Successfully transferred all leads from user 1 to user 2.',
      updatedLeadsCount: 1,
    });
  });

  it('should return 404 if no leads found during transfer', async () => {
    req.body = { oldUserId: 1, newUserId: 2 };
    leadRepository.transferLeads.mockResolvedValue([0]);

    await transferLeads(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No leads found for the specified oldUserId.',
    });
  });

});
