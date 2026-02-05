import { errorCodes } from "../constants/errorCodes";
import { UserErrorMessages } from "../constants/userErrorMessag";
import { userHandler } from "../handlers/userHandler";
import { Exception } from "../helpers/exception";
import { createProject } from "../types/types";
import { ProjectHandler } from "../handlers/projectHandlers";

export class ProjectUils {
  // validate project data
  static async validateProjectData(data: createProject) {
    const { name, sqaIds, developerIds, description } = data;
    if (!name?.trim()) {
      throw new Exception(
        UserErrorMessages.INcOMPELETE_DATA_TO_CREATE_PROEJECT,
        errorCodes.BAD_REQUEST,
      );
    }
    const sqaIdsInNumber: number[] = sqaIds
      .split(",")
      .map((id) => Number(id.trim()));
    //now validate these id's fromd data bas
    await this.validateSQAids(sqaIdsInNumber);
    //in the same way validate developers
    const developerIdsInNumber: number[] = developerIds
      .split(",")
      .map((id) => Number(id.trim()));
    await this.validateDeveloperids(developerIdsInNumber);
  }

  //validat all sqa ids and role
  static async validateSQAids(ids: number[]) {
    if (ids.length <= 0) {
      throw new Exception(
        UserErrorMessages.INcOMPELETE_DATA_TO_CREATE_PROEJECT,
        errorCodes.BAD_REQUEST,
      );
    }
    const users = await userHandler.validateSQAids(ids);
    if (users.length !== ids.length) {
      throw new Exception(
        UserErrorMessages.INVALID_SQA_IDS_TO_CREATE_PROJECET,
        errorCodes.BAD_REQUEST,
      );
    }
  }
  //validates developer ids
  static async validateDeveloperids(ids: number[]) {
    if (ids.length <= 0) {
      throw new Exception(
        UserErrorMessages.INcOMPELETE_DATA_TO_CREATE_PROEJECT,
        errorCodes.BAD_REQUEST,
      );
    }
    const users = await userHandler.validateDeveloperIds(ids);
    if (users.length !== ids.length) {
      throw new Exception(
        UserErrorMessages.INVALID_DEVELOPER_IDS_TO_CREATE_PROJECET,
        errorCodes.BAD_REQUEST,
      );
    }
  }

  //validate user by id
  static async validateUser(id: number) {
    const manager = await userHandler.findById(id);
    if (!manager) {
      throw new Exception(
        UserErrorMessages.USER_NOT_FOUND,
        errorCodes.BAD_REQUEST,
      );
    }
    return;
  }

  //validate manager and project is associated or not
  static async validateManagerAndProject(userId: string, projectId: string) {
    const project = await ProjectHandler.getProjectUsingId(Number(projectId));
    if (!project) {
      throw new Exception(UserErrorMessages.INVALID_ID, errorCodes.BAD_REQUEST);
    }
    if (project.managerId !== Number(userId)) {
      throw new Exception(
        UserErrorMessages.ACCESS_DENIED,
        errorCodes.UNAUTHORIZED,
      );
    }
  }

  static async validateProjectId(projectId: number): Promise<void> {
    const project = await ProjectHandler.validateProjectId(projectId);
    if (!project) {
      throw new Exception(UserErrorMessages.INVALID_ID, errorCodes.BAD_REQUEST);
    }
  }
}
