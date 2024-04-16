/**
 * Seed script to insert initial categories into the database.
 *
 * @module seeders/insert-categories
 */

/**
 * Inserts the initial categories into the database.
 *
 * @async
 * @function up
 * @param {Object} queryInterface - The Sequelize query interface.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const up = async queryInterface => {
  await queryInterface.bulkInsert(
    'categories',
    [
      {
        id: '2d854884-ea82-468f-9883-c86ce8d5a001',
        name: 'Cars',
        description: 'Cars',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2d854884-ea82-468f-9883-c86ce8d5a002',
        name: 'Shoes',
        description: 'Shoes',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2d854884-ea82-468f-9883-c86ce8d5a003',
        name: 'Electronics',
        description: 'Electronics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
};

/**
 * Removes all categories from the database.
 *
 * @async
 * @function down
 * @param {Object} queryInterface - The Sequelize query interface.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const down = async queryInterface => {
  await queryInterface.bulkDelete('categories', null, {});
};

module.exports = {
  up,
  down,
};
