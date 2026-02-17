import { Sequelize } from "sequelize";
import { errorMessages } from "../constants/errorMessages";
import * as pg from "pg";
const connectionSTR = process.env.DB_CONNECTION_STR
if (!connectionSTR) {
  throw new Error(errorMessages.MESSAGES.DB_CONNECTION_STRING_NOT_PRESENT);
}
const sequelize = new Sequelize(connectionSTR, {
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false, 
  //   },
  // },
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000
  }
});
export default sequelize;