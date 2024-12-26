const Lead = require('../models/Lead');

class LeadRepository {
  // Get all leads with optional filters
  async getAll(filters = {}) {
    return Lead.findAll({ where: filters });
  }

  // Get a lead by ID
  async getById(id) {
    return Lead.findByPk(id);
  }

  // Create a new lead
  async create(leadData) {
    return Lead.create(leadData);
  }

  // Update a lead by ID
  async update(id, leadData) {
    const lead = await Lead.findByPk(id);
    if (!lead) throw new Error('Lead not found');
    return lead.update(leadData);
  }

  // Delete a lead
  async delete(id) {
    const lead = await Lead.findByPk(id);
    if (!lead) throw new Error('Lead not found');
    return lead.destroy();
  }

  async getLeadsRequiringCallsToday() {
    const today = new Date();
    return await Lead.findAll({
      where: {
        nextCallDate: {
          [Op.lte]: today
        }
      }
    });
  }

  async getWellPerformingAccounts() {
    return await Lead.findAll({
      where: {
        orderCount: {
          [Op.gte]: 10
        }
      }
    });
  }

  async getUnderperformingAccounts() {
    return await Lead.findAll({
      where: {
        orderCount: {
          [Op.lt]: 5
        }
      }
    });
  }

  async calculateAccountPerformanceMetrics() {
    const leads = await Lead.findAll();
    leads.forEach(async lead => {
      const daysSinceFirstOrder = (new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24);
      lead.performanceMetric = lead.orderCount / daysSinceFirstOrder;
      await lead.save();
    });
  }
}

module.exports = new LeadRepository();
