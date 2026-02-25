import dotenv from 'dotenv'
dotenv.config()
import http from "http";
import app from "./app";
import 'pg'
import sequelize from "./config/database";
import { User, Project, Bug, UserProjects } from './models/association';

const server = http.createServer(app);
const port = process.env.PORT || 8080

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();