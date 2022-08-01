const Chance = require('chance');
const chance = new Chance();

const { cloneDeep } = require('lodash');

const {
  usersRepository,
} = require('../../../src/frameworks/repositories/inMemory');

const {
  User,
  constants: {
    userConstants: { genders },
  },
} = require('../../../src/entities');

describe('User repository', () => {
  test('New user should be added and returned', async () => {
    const testUser = new User({
      name: chance.name(),
      lastName: chance.last(),
      gender: genders.FEMALE,
      meta: {
        hair: {
          color: 'black',
        },
      },
    });

    const addedUser = await usersRepository.add(testUser);

    expect(addedUser).toBeDefined();
    expect(addedUser.id).toBeDefined();
    expect(addedUser.name).toBe(testUser.name);
    expect(addedUser.lastName).toBe(testUser.lastName);
    // expect(addedUser.lastName).toBe('lastName');
    expect(addedUser.gender).toBe(testUser.gender);
    // expect(addedUser.gender).toBe(genders.MALE);
    expect(addedUser.meta).toEqual(testUser.meta);

    let returnedUser = await usersRepository.getById(addedUser.id);
    expect(returnedUser).toEqual(addedUser);
    returnedUser = await usersRepository.getById('fakeId');
    expect(returnedUser).toEqual(undefined);
  });

  test('New user should be deleted', async () => {
    //init two users
    const willBeDeletedUser = new User({
      name: chance.name(),
      lastName: chance.last(),
      gender: genders.FEMALE,
      meta: {
        hair: {
          color: 'black',
        },
      },
    });

    const shouldStayUser = new User({
      name: chance.name(),
      lastName: chance.last(),
      gender: genders.FEMALE,
      meta: {
        hair: {
          color: 'blonde',
        },
      },
    });

    //add two users
    const [willBeDeletedAddedUser, shouldStayAddedUser] = await Promise.all([
      usersRepository.add(willBeDeletedUser),
      usersRepository.add(shouldStayUser),
    ]);

    expect(willBeDeletedAddedUser).toBeDefined();
    expect(willBeDeletedAddedUser).toEqual(willBeDeletedUser);
    expect(shouldStayAddedUser).toBeDefined();
    expect(shouldStayAddedUser).toEqual(shouldStayUser);

    //delete one user
    const deletedUser = await usersRepository.delete(willBeDeletedAddedUser);
    expect(deletedUser).toEqual(willBeDeletedAddedUser);

    //try to get the deleted user ( should be undifined )
    const shouldBeUndefinedUser = await usersRepository.getById(deletedUser.id);
    expect(shouldBeUndefinedUser).toBeUndefined();

    //check the second user defined ( not deleted )
    const shouldBeDefinedUser = await usersRepository.getById(
      shouldStayAddedUser.id
    );
    expect(shouldBeDefinedUser).toBeDefined();
  });

  test('New user should be updated', async () => {
    // add a user
    const testUser = new User({
      name: chance.name(),
      lastName: chance.last(),
      gender: genders.FEMALE,
      meta: {
        hair: {
          color: 'black',
        },
      },
    });

    //update a user

    const addedUser = await usersRepository.add(testUser);
    expect(addedUser).toEqual(testUser);

    const clonedUser = cloneDeep({
      ...addedUser,
      name: chance.name(),
      gender: genders.MALE,
    });

    const updatedUser = await usersRepository.update(clonedUser);
    expect(updatedUser).toEqual(clonedUser);
  });
});
