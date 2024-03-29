import { v4 as uuidv4 } from 'uuid';

/**
 * @typedef {import('sequelize-cli').Migration} Migration
 *
 * @type {Migration}
 * @param {import('sequelize').QueryInterface} queryInterface - The Sequelize QueryInterface instance.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export const up = async queryInterface => {
  await queryInterface.bulkInsert(
    'users',
    [
      {
        id: uuidv4(),
        name: 'eric tuyishimire',
        password:
          '$2b$10$fi3qIU16lNCRJ5TIJHiOlubfecaxpCw3xixfwgEcRkS7iitoQ/qVC',
        email: 't@gmail.com',
        phone: '0780313448',
        address: 'kigali, Rwanda',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
};

/**
 * @type {Migration}
 * @param {import('sequelize').QueryInterface} queryInterface - The Sequelize QueryInterface instance.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export const down = async queryInterface => {
  await queryInterface.bulkDelete('users', null, {});
};
