import sequelize from "../config/database";
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { Project } from "./project.model";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare userType: string;
  declare phoneNumber: number;
  
  declare assignedProjects?: Project[];
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true

    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,

    },
    userType: {
       type: DataTypes.ENUM('developer', 'manager' , 'sqa'),
       allowNull: false,
      

    },
    phoneNumber: {
      type: new DataTypes.INTEGER,
      allowNull: false
    },
    
  },
  {
    tableName: 'users',
    sequelize 
  }
);