/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'gender', {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'birthdate', {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'preferedcurrency', {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'preferedlanguage', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'gender');
    await queryInterface.removeColumn('users', 'birthdate');
    await queryInterface.removeColumn('users', 'preferedcurrency');
    await queryInterface.removeColumn('users', 'preferedlanguage');
  },
};
