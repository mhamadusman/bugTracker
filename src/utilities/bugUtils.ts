import { UserErrorMessages } from "../constants/userErrorMessag";
import { Exception } from "../helpers/exception";
import { errorCodes } from "../constants/errorCodes";
import { Bug } from "../models/bug.model";
import { status } from "../models/bug.model";
import { bugHandler } from "../handlers/bugsHandler";
import { ValidationError } from "../types/types";
import { BugErrorMessages, BugFields } from "../constants/BugErrorMessages";
import { bugSchema } from "../schemas/bugSchema";
export class BugUtil {
  static async validateBugReviewDetails(
    bugId: number,
    bug: Partial<Bug>,
    userId: number,
  ) {
    //avoid bussines logic here
    // const bugdetails = await bugHandler.getSQAbug(bugId, userId);
    // if (!bugdetails) {
    //   throw new Exception(
    //     UserErrorMessages.INVALID_REQUEST_STATE,
    //     errorCodes.BAD_REQUEST,
    //   );
    // }
    this.validateBugStatus(bug.status as status);
  }
  static async validateBugRequest(data: any, bugId?: number) {
    const { title, projectId, developerId } = data;
    const errors: ValidationError[] = [];
    const result = bugSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        errors.push({
          field: issue.path[0].toString(),
          message: issue.message,
        });
      });
    }
    if (result.success) {
      const isDuplicate = await this.validateBugTitle(title, projectId, bugId);
      if (isDuplicate) {
        errors.push({
          field: BugFields.TITLE,
          message: BugErrorMessages.DUPLICATE_TITLE,
        });
      }
    }

    if (errors.length > 0) {
      throw new Exception(errors, errorCodes.BAD_REQUEST);
    }

    //validate using join
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
      return false;
    }
    return true;
  }

  static async validateBugStatus(bugStatus: status) {
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
    const bug = await bugHandler.getbugByID(bugId, userId);
    if (!bug) {
      throw new Exception(
        UserErrorMessages.INVALID_REQUEST_STATE,
        errorCodes.BAD_REQUEST,
      );
    }
    return;
  }
}
