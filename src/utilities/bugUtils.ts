import { createBug } from "../types/types";
import { UserErrorMessages } from "../constants/userErrorMessag";
import { Exception } from "../helpers/exception";
import { errorCodes } from "../constants/errorCodes";
import { Bug, BugType } from "../models/bug.model";
import { status } from "../models/bug.model";
import { bugHandler } from "../handlers/bugsHandler";

export class BugUtil {
  static async validateUpdateRequest(data: Bug) {
    console.log("bug data is", data);

    if (!data.title || data.title.trim() === "") {
      throw new Exception(
        "Title is required and cannot be empty",
        errorCodes.BAD_REQUEST,
      );
    }

    if (!data.description || data.description.trim() === "") {
      throw new Exception(
        "Description is required and cannot be empty",
        errorCodes.BAD_REQUEST,
      );
    }

    if (!data.deadline) {
      throw new Exception("Deadline is required", errorCodes.BAD_REQUEST);
    }

    if (!data.type || !Object.values(BugType).includes(data.type)) {
      throw new Exception(
        `Invalid Bug Type. Provided: ${data.type}`,
        errorCodes.BAD_REQUEST,
      );
    }

    if (!data.developerId) {
      throw new Exception("Developer ID is missing", errorCodes.BAD_REQUEST);
    }

    console.log("validation completed...");

    return;
  }
  static async validateBugRequest(data: createBug): Promise<void> {
    console.log("bug data is", data);

    if (!data.title || data.title.trim() === "") {
      throw new Exception(
        "Title is required and cannot be empty",
        errorCodes.BAD_REQUEST,
      );
    }

    if (!data.description || data.description.trim() === "") {
      throw new Exception(
        "Description is required and cannot be empty",
        errorCodes.BAD_REQUEST,
      );
    }
    const today = new Date();
    if (!data.deadline || new Date(data.deadline) < today) {
      throw new Exception(
        "Deadline is required and it must be valide date ",
        errorCodes.BAD_REQUEST,
      );
    }

    if (!data.type || !Object.values(BugType).includes(data.type)) {
      throw new Exception(
        `Invalid Bug Type. Provided: ${data.type}`,
        errorCodes.BAD_REQUEST,
      );
    }

    if (!data.projectId) {
      throw new Exception("Project ID is missing", errorCodes.BAD_REQUEST);
    }

    if (!data.developerId) {
      throw new Exception("Developer ID is missing", errorCodes.BAD_REQUEST);
    }

    return;
  }

  static async validateBugTitle(
    title: string,
    projectId: number,
    bugId?: number,
  ): Promise<void> {
    const bug: Bug | null = await Bug.findOne({
      where: {
        title,
        projectId,
      },
    });

    if (bug && bug.bugId !== bugId) {
      throw new Exception(
        UserErrorMessages.DUPLICATE_BUG_WITH_PROJECT_SCOPE,
        errorCodes.BAD_REQUEST,
      );
    }
    console.log("title validation completed...");
  }

  //get all bugs related to a project
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
        UserErrorMessages.INVALID_DATA,
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
