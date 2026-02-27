import { createProject, IProjects, project } from "../../types/types";
import { ProjectUils } from "../../utilities/projectUtils";
import { ProjectHandler } from "../../handlers/projectHandlers";
import { UserUtil } from "../../utilities/userUtil";
import { userHandler } from "../../handlers/userHandler";
import { User } from "../../models/users.model";
export class projectManager {
  static async createProject(
    data: createProject,
    imgurl: string,
    imagePublicId: string,
    managerId: number,
  ): Promise<{ projectId: number; image: string | undefined }> {
    await ProjectUils.validateProjectData(data);
    const newProject = await ProjectHandler.createProject(
      data,
      imgurl,
      imagePublicId,
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
    return await ProjectHandler.getAllProjects(
      userId,
      userRole,
      page,
      limit,
      name,
    );
  }
  static async getAllRecepientEmails(
    qasIds: string,
    devIds: string,
  ): Promise<string[]> {
    const devsId = devIds ? devIds.split(",").map((id) => Number(id)) : [];
    const qaIds = qasIds ? qasIds.split(",").map((id) => Number(id)) : [];
    const allIds = [...qaIds, ...devsId];
    const users = await userHandler.getdevAndQaEmails(allIds);
    return users.map((user: any) => user.email).filter(Boolean);
  }
  // static async validateUser(id: number) {
  //   console.log(
  //     `inside validate user function in projectManager and typeof id is ${typeof id}`,
  //   );
  //   await UserUtil.findUserByid(id);
  // }
  // static async validateManagerToDeleteProject(
  //   userId: number,
  //   projectId: number,
  // ) {
  //   await ProjectUils.validateManagerAndProject(userId, projectId);
  // }
  static async deleteProjectById(projectId: number, managerId: number) {
    await ProjectUils.validateManagerAndProject(managerId, projectId);
    await ProjectHandler.deleteProjectUsingId(projectId);
  }
  static async editProject(
    projectId: number,
    projectData: createProject,
    managerId: number,
    imgURL: string,
    imagePublicId: string
  ) {
    await ProjectUils.validateProjectData(projectData, managerId, projectId);
    await ProjectHandler.editProject(projectId, projectData, imgURL , imagePublicId);
  }
  static async validateProjectId(id: number) {
    await ProjectUils.validateProjectId(id);
  }
}
