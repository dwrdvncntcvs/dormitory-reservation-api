"use strict";
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const plainPassword = "myPassword";

const hashPass = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10, "a");
  const password = await bcrypt.hash(plainPassword, salt);

  return password;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Users", [
      {
        id: uuid.v4(),
        name: "Edward Vincent Cuevas",
        username: "dwrdvncntcvs",
        email: "edwardvincentcuevas7@gmail.com",
        password: await hashPass(plainPassword),
        contactNumber: "094556792203",
        address: "San Isidro Cuenca Batangas",
        gender: "male",
        role: "admin",
        isEmailVerified: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: "Reneil Moncawe",
        username: "reneil",
        email: "reneilmoncawe@gmail.com",
        password: await hashPass(plainPassword),
        contactNumber: "1231312312321",
        address: "Ibaan Batangas",
        gender: "male",
        role: "admin",
        isEmailVerified: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: "Anna Paulene Joble",
        username: "anna",
        email: "annapaulene7@gmail.com",
        password: await hashPass(plainPassword),
        contactNumber: "24234234323234",
        address: "Ibaan Batangas",
        gender: "female",
        role: "admin",
        isEmailVerified: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Users", null, {});
  },
};
