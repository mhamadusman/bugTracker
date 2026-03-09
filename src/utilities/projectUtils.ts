import { errorCodes } from '../constants/errorCodes';
import { Exception } from "../helpers/exception";
import { createProject } from "../types/types";
import { ProjectHandler } from "../handlers/projectHandlers";
import { ValidationError } from "../types/types";
import { projectSchema } from "../schemas/projectSchema";
import { validIdSchema } from "../schemas/validIdSchema";
import {
  ProjectErrorMessages,
  ProjectFields,
} from "../constants/ProjectErrorMessages";
import { userHandler } from "../handlers/userHandler";
export class ProjectUils {

  static async validateProjectData(
    data: createProject,
    managerId?: number,
    projectId?: number,
  ) {
    const errors: ValidationError[] = [];
    let error: string = "";
    let errorCode: number = 0;
    const result = projectSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push({
          field: issue.path[0].toString(),
          message: issue.message,
        });
      });
    }
    //business logic
    if (result.success && projectId) {
      this.validateIdSchema(projectId);
      //db validation
      const project = await ProjectHandler.getProjectUsingId(projectId);
      if (!project) {
        error = ProjectErrorMessages.PROJECT_NOT_FOUND;
        errorCode = errorCodes.BAD_REQUEST;
      } else if (project.managerId !== managerId) {
        error = ProjectErrorMessages.PERMISSION_DENIED;
        errorCode = errorCodes.FORBIDDEN;
      } else {
        const { sqaIds, developerIds } = data;
        const sqaIdsInNumber = sqaIds.split(",").map((id) => Number(id.trim()));
        const developerIdsInNum = developerIds
          .split(",")
          .map((id) => Number(id.trim()));
        const { devCount, sqaCount } = await userHandler.getValidatedUserCounts(
          developerIdsInNum,
          sqaIdsInNumber,
        );
        if (devCount !== developerIdsInNum.length) {
          errors.push({
            field: ProjectFields.DEVELOPER_IDS,
            message: ProjectErrorMessages.INVALID_DEVELOPER_IDS,
          });
        }
        if (sqaCount !== sqaIdsInNumber.length) {
          errors.push({
            field: ProjectFields.SQA_IDS,
            message: ProjectErrorMessages.INVALID_SQA_IDS,
          });
        }
      }
    }
    if (errors.length > 0) {
      throw new Exception(errors, errorCodes.BAD_REQUEST);
    } else if (error.length > 0) {
      throw new Exception(error, errorCode);
    }
  }
  static async validateManagerProjectRelation(
    userId: number,
    projectId: number,
  ) {
    let error: string = "";
    let errorCode: number = 0;
    this.validateIdSchema(projectId);
    const project = await ProjectHandler.getProjectUsingId(projectId);
    if (!project) {
      error = ProjectErrorMessages.PROJECT_NOT_FOUND;
      errorCode = errorCodes.DOCUMENT_NOT_FOUND;
    } else if (project?.managerId !== userId) {
      error = ProjectErrorMessages.PERMISSION_DENIED;
      errorCode = errorCodes.FORBIDDEN;
    }
    if (error.length > 0) {
      throw new Exception(error, errorCode);
    }
  }
  static async validateProjectId(projectId: number) {
    const result = validIdSchema.safeParse(projectId);
    let error: string = ''
    let errorCode: number = 0
    if (result.success) {
      const project = await ProjectHandler.validateProjectId(projectId);
      if (!project) {
        error = ProjectErrorMessages.PROJECT_NOT_FOUND
        errorCode = errorCodes.DOCUMENT_NOT_FOUND
      }
    } else {
      error = result.error.issues[0].message;
      errorCode = errorCodes.BAD_REQUEST
    }
    if(error.length > 0){
      throw new Exception(error , errorCode)
    }
  }

  static validateManagerRole(userType: string) {
    let error: string = "";
    if (userType !== "manager") {
      error = ProjectErrorMessages.PERMISSION_DENIED;
    }
    if (error.length > 0) {
      throw new Exception(error, errorCodes.FORBIDDEN);
    }
  }

  static validateIdSchema(id: number) {
    const result = validIdSchema.safeParse(id);
    if (!result.success) {
      throw new Exception(
        result.error.issues[0].message,
        errorCodes.BAD_REQUEST,
      );
    }
  }
}
