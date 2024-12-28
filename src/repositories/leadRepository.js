const db = require("../models");
const { Op } = db.Sequelize;

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
    return await lead.update(leadData);
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
            [Op.lte]: today,
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

  // Get well-performing accounts
  async getWellPerformingAccounts() {
    const thresholdAmount = parseFloat(process.env.THRESHOLD_AMOUNT) || 500; // Default to 500
    const thresholdDays = parseInt(process.env.THRESHOLD_DAYS) || 30; // Default to 30 days
    const frequencyThreshold = parseInt(process.env.FREQUENCY_THRESHOLD) || 3; // Default to 3 orders

    const thresholdDate = new Date(
      new Date() - thresholdDays * 24 * 60 * 60 * 1000
    ); // Days for performance tracking

    const leads = await db.Lead.findAll({
      include: [
        {
          model: db.Order,
          attributes: ["id", "orderDate", "amount"],
          where: {
            orderDate: {
              [Op.gte]: thresholdDate, // Orders in the last `thresholdDays` days
            },
          },
          required: true,
        },
      ],
      attributes: ["id", "restaurantName"],
    });

    return leads
      .map((lead) => {
        const totalOrderValue = lead.Orders.reduce(
          (sum, order) => sum + order.amount,
          0
        );
        return {
          id: lead.id,
          restaurantName: lead.restaurantName,
          totalOrderValue,
          orderCount: lead.Orders.length,
        };
      })
      .filter(
        (lead) =>
          lead.orderCount >= frequencyThreshold &&
          lead.totalOrderValue >= thresholdAmount
      ); // Filter based on frequency and total order value
  }

  // Get under-performing accounts
  async getUnderPerformingAccounts() {
    const thresholdAmount = parseFloat(process.env.THRESHOLD_AMOUNT) || 500; // Threshold amount for underperforming
    const underPerformingDays =
      parseInt(process.env.UNDERPERFORMING_DAYS) || 60; // Default to 60 days for underperforming leads
    const frequencyThreshold = parseInt(process.env.FREQUENCY_THRESHOLD) || 3; // Default to 3 orders

    const thresholdDate = new Date(
      new Date() - underPerformingDays * 24 * 60 * 60 * 1000
    ); // Orders before `underPerformingDays` days

    const leads = await db.Lead.findAll({
      include: [
        {
          model: db.Order,
          attributes: ["id", "orderDate", "amount"],
          where: {
            orderDate: {
              [Op.lte]: thresholdDate, // Orders before the last `underPerformingDays` days
            },
          },
          required: false, // Include leads with no orders as well
        },
      ],
      attributes: ["id", "restaurantName"],
    });

    return leads
      .map((lead) => {
        const totalOrderValue = lead.Orders.reduce(
          (sum, order) => sum + order.amount,
          0
        );
        return {
          id: lead.id,
          restaurantName: lead.restaurantName,
          totalOrderValue,
          orderCount: lead.Orders.length,
        };
      })
      .filter(
        (lead) =>
          lead.orderCount < frequencyThreshold ||
          lead.totalOrderValue < thresholdAmount
      ); // Leads with low frequency or total order value
  }

  // Fetch performance metrics for a specific lead
  async getLeadPerformanceMetrics(leadId) {
    const lead = await db.Lead.findByPk(leadId, {
      include: [
        {
          model: db.Order,
          attributes: ["id", "orderDate", "amount"],
        },
      ],
      attributes: ["id", "restaurantName"],
    });

    if (!lead) {
      throw new Error("Lead not found");
    }

    const totalOrderValue = lead.Orders.reduce(
      (sum, order) => sum + order.amount,
      0
    );
    const orderFrequency = lead.Orders.length;

    return {
      id: lead.id,
      restaurantName: lead.restaurantName,
      totalOrderValue,
      orderFrequency,
    };
  }

  async transferLeads(oldUserId, newUserId) {
    try {
      // Update the userId for all leads associated with the oldUserId
      const result = await db.Lead.update(
        { userId: newUserId },
        { where: { userId: oldUserId } }
      );

      return result;
    } catch (error) {
      throw new Error("Error transferring leads: " + error.message);
    }
  }
}

module.exports = new LeadRepository();
