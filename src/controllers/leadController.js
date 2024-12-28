const leadRepository = require("../repositories/leadRepository");

// get all leads
exports.getLeads = async (req, res, next) => {
  try {
    const leads = await leadRepository.getAllLeads();
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

// get lead by id
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await leadRepository.findLeadById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

// add a new lead
exports.addLead = async (req, res, next) => {
  const { restaurantName, cuisineType, location, leadSource, leadStatus } =
    req.body;
  try {
    await leadRepository.validateLead(restaurantName, location);
    const lead = await leadRepository.createLead({
      restaurantName,
      cuisineType,
      location,
      leadSource,
      leadStatus,
    });
    res.status(201).json({ message: "Lead added successfully", lead });
  } catch (error) {
    next(error);
  }
};

// update a lead
exports.updateLead = async (req, res, next) => {
  try {
    const updatedLead = await leadRepository.updateLead(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedLead);
  } catch (error) {
    next(error);
  }
};

// delete a lead
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await leadRepository.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await leadRepository.deleteLead(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// get leads requiring calls
exports.getLeadsRequiringCalls = async (req, res, next) => {
  try {
    const leads = await leadRepository.getLeadsRequiringCalls();

    if (!leads || leads.length === 0) {
      return res.status(404).json({ error: "No leads requiring calls today" });
    }

    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

// record a call
exports.recordCall = async (req, res, next) => {
  try {
    const updatedLead = await leadRepository.recordCall(req.params.leadId);

    res.status(200).json({
      message: "Call recorded successfully",
      lead: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

// update call frequency
exports.updateCallFrequency = async (req, res, next) => {
  try {
    const { callFrequency } = req.body;

    if (!callFrequency) {
      return res.status(400).json({ error: "callFrequency are required" });
    }

    const updatedLead = await leadRepository.updateCallFrequency(
      req.params.leadId,
      callFrequency
    );

    res.status(200).json({
      message: "Call frequency updated successfully",
      lead: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

// get well performing accounts
exports.getWellPerformingAccounts = async (req, res, next) => {
  try {
    const leads = await leadRepository.getWellPerformingAccounts();
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

// get under performing accounts
exports.getUnderPerformingAccounts = async (req, res, next) => {
  try {
    const leads = await leadRepository.getUnderPerformingAccounts();
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

// get lead performance metrics
exports.getLeadPerformanceMetrics = async (req, res, next) => {
  try {
    const { id } = req.query;
    const performanceMetrics = await leadRepository.getLeadPerformanceMetrics(
      id
    );
    res.status(200).json(performanceMetrics);
  } catch (error) {
    next(error);
  }
};

// transfer leads
exports.transferLeads = async (req, res, next) => {
  try {
    const { oldUserId, newUserId } = req.body;

    const result = await leadRepository.transferLeads(oldUserId, newUserId);

    if (result[0] === 0) {
      return res
        .status(404)
        .json({ message: "No leads found for the specified oldUserId." });
    }

    return res.status(200).json({
      message: `Successfully transferred all leads from user ${oldUserId} to user ${newUserId}.`,
      updatedLeadsCount: result[0],
    });
  } catch (error) {
    next(error);
  }
};
