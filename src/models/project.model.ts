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

export class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  declare projectId: CreationOptional<number>;
  declare managerId: ForeignKey<User["id"]>;
  declare name: string;
  declare description: string;
  declare image?: CreationOptional<string>; 
}
Project.init(
  {
    projectId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },

    managerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true, 
    }
  },
  {
    tableName: "projects",
    sequelize,
  }
);
