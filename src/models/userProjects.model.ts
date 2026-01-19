import sequelize from "../config/database";
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
 ForeignKey,
} from "sequelize";
import { User } from "./users.model";
import { Project } from "./project.model";
import { AssignedUserTypes } from "../types/types";

export class UserProjects extends Model<InferAttributes<UserProjects>, InferCreationAttributes<UserProjects>> {
  declare projectId: ForeignKey<Project["projectId"]> 
  declare userId: ForeignKey<User["id"]> 
  declare userType: AssignedUserTypes

  
}

UserProjects.init(
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Project,
        key: "projectId"
      },

      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
       references: {
        model: User,
        key: "id"
      },

      onDelete: "CASCADE",

      onUpdate: "CASCADE"
    },
    userType: {
      type: DataTypes.ENUM(...Object.values(AssignedUserTypes)),
      allowNull: false
    }
    
  },
  {
    tableName: 'userProjects',
    sequelize 
  }
);