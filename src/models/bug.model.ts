import sequelize from "../config/database";
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey
} from "sequelize";
import { User } from "./users.model";
import { Project } from "./project.model";

export enum BugType {
  FEATURE = "feature",
  BUG = "bug"
}

export enum status{
    PENDING =  "pending",
    COMPLETED = "completed",
    INPROGRESS = "in progress"
}


export class Bug extends Model<InferAttributes<Bug>, InferCreationAttributes<Bug>> {
  declare bugId: CreationOptional<number>;
  declare description: CreationOptional<string>
  declare screenshot?: CreationOptional<string | null>;
  declare status?: CreationOptional<string | null>;
  declare title: string;
  declare deadline: string;
  declare type: BugType;

  
  declare projectId: ForeignKey<Project["projectId"]>;
  declare developerId: ForeignKey<User["id"]>;
  declare sqaId: ForeignKey<User["id"]>;

  declare project?: Project;
  declare developer?: User;
  declare sqa?: User;
}
Bug.init(
  {
    bugId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    screenshot: {
      type: DataTypes.STRING,
      allowNull: true
    },

    deadline: {
      type: DataTypes.STRING,
      allowNull: false
    },

    type: {
      type: DataTypes.ENUM(...Object.values(BugType)),
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "projects",
        key: "projectId"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },

    developerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    },

    sqaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    },

    status: {
      type: DataTypes.ENUM(...Object.values(status)),
      defaultValue: status.PENDING
    }
  },
  {
    sequelize,
    tableName: "bugs",
    timestamps: true
  }
);