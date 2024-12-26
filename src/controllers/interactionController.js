const interactionRepository = require('../repositories/InteractionRepository');

// Create a new interaction
exports.createInteraction = async (req, res, next) => {
  try {
    const { leadId, interactionType, interactionDate, notes } = req.body;
    const userId = req.user.id;
    const newInteraction = await interactionRepository.createInteraction({
      leadId,
      userId,
      interactionType,
      interactionDate,
      notes
    });
    res.status(201).json({ message: 'Interaction created', interaction: newInteraction });
  } catch (error) {
    next(error);
  }
};

// Get an interaction by its ID
exports.getInteractionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const interaction = await interactionRepository.getInteractionById(id);
    if (!interaction) {
      return res.status(404).json({ error: 'Interaction not found' });
    }
    res.status(200).json(interaction);
  } catch (error) {
    next(error);
  }
};

// Get all interactions for a lead
exports.getInteractionsByLeadId = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const interactions = await interactionRepository.getInteractionsByLeadId(leadId);
    res.status(200).json(interactions);
  } catch (error) {
    next(error);
  }
};

// Update an interaction by its ID
exports.updateInteraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const interactionData = req.body;
    const updatedInteraction = await interactionRepository.updateInteraction(id, interactionData);
    if (!updatedInteraction) {
      return res.status(404).json({ error: 'Interaction not found' });
    }
    res.status(200).json(updatedInteraction);
  } catch (error) {
    next(error);
  }
};

// Delete an interaction by its ID
exports.deleteInteraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedInteraction = await interactionRepository.deleteInteraction(id);
    if (!deletedInteraction) {
      return res.status(404).json({ error: 'Interaction not found' });
    }
    res.status(200).json(deletedInteraction);
  } catch (error) {
    next(error);
  }
};
