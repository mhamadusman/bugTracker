import http from "http";
import dotenv from "dotenv";
import { app } from "./app";
import config from './config/custome_variables.json'
import './models/association'

import sequelize from "./config/database";

const server = http.createServer(app);

const port = config.sever_port || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync({alter: true});
  

    app.listen(port , () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};


startServer();
