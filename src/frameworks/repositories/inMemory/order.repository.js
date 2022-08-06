const { inMemory: inMemeoryDb } = require('../../database/inMemory');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  getById: async (id) => inMemeoryDb.orders.find((item) => item.id === id),

  update: async (order) => {
    const index = inMemeoryDb.orders.findIndex((item) => item.id === order.id);
    if (index >= 0) {
      inMemeoryDb.orders[index] = order;
      return order;
    }
    return null;
  },

  delete: async (order) => {
    const index = inMemeoryDb.orders.findIndex((item) => item.id === order.id);
    if (index >= 0) {
      inMemeoryDb.orders.splice(index, 1);
      return order;
    }
    return null;
  },

  add: async (order) => {
    if (!order.id) order.id = uuidv4();
    inMemeoryDb.orders.push(order);
    return order;
  },
};
