import sequelize from '../config/database';
import { Project } from '../models/project.model';
import { UserProjects } from '../models/userProjects.model';
import { createProject, project } from '../types/types';
import { AssignedUserTypes } from '../types/types';
import { Exception } from '../helpers/exception';
import { errorMessages } from '../constants/errorMessages';
import { errorCodes } from '../constants/errorCodes';
import { userProjectsData } from '../types/types';
import { User } from '../models/users.model';
import { IProjects } from '../types/types';
import { Op } from 'sequelize';

export class ProjectHandler {
  //create new project
  static async createProject(data: createProject, imgurl: string, managerId: number): Promise<project> {
    //first save data in proejcts then in junstion table using projct id
    const transaction = await sequelize.transaction();
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

      //now save data into junction table
      const userProjectData: userProjectsData[] = this.createUserProjectData(newProject.projectId, data);
      //now save into db

      console.log('data which is going to save in userProjects..', userProjectData);

      const userProject = await UserProjects.bulkCreate(userProjectData, { transaction });
      console.log('userproeject which is created is ', userProject);
      await transaction.commit();

      return newProject;
    } catch (error) {
      await transaction.rollback();
      throw new Exception(errorMessages.MESSAGES.SOMETHING_WENT_WRONG, errorCodes.INTERNAL_SERVER_ERROR);
    }
  }

  //get all projects
  static async getManagerProjects(managerId: number, page: number, limit: number): Promise<IProjects> {
    const offset = (page - 1) * limit;
    const { rows, count } = await Project.findAndCountAll({
      where: { managerId },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      projects: rows,
      totalProjects: count,
      pages: Math.ceil(count / limit),
    };
  }

  static async getSQAprojects(userId: number, page: number, limit: number): Promise<IProjects> {
    const offset = (page - 1) * limit;
    const result = await Project.findAndCountAll({
      offset,
      limit,
      distinct: true,
      include: [
        {
          model: User,
          as: 'assignedUsers',
          where: { id: userId },
          through: { attributes: [] },
          attributes: [],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return {
      totalProjects: result.count,
      projects: result.rows,
      pages: Math.ceil(result.count / limit),
    };
  }
  static async getDeveloperProjects(userId: number, page: number, limit: number): Promise<IProjects> {
    const offset = (page - 1) * limit;
    const result = await Project.findAndCountAll({
      offset,
      limit,
      distinct: true,
      include: [
        {
          model: User,
          as: 'assignedUsers',
          where: { id: userId },
          through: { attributes: [] },
          attributes: [],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return {
      totalProjects: result.count,
      projects: result.rows,
      pages: Math.ceil(result.count / limit),
    };
  }
  //get project using id
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

  //edit project
  static async editProject(projectId: number, data: createProject, imageURL: string) {
    const transaction = await sequelize.transaction();
    //update name in project table
    await Project.update({ name: data.name, description: data.description, image: imageURL }, { where: { projectId }, transaction });
    //remove old data from junction table
    await UserProjects.destroy({ where: { projectId }, transaction });
    const userProjectData: userProjectsData[] = this.createUserProjectData(projectId, data);
    const userProject = await UserProjects.bulkCreate(userProjectData, { transaction });
    await transaction.commit();
  }
  static createUserProjectData(projectId: number, data: createProject): userProjectsData[] {
    const userProjectData: userProjectsData[] = [];
    const developerIds = data.developerIds.split(',').map((id) => Number(id));
    const sqaIds = data.sqaIds.split(',').map((id) => Number(id));

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

  static async validateProjectId(projectId: number): Promise<Project | null>{
    const project = await Project.findByPk(projectId)
    return project
  }
}
