/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Role',
      [
        {
          id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          name: 'seller',
          description: 'seller role',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
          name: 'buyer',
          description: 'buyer role',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'd290f1ee-6c54-4b01-90e6-d701748f0853',
          name: 'admin',
          description: 'admin role',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Role', null, {});
  },
};
