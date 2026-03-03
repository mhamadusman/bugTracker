import { errorCodes } from "../constants/errorCodes";
import { UserErrorMessages } from "../constants/userErrorMessag";
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
export class ProjectUils {
  static async validateProjectData(
    data: createProject,
    managerId?: number,
    projectId?: number,
  ) {
    const errors: ValidationError[] = [];
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
      const result = validIdSchema.safeParse(projectId);
      if (!result.success) {
        errors.push({
          field: ProjectFields.PROJECT_ID,
          message: ProjectErrorMessages.INVALID_PROJECT_ID,
        });
      } else {
        const { sqaIds, developerIds } = data;
        const sqaIdsInNumber = sqaIds.split(",").map((id) => Number(id.trim()));
        const developerIdsInNum = developerIds
          .split(",")
          .map((id) => Number(id.trim()));
        const allIds = [...developerIdsInNum, ...sqaIdsInNumber];
        const project = await ProjectHandler.validateProjectwithAssignedDevQa(
          projectId,
          allIds,
        );
        if (!project) {
          errors.push({
            field: ProjectFields.PROJECT_ID,
            message: ProjectErrorMessages.INVALID_PROJECT_ID,
          });
        } else if (project.managerId !== managerId) {
          errors.push({
            field: ProjectFields.MANAGER_ID,
            message: ProjectErrorMessages.PERMISSION_DENIED,
          });
        }else if(project.developers?.length  !== developerIds.length ){
            errors.push({
              field: ProjectFields.DEVELOPER_IDS,
              message: ProjectErrorMessages.INVALID_DEVELOPER_IDS
            })
        }else if(project.sqas?.length !== sqaIdsInNumber.length){
          errors.push({
            field: ProjectFields.SQA_IDS,
            message: ProjectErrorMessages.INVALID_SQA_IDS
          })
        }
      }
    }
    if (errors.length > 0) {
      throw new Exception(errors, errorCodes.BAD_REQUEST);
    }
  }
  //validate manager and project is associated or not
  static async validateManagerAndProject(userId: number, projectId: number) {
    const result = validIdSchema.safeParse(projectId);
    if (result.success) {
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
    } else {
      const error = result.error.issues[0].message;
      throw new Exception(error, errorCodes.BAD_REQUEST);
    }
  }
  static async validateProjectId(projectId: number) {
    const result = validIdSchema.safeParse(projectId);
    if (result.success) {
      const project = await ProjectHandler.validateProjectId(projectId);
      if (!project) {
        return false;
      }
      return true;
    } else {
      const error = result.error.issues[0].message;
      throw new Exception(error, errorCodes.BAD_REQUEST);
    }
  }
}
