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
          '$2b$10$sb4BI38bZVJkFBmB2ux1fuugVibzD9s0hpQ4cVZcAXPUVbjgCdC6m',
        email: 'test1@example.com',
        phone: '1234567890',
        roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        address: 'kigali, Rwanda',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'mukunzi james',
        password:
          '$2b$10$C.GjURoqI0jpxbCsDuknouqEIF7y3vzfAcauN.WQgrIouyhZv4n0i',
        email: 'jmukunzindahiro@gmail.com',
        phone: '0788270273',
        roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0853',
        address: '123 Test Street',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'rwema remy',
        password:
          '$2b$10$ghcxUhRfRVHvEOtt16Vj7OcANFjXAr2atOjaPzw1ENZFzGpCe7Xdu',
        email: 'rwemaremy21@gmail.com',
        phone: '0788524384',
        roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
        address: 'kigali',
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
