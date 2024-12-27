const db = require("../models");

class LeadRepository {
  // Get all leads with optional filters
  async getAllLeads(filters = {}) {
    return db.Lead.findAll({ where: filters });
  }

  // Get a lead by ID
  async findLeadById(id) {
    return db.Lead.findByPk(id);
  }

  async validateLead(restaurantName, location) {
    const existingLead = await db.Lead.findOne({
      where: {
        restaurantName,
        location,
      },
    });
    if (existingLead) throw new Error("Lead already exists");
  }

  // Create a new lead
  async createLead(leadData) {
    return db.Lead.create(leadData);
  }

  // Update a lead by ID
  async updateLead(id, leadData) {
    const lead = await db.Lead.findByPk(id);
    if (!lead) throw new Error("Lead not found");
    return db.Lead.update(leadData);
  }

  // Delete a lead
  async deleteLead(id) {
    const lead = await db.Lead.findByPk(id);
    if (!lead) throw new Error("Lead not found");
    return db.Lead.destroy();
  }

  async getLeadsRequiringCalls() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const leads = await db.Lead.findAll({
        where: {
          nextCallDate: {
            [db.Sequelize.Op.lte]: today,
          },
        },
      });

      return leads;
    } catch (error) {
      throw new Error("Error fetching leads requiring calls: " + error.message);
    }
  }

  // Update last call date for a lead
  async recordCall(leadId) {
    try {
      const lead = await db.Lead.findByPk(leadId);
      if (!lead) {
        throw new Error("Lead not found");
      }

      const today = new Date();
      const nextCallDate = new Date();
      nextCallDate.setDate(today.getDate() + lead.callFrequency);

      await lead.update({ lastCallDate: today, nextCallDate });
      return lead;
    } catch (error) {
      throw new Error("Error recording call: " + error.message);
    }
  }

  // Update call frequency for a lead
  async updateCallFrequency(leadId, callFrequency) {
    try {
      const lead = await db.Lead.findByPk(leadId);
      if (!lead) {
        throw new Error("Lead not found");
      }

      const nextCallDate = new Date();
      nextCallDate.setDate(nextCallDate.getDate() + callFrequency);

      await lead.update({ callFrequency, nextCallDate });
      return lead;
    } catch (error) {
      throw new Error("Error updating call frequency: " + error.message);
    }
  }

  async getWellPerformingAccounts() {
    return await db.Lead.findAll({
      where: {
        orderCount: {
          [Op.gte]: 10,
        },
      },
    });
  }

  async getUnderperformingAccounts() {
    return await db.Lead.findAll({
      where: {
        orderCount: {
          [Op.lt]: 5,
        },
      },
    });
  }

  async calculateAccountPerformanceMetrics() {
    const leads = await db.Lead.findAll();
    leads.forEach(async (lead) => {
      const daysSinceFirstOrder =
        (new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24);
      lead.performanceMetric = lead.orderCount / daysSinceFirstOrder;
      await db.Lead.save();
    });
  }
}

module.exports = new LeadRepository();
