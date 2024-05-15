/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Chats', 'receiverId', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Chats', 'privacy', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Chats', 'receiverId');
    await queryInterface.removeColumn('Chats', 'privacy');
  },
};
