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
  declare image: CreationOptional<string | null> 
  declare imagePublicId: CreationOptional<string | null> 
  declare refreshToken: CreationOptional<string | null>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare userType: string;
  declare phoneNumber: string;
  declare assignedProjects?: Project[];
}

User.init(
  {

    refreshToken:{
      type: DataTypes.STRING,
      allowNull: true

    },
    imagePublicId: { 
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true

    },
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
      type: new DataTypes.STRING,
      allowNull: true
    },
    
  },
  {
    tableName: 'users',
    sequelize 
  }
);