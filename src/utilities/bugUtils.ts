import { createBug } from "../types/types";
import { UserErrorMessages } from "../constants/userErrorMessag";
import { Exception } from "../helpers/exception";
import { errorCodes } from "../constants/errorCodes";
import { Bug, BugType } from "../models/bug.model";
import { status } from "../models/bug.model";
import { bugHandler } from "../handlers/bugsHandler";
import { ProjectUils } from "./projectUtils";
import { ValidationError } from "../types/types";
import { BugErrorMessages, BugFields } from '../constants/BugErrorMessages';
import { userHandler } from "../handlers/userHandler";

export class BugUtil {

  static async validateBugReviewDetails(
    bugId: number,
    bug: Partial<Bug>,
    userId: number,
  ) {
    const bugdetails = await bugHandler.getSQAbug(bugId, userId);
    if (!bugdetails) {
      throw new Exception(
        UserErrorMessages.INVALID_REQUEST_STATE,
        errorCodes.BAD_REQUEST,
      );
    }
    this.validateBugStatus(bug.status as status);
  }

  static async validateBugRequest(data: createBug, bugId?: number) {
    const { title, description, deadline, type, projectId, developerId } = data;
    const errors: ValidationError[] = [];

    if (!title?.trim()) {
      errors.push({ field: BugFields.TITLE, message: BugErrorMessages.TITLE_REQUIRED });
    }

    if (!description?.trim()) {
      errors.push({
        field: BugFields.DESCRIPTION,
        message: BugErrorMessages.DESCRIPTION_REQUIRED,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!deadline || new Date(deadline) < today) {
      errors.push({
        field: BugFields.DEADLINE,
        message: BugErrorMessages.INVALID_DEADLINE,
      });
    }

    if (!type || !Object.values(BugType).includes(type)) {
      errors.push({ field: BugFields.TYPE, message: BugErrorMessages.INVALID_TYPE });
    }

    if (!developerId || !(await userHandler.findById(developerId))) {
      errors.push({
        field: BugFields.DEVELOPER_ID,
        message: BugErrorMessages.DEVELOPER_REQUIRED,
      });
    }

    const isDuplicate = await this.validateBugTitle(title, projectId, bugId);
    if (isDuplicate) {
      errors.push({
        field: BugFields.TITLE,
        message: BugErrorMessages.DUPLICATE_TITLE,
      });
    }

    const isProjectValid = await ProjectUils.validateProjectId(projectId);
    if (!isProjectValid) {
      errors.push({
        field: BugFields.PROJECT_ID,
        message: BugErrorMessages.INVALID_PROJECT_ID,
      });
    }

    if (errors.length > 0) {
      throw new Exception(errors, errorCodes.BAD_REQUEST);
    }
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

  static async getBugs(
    projectId: number,
    userId: number,
    userType: string,
    page: number,
    limit: number,
  ): Promise<Bug[]> {
    let bugs: Bug[] = [];
    let sqaId: number = userId;
    let developerId: number = userId;

    if (userType === "sqa") {
      bugs = await Bug.findAll({
        where: { projectId, sqaId },
      });
    } else if (userType === "developer") {
      bugs = await Bug.findAll({
        where: { projectId, developerId },
      });
    } else {
      bugs = await Bug.findAll({
        where: { projectId },
      });
    }

    return bugs;
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
