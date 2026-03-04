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
import { userHandler } from "../handlers/userHandler";
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
        //db validation
        const project = await ProjectHandler.validateProjectId(projectId);
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
        } else {
          const { sqaIds, developerIds } = data;
          const sqaIdsInNumber = sqaIds
            .split(",")
            .map((id) => Number(id.trim()));
          const developerIdsInNum = developerIds
            .split(",")
            .map((id) => Number(id.trim()));
          const { devCount, sqaCount } =
            await userHandler.getValidatedUserCounts(
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
    }
    if (errors.length > 0) {
      throw new Exception(errors, errorCodes.BAD_REQUEST);
    }
  }
  //validate manager and project is associated or not
  static async validateManagerAndProject(userId: number, projectId: number) {
    const errors: ValidationError[] = [];
    const result = validIdSchema.safeParse(projectId);
    if (result.success) {
      const project = await ProjectHandler.getProjectUsingId(projectId);
      if (!project) {
        errors.push({
          field: ProjectFields.PROJECT_ID,
          message: ProjectErrorMessages.INVALID_PROJECT_ID,
        });
      } else if (project?.managerId !== userId) {
        errors.push({
          field: ProjectFields.MANAGER_ID,
          message: ProjectErrorMessages.PERMISSION_DENIED,
        });
      }
    } else {
      errors.push({
        field: ProjectFields.PROJECT_ID,
        message: ProjectErrorMessages.INVALID_PROJECT_ID,
      });
    }
    if (errors.length > 0) {
      throw new Exception(errors, errorCodes.BAD_REQUEST);
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
  static validateManagerRole(userType: string) {
    const errors: ValidationError[] = [];
    if (userType !== "manager") {
      errors.push({
        field: ProjectFields.MANAGER_ROLE,
        message: ProjectErrorMessages.PERMISSION_DENIED,
      });
    }
    if (errors.length > 0) {
      console.log("error occurrd in validation manager role");
      throw new Exception(errors, errorCodes.UNAUTHORIZED);
    }
  }
}
