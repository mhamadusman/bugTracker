import sequelize from "../config/database";
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
 ForeignKey,
} from "sequelize";
import { User } from "./users.model";

export class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>
> {
  declare projectId: CreationOptional<number>;
  declare managerId: ForeignKey<User["id"]> 
  declare name: string;
}

Project.init(
  {
    projectId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id"
      },
      
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    }
    
  },
  {
    tableName: 'projects',
    sequelize 
  }
);