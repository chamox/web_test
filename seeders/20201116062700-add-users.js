'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users_array = [];

    users_array.push({
      userId: 1,
      username: 'Juan',
      email: 'j@uc.cl',
      password: '123123',
      admin: 'true',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    users_array.push({
      userId: 2,
      username: 'Javiera',
      email: 'javi@uc.cl',
      password: '123123',
      admin: 'false',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return queryInterface.bulkInsert('Users', users_array);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
