// eslint-disable-next-line import/no-import-module-exports
import { v4 as uuidv4 } from 'uuid';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: 'd95193b1-5548-4650-adea-71f622667095',
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
          name: 'Ndahiro James',
          password:
            '$2b$10$Jnzk1aJ9PdePqGuW1CtRN.TyswmnBKdqPp0pySXvi5NYNjponsl0K',
          email: 'j.mukunzi@alustudent.com',
          phone: '0788691201',
          address: '123 Test Street',
          verified: true,
          roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'sophie',
          password:
            '$2b$10$ltHGjPpfWlsQaEzWHR0/vON9dQgS0KsJ6SztA1urcS7rR2f5uZhhu',
          email: 'sofidele12@gmail.com',
          phone: '0788275156',
          address: 'kigali',
          verified: true,
          roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
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
        {
          id: uuidv4(),
          name: 'Irasubiza',
          password:
            '$2b$10$sb4BI38bZVJkFBmB2ux1fuugVibzD9s0hpQ4cVZcAXPUVbjgCdC6m',
          email: 'test6@example.com',
          phone: '0783456789',
          verified: true,
          address: 'kigali, Rwanda',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'ndahiro james',
          password:
            '$2a$10$/2hcfbCc/PPMjavxfk6abuEpIJQ5s7epUQfUHGZ/SbmTxv1180caK',
          email: 'test10@example.com',
          phone: '0788691201',
          verified: true,
          roleId: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
          address: 'kigali',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'c19de6bc-2f6c-499e-9399-f010d656b4f9',
          name: 'Adolf Hitler',
          password:
            '$2b$10$sb4BI38bZVJkFBmB2ux1fuugVibzD9s0hpQ4cVZcAXPUVbjgCdC6m',
          email: 'test8@example.com',
          phone: '0783556915',
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
