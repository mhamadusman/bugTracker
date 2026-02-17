import { errorCodes } from "../constants/errorCodes";
import { UserErrorMessages } from "../constants/userErrorMessag";
import { userHandler } from "../handlers/userHandler";
import { Exception } from "../helpers/exception";
import { createProject } from "../types/types";
import { ProjectHandler } from "../handlers/projectHandlers";
import { ValidationError } from "../types/types";
import {
  ProjectErrorMessages,
  ProjectFields,
} from "../constants/ProjectErrorMessages";

export class ProjectUils {
  static async validateProjectData(
    data: createProject,
    managerId?: number,
    projectId?: number,
  ) {
    const { name, sqaIds, developerIds, description } = data;
    const errors: ValidationError[] = [];

    if (projectId) {
      const project = await ProjectHandler.validateProjectId(projectId);
      if (!project) {
        errors.push({
          field: ProjectFields.PROJECT_ID,
          message: ProjectErrorMessages.INVALID_PROJECT_ID,
        });
      } else if (Number(project.managerId) !== managerId) {
        errors.push({
          field: "projectId",
          message: ProjectErrorMessages.PERMISSION_DENIED,
        });
      }
    }

    if (!name?.trim()) {
      errors.push({
        field: ProjectFields.NAME,
        message: ProjectErrorMessages.NAME_REQUIRED,
      });
    }

    if (sqaIds) {
      const sqaIdsInNumber = sqaIds.split(",").map((id) => Number(id.trim()));
      const response = await this.validateSQAids(sqaIdsInNumber);
      if (!response) {
        errors.push({
          field: ProjectFields.SQA_IDS,
          message: ProjectErrorMessages.INVALID_SQA_IDS,
        });
      }
    } else {
      errors.push({
        field: ProjectFields.SQA_IDS,
        message: ProjectErrorMessages.SQA_REQUIRED,
      });
    }

    if (developerIds) {
      const developerIdsInNumber = developerIds
        .split(",")
        .map((id) => Number(id.trim()));
      const developerResponse =
        await this.validateDeveloperids(developerIdsInNumber);
      if (!developerResponse) {
        errors.push({
          field: ProjectFields.DEVELOPER_IDS,
          message: ProjectErrorMessages.INVALID_DEVELOPER_IDS,
        });
      }
    } else {
      errors.push({
        field: ProjectFields.DEVELOPER_IDS,
        message: ProjectErrorMessages.DEVELOPER_REQUIRED,
      });
    }

    if (errors.length > 0) {
      throw new Exception(errors, errorCodes.BAD_REQUEST);
    }
  }
  static async validateSQAids(ids: number[]) {
    if (ids.length <= 0) {
      return false;
    }
    const users = await userHandler.validateSQAids(ids);
    if (users.length !== ids.length) {
      return false;
    }
    return true;
  }
  static async validateDeveloperids(ids: number[]) {
    if (ids.length <= 0) {
      return false;
    }
    const users = await userHandler.validateDeveloperIds(ids);
    if (users.length !== ids.length) {
      return false;
    }
    return true;
  }

  //validate manager and project is associated or not
  static async validateManagerAndProject(userId: number, projectId: number) {
    const project = await ProjectHandler.getProjectUsingId(projectId);
    if (!project) {
      throw new Exception(
        UserErrorMessages.PROJECT_NOT_FOUND,
        errorCodes.BAD_REQUEST,
      );
    }
    if (project.managerId !== userId) {
      throw new Exception(
        UserErrorMessages.ACCESS_DENIED,
        errorCodes.UNAUTHORIZED,
      );
    }
  }

  //remove it
  static async validateProjectId(projectId: number) {
    const project = await ProjectHandler.validateProjectId(projectId);
    if (!project) {
      return false;
    }
    return true;
  }
}
