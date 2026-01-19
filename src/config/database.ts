import { Sequelize } from "sequelize";
import config from './custome_variables.json'

const sequelize = new Sequelize(

  config.database_name,
  config.user_name,
  config.database_password,   
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;
