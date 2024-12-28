const db = require("../models");

class InteractionRepository {
  // Create a new interaction
  async createInteraction(interactionData) {
    try {
      const newInteraction = await db.Interaction.create(interactionData);
      return newInteraction;
    } catch (error) {
      throw new Error("Error creating interaction: " + error.message);
    }
  }

  // Get an interaction by its ID
  async getInteractionById(id) {
    try {
      const interaction = await db.Interaction.findByPk(id);
      return interaction;
    } catch (error) {
      throw new Error("Error fetching interaction: " + error.message);
    }
  }

  // Get all interactions for a lead
  async getInteractionsByLeadId(leadId) {
    try {
      const lead = await db.Lead.findByPk(leadId);
      if (!lead) {
        throw new Error("Lead not found");
      }
      const interactions = await db.Interaction.findAll({
        where: { leadId },
      });
      return interactions;
    } catch (error) {
      throw new Error(
        "Error fetching interactions by lead ID: " + error.message
      );
    }
  }

  // Update an interaction by its ID
  async updateInteraction(id, interactionData) {
    try {
      const interaction = await db.Interaction.findByPk(id);
      if (!interaction) {
        throw new Error("Interaction not found");
      }
      await interaction.update(interactionData);
      return interaction;
    } catch (error) {
      throw new Error("Error updating interaction: " + error.message);
    }
  }

  // Delete an interaction by its ID
  async deleteInteraction(id) {
    try {
      const interaction = await db.Interaction.findByPk(id);
      if (!interaction) {
        throw new Error("Interaction not found");
      }
      await interaction.destroy(); // Delete the interaction from the database
      return interaction;
    } catch (error) {
      throw new Error("Error deleting interaction: " + error.message);
    }
  }
}

module.exports = new InteractionRepository();
