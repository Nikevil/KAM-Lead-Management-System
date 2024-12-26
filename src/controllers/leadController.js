// File: src/controllers/leadController.js
const leadRepository = require('../repositories/leadRepository');

exports.getLeads = async (req, res, next) => {
  try {
    const leads = await leadRepository.getAllLeads();
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await leadRepository.findLeadById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

exports.addLead = async (req, res, next) => {
  const { restaurantName, cuisineType, location, leadSource, leadStatus } = req.body;
  try {
    await leadRepository.validateLead(restaurantName, location);
    const lead = await leadRepository.createLead({
      restaurantName,
      cuisineType,
      location,
      leadSource,
      leadStatus,
    });
    res.status(201).json({ message: 'Lead added successfully', lead });
  } catch (error) {
    next(error);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const updatedLead = await leadRepository.updateLead(req.params.id, req.body);
    res.status(200).json(updatedLead);
  } catch (error) {
    next(error);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await leadRepository.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    await leadRepository.deleteLead(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.getLeadsRequiringCallsToday = async (req, res, next) => {
  try {
    const leads = await leadRepository.getLeadsRequiringCallsToday();
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

exports.getWellPerformingAccounts = async (req, res, next) => {
  try {
    const leads = await leadRepository.getWellPerformingAccounts();
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

exports.getUnderperformingAccounts = async (req, res, next) => {
  try {
    const leads = await leadRepository.getUnderperformingAccounts();
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

exports.calculateAccountPerformanceMetrics = async (req, res, next) => {
  try {
    await leadRepository.calculateAccountPerformanceMetrics();
    res.status(200).json({ message: 'Account performance metrics calculated successfully' });
  } catch (error) {
    next(error);
  }
};
