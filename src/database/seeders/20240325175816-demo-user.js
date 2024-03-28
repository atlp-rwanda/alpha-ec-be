'use strict';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      name: 'eric tuyishimire',
      password: '$2b$10$fi3qIU16lNCRJ5TIJHiOlubfecaxpCw3xixfwgEcRkS7iitoQ/qVC',
      email: "t@gmail.com",
      phone: "0780313448",
      address: "kigali, Rwanda",
      createdAt: new Date(),
      updatedAt: new Date(),
     }], {});

  },

  async down (queryInterface, Sequelize) {

      await queryInterface.bulkDelete('users', null, {});

  }
};
