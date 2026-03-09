import {
  createBug,
  IBugs,
  IBugWithDeveloper,
} from "../../types/types";
import { Bug, status } from "../../models/bug.model";
import { bugHandler } from "../../handlers/bugsHandler";
import { BugUtil } from "../../utilities/bugUtils";
import { ProjectUils } from "../../utilities/projectUtils";
import { Exception } from "../../helpers/exception";
import { errorCodes } from "../../constants/errorCodes";
import { BugErrorMessages } from '../../constants/BugErrorMessages';

export class BugManagr {
  static async createBug(
    data: createBug,
    userId: number,
    imgurl: string,
    imagePublicId: string
  ): Promise<IBugWithDeveloper | null> {
    await BugUtil.validateBugRequest(data);
    const newBug: IBugWithDeveloper | null = await bugHandler.createBug(
      data,
      userId,
      imgurl,
      imagePublicId
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
    await BugUtil.validateUpdateBugStatus(bugId , userId , bugStatus)
    await bugHandler.updateBugStatus(bugStatus, bugId);
  }

  static async handleBugReview(
    bugId: number,
    bug: Partial<Bug>,
    userId: number,
  ) {
    await BugUtil.validateBugUserRelation(bugId, userId);
    BugUtil.validateBugStatus(bug.status as status);
    await bugHandler.updateBugReview(bug, bugId);
  }

  static async updateBug(
    bug: createBug,
    imgurl: string,
    imagePublicId: string,
    bugId: number,
    userId: number,
  ): Promise<IBugWithDeveloper | null> {
    if (bug.isClose !== undefined && !bug.projectId) {
      await this.handleBugReview(bugId, bug, userId);
      return null
    }
    await BugUtil.validateBugRequest(bug, bugId);
    const updatedBug: IBugWithDeveloper | null = await bugHandler.updateBug(
      bug,
      imgurl,
      imagePublicId,
      bugId,
    );
    return updatedBug;
  }
  static async deleteBug(bugId: number, sqaId: number) {
    this.isValidBugId(bugId)
    const bug = await bugHandler.getbugByID(bugId)
    if (!bug) {
      throw new Exception(
        BugErrorMessages.BUG_NOT_FOUND,
        errorCodes.DOCUMENT_NOT_FOUND
      );
    }
    await bugHandler.deleteBug(bugId);
  }
  
  static isValidBugId(bugId: number){
    BugUtil.isValidBugId(bugId)
    
  }
}
