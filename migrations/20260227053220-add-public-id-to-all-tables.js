'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('projects', 'imagePublicId', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('bugs', 'imagePublicId', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'imagePublicId', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('projects', 'imagePublicId'),
      queryInterface.removeColumn('bugs', 'imagePublicId'),
      queryInterface.removeColumn('users', 'imagePublicId'),
    ]);
  }
};