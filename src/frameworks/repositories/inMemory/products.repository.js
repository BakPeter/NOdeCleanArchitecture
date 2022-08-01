const { inMemory: inMemeoryDb } = require('../../database/inMemory');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  getById: async (id) => inMemeoryDb.products.find((item) => item.id === id),

  update: async (product) => {
    const index = inMemeoryDb.products.findIndex(
      (item) => item.id === product.id
    );
    if (index >= 0) {
      inMemeoryDb.products[index] = product;
      return product;
    }
    return null;
  },

  delete: async (product) => {
    const index = inMemeoryDb.products.findIndex(
      (item) => item.id === product.id
    );
    if (index >= 0) {
      inMemeoryDb.products.splice(index, 1);
      return product;
    }
    return null;
  },

  add: async (product) => {
    if (!product.id) product.id = uuidv4();
    inMemeoryDb.products.push(product);
    return product;
  },
};
