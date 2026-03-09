import { UserErrorMessages } from "../constants/userErrorMessag";
import { Exception } from "../helpers/exception";
import { errorCodes } from '../constants/errorCodes';
import { Bug } from "../models/bug.model";
import { status } from "../models/bug.model";
import { bugHandler } from "../handlers/bugsHandler";
import { ValidationError } from "../types/types";
import { BugErrorMessages, BugFields } from "../constants/BugErrorMessages";
import { bugSchema } from '../schemas/bugSchema';
import { validIdSchema } from "../schemas/validIdSchema";
import { ProjectErrorMessages } from "../constants/ProjectErrorMessages";
export class BugUtil {

  //bussines logic 
  static async validateBugUserRelation(
    bugId: number,
    userId: number,
  ) {
    //bussines logic 
    const bug = await bugHandler.getSQAbug(bugId, userId);
    if (!bug) {
      throw new Exception(
        UserErrorMessages.INVALID_REQUEST_STATE,
        errorCodes.BAD_REQUEST,
      );
    }
  }
  static async validateBugRequest(data: any, bugId?: number) {
    const { title, projectId, developerId } = data;
    let errorCode: number = 0;
    const errors: ValidationError[] = [];
    const result = bugSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push({
          field: issue.path[0].toString(),
          message: issue.message,
        });
      });
    } else {
      const isDuplicate = await this.validateBugTitle(title, projectId, bugId);
      if (isDuplicate) {
        errorCode = errorCodes.CONFLICT_WITH_CURRENT_STATE;
        errors.push({
          field: BugFields.TITLE,
          message: BugErrorMessages.DUPLICATE_TITLE,
        });
      }
    }

    if (errors.length > 0) {
      throw new Exception(
        errors,
        errorCode ? errorCode : errorCodes.BAD_REQUEST,
      );
    }

    //avoid busines logic
    // const isProjectValid = await ProjectUils.validateProjectId(projectId);
    // if (!isProjectValid) {
    //   errors.push({
    //     field: BugFields.PROJECT_ID,
    //     message: BugErrorMessages.INVALID_PROJECT_ID,
    //   });
    // }

    // const user = await userHandler.findById(developerId);
    //   if (!user) {
    //     errors.push({
    //       field: BugFields.DEVELOPER_ID,
    //       message: BugErrorMessages.DEVELOPER_REQUIRED,
    //     });
    //   }
  }
  static async validateBugTitle(
    title: string,
    projectId: number,
    bugId?: number,
  ) {
    const bug: Bug | null = await Bug.findOne({
      where: {
        title,
        projectId,
      },
    });
    if (!bug) return false;
    if (!bugId && bug) {
      return true;
    }
    if (bugId && bug.bugId === bugId) {
      //in case of edit
      return false;
    }
    return true;
  }

  static  validateBugStatus(bugStatus: status) {
    if (!Object.values(status).includes(bugStatus)) {
      throw new Exception(
        UserErrorMessages.INVALID_BUG_STATUS,
        errorCodes.BAD_REQUEST,
      );
    }
  }
  static async authorizeDeveloper(
    bugId: number,
    userId: number,
  ): Promise<void> {
    const bug = await bugHandler.getbugByID(bugId);
    if (!bug) {
      throw new Exception(
        UserErrorMessages.INVALID_REQUEST_STATE,
        errorCodes.BAD_REQUEST,
      );
    }
    return;
  } 
  static async validateUpdateBugStatus(bugId: number , userId: number , bugStatus: status){
    this.validateBugStatus(bugStatus)
    await this.authorizeDeveloper(bugId , userId)
  }
  static isValidBugId(bugId: number){
    const result = validIdSchema.safeParse(bugId)
    if(!result.success){
      throw new Exception(ProjectErrorMessages.INVALID_ID_FORMAT , errorCodes.BAD_REQUEST)
    }
  }
}
