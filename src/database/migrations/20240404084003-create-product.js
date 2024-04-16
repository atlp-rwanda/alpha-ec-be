module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      price: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      expiryDate: {
        type: Sequelize.DATE,
      },
      bonus: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'available',
      },
      quantity: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      sellerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('products');
  },
};
