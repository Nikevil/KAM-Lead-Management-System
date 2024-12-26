const Interaction = require('../models/Interaction');
const Lead = require('../models/Lead');

// Get all interactions
exports.getInteractions = async (req, res, next) => {
  try {
    const interactions = await Interaction.findAll({ include: Lead });
    res.status(200).json(interactions);
  } catch (error) {
    next(error);
  }
};

// Create a new interaction
exports.createInteraction = async (req, res, next) => {
  try {
    const { leadId, date, type, notes } = req.body;
    const interaction = await Interaction.create({ leadId, date, type, notes });
    res.status(201).json(interaction);
  } catch (error) {
    next(error);
  }
};
