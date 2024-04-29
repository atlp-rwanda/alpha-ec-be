/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'averageRatings', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: true,
    });

    await queryInterface.addColumn('products', 'reviewsCount', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'averageRatings');
    await queryInterface.removeColumn('products', 'reviewsCount');
  },
};
