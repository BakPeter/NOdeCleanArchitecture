const Chance = require('chance');
const chance = new Chance();

const { cloneDeep } = require('lodash');

const {
  productsRepository,
} = require('../../../src/frameworks/repositories/inMemory');

const { Product } = require('../../../src/entities');

describe('Product repository', () => {
  test('New product should be added and returned', async () => {
    const testProduct = new Product({
      name: chance.name(),
      description: chance.sentence({ words: 5 }),
      price: chance.floating({ min: 0, max: 100 }),
      color: chance.color(),
      meta: {
        brand: {
          name: 'bamba',
          companyL: 'Osem',
        },
      },
    });

    const addeProduct = await productsRepository.add(testProduct);

    expect(addeProduct).toBeDefined();
    expect(addeProduct.id).toBeDefined();
    expect(addeProduct.name).toBe(testProduct.name);
    expect(addeProduct.lastName).toBe(testProduct.lastName);
    expect(addeProduct.gender).toBe(testProduct.gender);
    expect(addeProduct.meta).toEqual(testProduct.meta);

    let returnedProduct = await productsRepository.getById(addeProduct.id);
    expect(returnedProduct).toEqual(addeProduct);
    returnedProduct = await productsRepository.getById('fakeId');
    expect(returnedProduct).toEqual(undefined);
  });

  test('New product should be deleted', async () => {
    //init two users
    const willBeDeletedProduct = new Product({
      name: chance.name(),
      description: chance.sentence({ words: 5 }),
      price: chance.floating({ min: 0, max: 100 }),
      color: chance.color(),
      meta: {
        brand: {
          name: 'bamba',
          companyL: 'Osem',
        },
      },
    });

    const shouldStayProduct = new Product({
      name: chance.name(),
      description: chance.sentence({ words: 5 }),
      price: chance.floating({ min: 0, max: 100 }),
      color: chance.color(),
      meta: {
        brand: {
          name: 'bisli',
          companyL: 'Shtraus',
        },
      },
    });

    //add two users
    const [willBeDeletedAddedProduct, shouldStayAddedProduct] =
      await Promise.all([
        productsRepository.add(willBeDeletedProduct),
        productsRepository.add(shouldStayProduct),
      ]);

    expect(willBeDeletedAddedProduct).toBeDefined();
    expect(willBeDeletedAddedProduct).toEqual(willBeDeletedProduct);
    expect(shouldStayAddedProduct).toBeDefined();
    expect(shouldStayAddedProduct).toEqual(shouldStayProduct);

    //delete one user
    const deletedProduct = await productsRepository.delete(
      willBeDeletedAddedProduct
    );
    expect(deletedProduct).toEqual(willBeDeletedAddedProduct);

    //try to get the deleted user ( should be undifined )
    const shouldBeUndefinedProduct = await productsRepository.getById(
      deletedProduct.id
    );
    expect(shouldBeUndefinedProduct).toBeUndefined();

    //check the second user defined ( not deleted )
    const shouldBeDefinedProduct = await productsRepository.getById(
      shouldStayAddedProduct.id
    );
    expect(shouldBeDefinedProduct).toBeDefined();
  });

  test('New product should be updated', async () => {
    // add a user
    const testProduct = new Product({
      name: chance.name(),
      description: chance.sentence({ words: 5 }),
      price: chance.floating({ min: 0, max: 100 }),
      color: chance.color(),
      meta: {
        brand: {
          name: 'bisli',
          companyL: 'Shtraus',
        },
      },
    });

    //update a user

    const addedProduct = await productsRepository.add(testProduct);
    expect(addedProduct).toEqual(testProduct);

    const clonedProduct = cloneDeep({
      ...addedProduct,
      name: chance.name(),
      price: chance.floating({ min: 100, max: 1000 }),
    });

    const updatedProduct = await productsRepository.update(clonedProduct);
    expect(updatedProduct).toEqual(clonedProduct);
  });
});
