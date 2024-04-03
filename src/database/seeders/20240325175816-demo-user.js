import { v4 as uuidv4 } from 'uuid';

/**
 * Represents a Sequelize migration.
 * @typedef {import('sequelize-cli').Migration} Migration
 */

/* eslint-disable valid-jsdoc */
/**
 * Runs the migration.
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
        email: 'test@gmail.com',
        phone: '1234567890',
        address: 'kigali, Rwanda',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'ruth uwmaha',
        password:
          '$2b$10$L88WJjhwBAzERaSDjTbctOe/WjO3i0X7KKUjKMCW4XBRjdyEgs22W',
        email: 'test1@example.com',
        phone: '1234567890',
        address: 'kigali, Rwanda',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
};

/**
 * Reverts the migration.
 * @param {import('sequelize').QueryInterface} queryInterface - The Sequelize QueryInterface instance.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export const down = async queryInterface => {
  await queryInterface.bulkDelete('users', null, {});
};
