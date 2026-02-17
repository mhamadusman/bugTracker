import {
  createBug,
  IBugs,
  IBugState,
  IBugWithDeveloper,
  project,
  updateBug,
} from "../../types/types";
import { Bug, status } from "../../models/bug.model";
import { bugHandler } from "../../handlers/bugsHandler";
import { BugUtil } from "../../utilities/bugUtils";
import { ProjectUils } from "../../utilities/projectUtils";
import { Exception } from "../../helpers/exception";
import { UserErrorMessages } from "../../constants/userErrorMessag";
import { errorCodes } from "../../constants/errorCodes";
import { projectManager } from "../projectController/projectManager";

export class BugManagr {
  static async createBug(
    data: createBug,
    userId: number,
    imgurl: string,
  ): Promise<IBugWithDeveloper | null> {
    await BugUtil.validateBugRequest(data);
    const newBug: IBugWithDeveloper | null = await bugHandler.createBug(
      data,
      userId,
      imgurl,
    );
    return newBug;
  }

  static async getAllBugs(
    userId: number,
    userType: string,
    page: number,
    limit: number,
    title: string,
    projectId?: number,
  ): Promise<IBugs> {
    let bugs;
    if (projectId) {
      await ProjectUils.validateProjectId(projectId);
      bugs = await bugHandler.getAllBugs(
        userId,
        userType,
        page,
        limit,
        title,
        projectId,
      );
      return bugs;
    }
    bugs = await bugHandler.getAllBugs(userId, userType, page, limit, title);
    return bugs;
  }

  static async updateBugStatus(
    bugId: number,
    bugStatus: status,
    userId: number,
  ) {
    await BugUtil.authorizeDeveloper(bugId, userId);
    await BugUtil.validateBugStatus(bugStatus);
    await bugHandler.updateBugStatus(bugStatus, bugId);
  }

  static async handleBugReview(
    bugId: number,
    bug: Partial<Bug>,
    userId: number,
  ) {
    await BugUtil.validateBugReviewDetails(bugId, bug, userId);
    await bugHandler.updateBugReview(bug, bugId);
  }

  static async updateBug(
    bug: createBug,
    imgurl: string,
    bugId: number,
    userId: number,
  ): Promise<IBugWithDeveloper | null> {
    if (bug.isClose !== undefined && !bug.projectId) {
      await this.handleBugReview(bugId, bug, userId);
      return null
    }
    await BugUtil.validateBugRequest(bug, bugId);
    //}
    const updatedBug: IBugWithDeveloper | null = await bugHandler.updateBug(
      bug,
      imgurl,
      bugId,
    );
    return updatedBug;
  }
  static async deleteBug(bugId: number, sqaId: number) {
    const bug = await bugHandler.getSQAbug(bugId, sqaId);
    if (!bug) {
      throw new Exception(
        UserErrorMessages.ACCESS_DENIED,
        errorCodes.BAD_REQUEST,
      );
    }

    await bugHandler.deleteBug(bugId);
  }
  static async getBugState(
    userId: number,
    role: string,
    projectId: number,
  ): Promise<IBugState> {
    await projectManager.validateProjectId(projectId);
    const result = await bugHandler.getBugState(userId, role, projectId);
    return result;
  }
}
