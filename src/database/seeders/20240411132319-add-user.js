// eslint-disable-next-line import/no-import-module-exports
import { v4 as uuidv4 } from 'uuid';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuidv4(),
          name: 'Judas Iscariot',
          password:
            '$2b$10$H2Hy7n8GuBorUPY3ucOHI.Jryou31S.1F3iZ64GPu7Pyvv.Za7W8q',
          email: 'test3@example.com',
          phone: '0783556915',
          address: 'New York USA',
          verified: true,
          roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Simon Peter',
          password:
            '$2b$10$d.uGhOTM/3rt5IcOYEejru6mPeJrIZgA0v9UTghYdQTdvtrxMbw7m',
          email: 'test2@example.com',
          phone: '0783556915',
          address: 'New York USA',
          verified: true,
          roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0853',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'ruth uwmaha',
          password:
            '$2b$10$sb4BI38bZVJkFBmB2ux1fuugVibzD9s0hpQ4cVZcAXPUVbjgCdC6m',
          email: 'test4@example.com',
          phone: '1234567890',
          verified: true,
          // roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          address: 'kigali, Rwanda',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Mary',
          password:
            '$2b$10$sb4BI38bZVJkFBmB2ux1fuugVibzD9s0hpQ4cVZcAXPUVbjgCdC6m',
          email: 'test5@example.com',
          phone: '07834567890',
          verified: true,
          address: 'kigali, Rwanda',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
