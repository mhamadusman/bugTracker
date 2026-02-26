import sequelize from "../config/database";
import { User } from "../models/association";
import { UserProjects } from "../models/association";
import { Project } from "../models/association";
import { createProject } from "../types/types";
import { AssignedUserTypes } from "../types/types";
import { Exception } from "../helpers/exception";
import { errorMessages } from "../constants/errorMessages";
import { errorCodes } from "../constants/errorCodes";
import { userProjectsData } from "../types/types";
import { IProjects } from "../types/types";
import { IProjectDTO } from "../types/types";
import { Op, literal } from "sequelize";
import path from "path";
import fs from "fs/promises";
export class ProjectHandler {
  static async createProject(
    data: createProject,
    imgurl: string,
    managerId: number,
  ): Promise<{ projectId: number; image: string | undefined }> {
    const transaction = await sequelize.transaction();
    let projectId: number;
    let projectImage: string | undefined;
    try {
      const newProject = await Project.create(
        {
          name: data.name,
          managerId: managerId,
          image: imgurl,
          description: data.description,
        },
        { transaction },
      );
      projectId = newProject.projectId;
      projectImage = newProject.image;
      const userProjectData: userProjectsData[] = this.createUserProjectData(
        newProject.projectId,
        data,
      );
      await UserProjects.bulkCreate(userProjectData, { transaction });
      await transaction.commit();
      return {
        projectId,
        image: projectImage,
      };
    } catch (error) {
      try {
        await transaction.rollback();
      } catch (error) {
        console.log('error creating new project "rollbackError" :: ', error);
      }
      throw new Exception(
        errorMessages.MESSAGES.SOMETHING_WENT_WRONG,
        errorCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
  static async getSingleProjectDetails(
    projectId: number,
  ): Promise<IProjectDTO | null> {
    const include: any[] = [
      {
        association: "assignedUsers",
        as: "developers",
        where: { userType: "developer" },
        attributes: ["id", "name", "image", "userType"],
        through: { attributes: [] },
        required: false,
      },
      {
        association: "assignedUsers",
        as: "sqas",
        where: { userType: "sqa" },
        attributes: ["id", "name", "image", "userType"],
        through: { attributes: [] },
        required: false,
      },
    ];
    const project: any = await Project.findByPk(projectId, {
      include,
      attributes: {
        include: [
          [
            literal(
              `(SELECT COUNT(*)::int FROM "bugs" WHERE "bugs"."projectId" = "Project"."projectId")`,
            ),
            "totalBugsCount",
          ],
          [
            literal(
              `(SELECT COUNT(*)::int FROM "bugs" WHERE "bugs"."projectId" = "Project"."projectId" AND "bugs"."status" = 'completed')`,
            ),
            "completedBugsCount",
          ],
        ],
      },
    });
    if (!project) return null;
    return {
      projectId: project.projectId,
      name: project.name,
      description: project.description,
      image: project.image ?? null,
      devTeam: project.developers || [],
      qaTeam: project.sqas || [],
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      taskComplete: project.getDataValue("completedBugsCount") || 0,
      totalBugs: project.getDataValue("totalBugsCount") || 0,
    };
  }
  static async getAllProjects(
    userId: number,
    userType: string,
    page: number,
    limit: number,
    name: string,
  ): Promise<IProjects> {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (name?.trim()) {
      where.name = { [Op.iLike]: `%${name.trim()}%` };
    }
    if (userType === "manager") {
      where.managerId = userId;
    }
    const include: any[] = [];
    if (userType !== "manager") {
      include.push({
        association: "assignedUsers",
        where: { id: userId },
        attributes: [],
        through: { attributes: [] },
        required: true,
      });
    }
    include.push(
      {
        association: "developers",
        attributes: ["id", "name", "image", "userType"],
        through: { attributes: [] },
        required: false,
      },
      {
        association: "sqas",
        attributes: ["id", "name", "image", "userType"],
        through: { attributes: [] },
        required: false,
      },
    );
    let roleFilter = "";
    if (userType === "sqa") {
      roleFilter = `AND "bugs"."sqaId" = ${userId}`;
    } else if (userType === "developer") {
      roleFilter = `AND "bugs"."developerId" = ${userId}`;
    }
    const { rows, count } = await Project.findAndCountAll({
      where,
      include,
      distinct: true,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      attributes: {
        include: [
          [
            literal(
              `(SELECT COUNT(*) FROM "bugs" WHERE "bugs"."projectId" = "Project"."projectId" ${roleFilter})`,
            ),
            "totalBugsCount",
          ],
          [
            literal(
              `(SELECT COUNT(*) FROM "bugs" WHERE "bugs"."projectId" = "Project"."projectId" AND "bugs"."status" = 'completed' ${roleFilter})`,
            ),
            "completedBugsCount",
          ],
        ],
      },
    });
    const projectsWithDetails: IProjectDTO[] = rows.map((project: any) => ({
      projectId: project.projectId,
      name: project.name,
      description: project.description,
      image: project.image ?? null,
      devTeam: project.developers || [],
      qaTeam: project.sqas || [],
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      taskComplete: parseInt(project.getDataValue("completedBugsCount")) || 0,
      totalBugs: parseInt(project.getDataValue("totalBugsCount")) || 0,
    }));
    return {
      totalProjects: count,
      pages: Math.ceil(count / limit),
      projectsWithDetails,
    };
  }
  static async getProjectUsingId(projectId: number): Promise<Project | null> {
    const project = await Project.findByPk(projectId);
    return project;
  }
  //delete project
  static async deleteProjectUsingId(projectId: number) {
    await Project.destroy({
      where: { projectId },
    });
  }
  static async editProject(
    projectId: number,
    data: createProject,
    imageURL: string,
  ) {
    const transaction = await sequelize.transaction();
    let oldImageToDelete: string | null = null;
    try {
      const updatedPro: any = {
        name: data.name,
        description: data.description,
      };
      if (imageURL && imageURL.length > 0) {
        updatedPro.image = imageURL;
        const project = await this.getProjectUsingId(projectId);
        if (project?.image && project.image !== "null") {
          oldImageToDelete = project.image;
        }
      }
      await Project.update(updatedPro, {
        where: { projectId },
        transaction,
      });
      await UserProjects.destroy({ where: { projectId }, transaction });
      const userProjectData = this.createUserProjectData(projectId, data);
      await UserProjects.bulkCreate(userProjectData, { transaction });
      await transaction.commit();
      if (oldImageToDelete) {
        const oldImagePath = path.join(
          __dirname,
          "../../public",
          oldImageToDelete,
        );
        try {
          await fs.unlink(oldImagePath);
          console.log('old image removed :: ' , oldImagePath)
        } catch (err) {
          console.log("Error deleting old image file ::", err);
        }
      }
    } catch (error) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.log("Error during rollback :: ", rollbackError);
      }
      throw new Exception(
        errorMessages.MESSAGES.SOMETHING_WENT_WRONG,
        errorCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
  static createUserProjectData(
    projectId: number,
    data: createProject,
  ): userProjectsData[] {
    const userProjectData: userProjectsData[] = [];
    const developerIds = data.developerIds.split(",").map((id) => Number(id));
    const sqaIds = data.sqaIds.split(",").map((id) => Number(id));
    developerIds.forEach((userId) => {
      userProjectData.push({
        projectId: projectId,
        userId,
        userType: AssignedUserTypes.DEVELOPER,
      });
    });
    sqaIds.forEach((userId) => {
      userProjectData.push({
        projectId: projectId,
        userId,
        userType: AssignedUserTypes.SQA,
      });
    });
    return userProjectData;
  }
  //validat sqa ids , validat developer ids
  static async validateSQAids(ids: number[]): Promise<User[]> {
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    return users;
  }
  static async validateProjectId(projectId: number): Promise<Project | null> {
    const project = await Project.findByPk(projectId);
    return project;
  }
  static async getDevelopers(projectId: number): Promise<User[]> {
    const project: any = await Project.findByPk(projectId, {
      attributes: [],
      include: [
        {
          model: User,
          as: "developers",
          attributes: ["id", "name", "userType", "image"],
          through: { attributes: [] },
        },
      ],
    });
    return project?.developers || [];
  }
  // static async getSingleProjectDetails(
  //   projectId: number,
  // ): Promise<IProjectDTO | null> {
  //   const project: any = await Project.findByPk(projectId, {
  //     include: [
  //       {
  //         model: User,
  //         as: "assignedUsers",
  //         through: { attributes: [] },
  //         attributes: ["id", "name", "image", "userType"],
  //       },
  //       {
  //         model: Bug,
  //         as: "bugs",
  //         attributes: ["status"],
  //       },
  //     ],
  //   });
  //   if (!project) return null;
  //   const bugs = project.bugs || [];
  //   const completed = bugs.filter((b: any) => b.status === "completed").length;
  //   const totalBugs = bugs.length;
  //   return {
  //     projectId: project.projectId,
  //     name: project.name,
  //     description: project.description,
  //     image: project.image ?? null,
  //     devTeam: project.assignedUsers.filter(
  //       (u: any) => u.userType === "developer",
  //     ),
  //     qaTeam: project.assignedUsers.filter((u: any) => u.userType === "sqa"),
  //     createdAt: project.createdAt,
  //     updatedAt: project.updatedAt,
  //     taskComplete: completed,
  //     totalBugs: totalBugs,
  //   };
  // }
}
