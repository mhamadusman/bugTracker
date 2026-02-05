import { createProject, IProjects, project } from "../../types/types";
import { ProjectUils } from "../../utilities/projectUtils";
import { ProjectHandler } from "../../handlers/projectHandlers";
import { Exception } from "../../helpers/exception";
import { UserErrorMessages } from "../../constants/userErrorMessag";
import { errorCodes } from "../../constants/errorCodes";
import { UserUtil } from "../../utilities/userUtil";
import { Project } from "../../models/project.model";

export class projectManager {
  static async createProject(
    data: createProject,
    imgurl: string,
    managerId: number,
  ): Promise<project> {
    await ProjectUils.validateProjectData(data);
    const newProject: project = await ProjectHandler.createProject(
      data,
      imgurl,
      managerId,
    );
    return newProject;
  }
  static async getProjects(
    userId: number,
    userRole: string,
    page: number,
    limit: number,
    name: string,
  ): Promise<IProjects> {
    let result: IProjects;
    if (userRole === "manager") {
      return (result = await ProjectHandler.getManagerProjects(
        userId,
        page,
        limit,
        name,
      ));
    } else if (userRole === "sqa" || userRole === "developer") {
      //will return depending on userId
      return (result = await ProjectHandler.getSQAnDevprojects(
        userId,
        page,
        limit,
        name,
      ));
    }
    throw new Exception(
      UserErrorMessages.INVALID_USER_TYPE,
      errorCodes.BAD_REQUEST,
    );
  }

  static async validateUser(id: number) {
    console.log(
      `inside validate user function in projectManager and typeof id is ${typeof id}`,
    );
    await UserUtil.findUserByid(id);
  }
  static async validateManagerToDeleteProject(
    userId: string,
    projectId: string,
  ) {
    await ProjectUils.validateManagerAndProject(userId, projectId);
  }

  static async deleteProjectById(projectId: string, managerId: string) {
    await ProjectUils.validateManagerAndProject(managerId, projectId);
    await ProjectHandler.deleteProjectUsingId(Number(projectId));
  }

  static async editProject(
    projectId: number,
    projectData: createProject,
    managerId: number,
    imgURL: string,
  ) {
    //validate project id
    await ProjectUils.validateManagerAndProject(
      String(managerId),
      String(projectId),
    );
    await ProjectUils.validateProjectData(projectData);
    await ProjectHandler.editProject(projectId, projectData, imgURL);
  }

  static async validateProjectId(id: number) {
    await ProjectUils.validateProjectId(id);
  }
}
