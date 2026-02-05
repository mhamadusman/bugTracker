import { createBug, IBugs, IBugState, project } from "../../types/types";
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
  ): Promise<void> {
    console.log("inside bugMnager create bug function", data);
    await BugUtil.validateBugRequest(data);
    await ProjectUils.validateProjectId(data.projectId);
    await BugUtil.validateBugTitle(data.title, data.projectId);
    await bugHandler.createBug(data, userId, imgurl);
    return;
  }

  static async getAllBugs(
    userId: number,
    userType: string,
    page: number,
    limit: number,
    title: string,
    projectId?: number,
  ): Promise<IBugs> {
    let bugs: IBugs;
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

  //update bug status developere duty
  static async updateBugStatus(
    bugId: number,
    bugStatus: status,
    userId: number,
  ) {
    console.log(typeof bugStatus);
    //validat bug is connect to actual developer
    await BugUtil.authorizeDeveloper(bugId, userId);
    await BugUtil.validateBugStatus(bugStatus);
    //now save
    await bugHandler.updateBugStatus(bugStatus, bugId);
  }
  static async updateBug(bug: Bug, imgurl: string, bugId: number) {
    await BugUtil.validateUpdateRequest(bug);
    await BugUtil.validateBugTitle(bug.title, bug.projectId, bugId);
    await bugHandler.updateBug(bug, imgurl, bugId);
    return;
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
