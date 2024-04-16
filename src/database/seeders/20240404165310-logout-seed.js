import { v4 as uuidv4 } from 'uuid';

export const up = async queryInterface => {
  await queryInterface.bulkInsert(
    'logouts',
    [
      {
        id: uuidv4(),
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjYmNkMjVkLTM3ZjgtNGI2OC04MDdkLWQyZGZmYTVlM2ZlOSIsImlhdCI6MTcxMjMyNTE1MiwiZXhwIjoxNzEyMzMyMzUyfQ.kkJ2wOA5E5YES-O6EdmdBgPAPk2YsXW3i-ke8bf099w',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
};
/* eslint-disable valid-jsdoc */
/**
 * Reverts the migration.
 * @param {import('sequelize').QueryInterface} queryInterface - The Sequelize QueryInterface instance.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export const down = async queryInterface => {
  await queryInterface.bulkDelete('logouts', null, {});
};
