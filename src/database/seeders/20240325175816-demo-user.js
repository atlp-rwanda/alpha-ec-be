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
        roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        address: 'kigali, Rwanda',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastTimePasswordUpdated: new Date(),
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
        lastTimePasswordUpdated: new Date(),
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
        lastTimePasswordUpdated: new Date(),
      },
      {
        id: uuidv4(),
        name: 'sophie',
        password:
          '$2b$10$ltHGjPpfWlsQaEzWHR0/vON9dQgS0KsJ6SztA1urcS7rR2f5uZhhu',
        email: 'sofidele12@gmail.com',
        phone: '0788275156',
        roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
        address: 'kigali',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastTimePasswordUpdated: new Date(),
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
        lastTimePasswordUpdated: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Eric',
        password:
          '$2b$10$SSvlerzdT.7CkJ/Xojl0Q.4ycW8Gnq4ltWPNL7DGZ9nvf8C6rRhyi',
        email: 'jean.eric1091@gmail.com',
        phone: '0780313448',
        roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        address: 'kigali',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastTimePasswordUpdated: new Date(),
      },
      {
        id: 'cb93467c-d2a5-4898-ab34-74c8581f45cf',
        name: 'The front',
        password:
          '$2a$10$m9zRqS.2W4XlkdIwycYQGedmMcwmgYfyf3sEpk1Tp7lAbRtUXZCri',
        email: 'uwamarith@gmail.com',
        phone: '0783556915',
        roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        address: 'kigali, Rwanda',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastTimePasswordUpdated: new Date('2023-05-03'),
      },
      {
        id: '67968bf4-3a28-44e0-b14d-828587d20d9a',
        name: 'John',
        password:
          '$2a$10$arrFyHY3xuyKv.wxZDRLnON6o6vZDYua2BUKb96IqLw1yj5gYVTOG',
        email: 'ruthuwamahoro250@gmail.com',
        phone: '0785557397',
        roleId: 'eb4914d0-ea4d-490d-929f-97ce7a05fc72',
        address: 'kigali, Rwanda',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastTimePasswordUpdated: new Date(
          Date.now() - 29 * 24 * 60 * 60 * 1000
        ),
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
