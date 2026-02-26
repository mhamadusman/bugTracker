import { Sequelize } from "sequelize";
import { errorMessages } from "../constants/errorMessages";
import * as pg from "pg";
const connectionSTR = process.env.DATABASE_URL
if (!connectionSTR) {
  throw new Error(errorMessages.MESSAGES.DB_CONNECTION_STRING_NOT_PRESENT);
}
const inProduction = process.env.NODE_ENV === "production"
const sequelize = new Sequelize(connectionSTR, {
  dialect: "postgres",
  dialectModule: pg,
  logging: false,
  dialectOptions: inProduction ?  {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  } : {},
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000
  }
});
export default sequelize;