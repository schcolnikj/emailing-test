require("dotenv").config();
const { Sequelize } = require('sequelize');

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    logging: false, 
    native: false, 
  });
  console.log("Conectados a la DB de Local");

  module.exports = sequelize;

  