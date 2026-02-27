import { Request, Response, NextFunction } from "express";
import {
  createBug,
  IBugs,
  IBugState,
  IBugWithDeveloper,
} from "../../types/types";
import { BugManagr } from "./bugsManager";
import { successCodes } from "../../constants/sucessCodes";
import { successMessages } from "../../constants/sucessMessages";
import { projectManager } from "../projectController/projectManager";
import { status } from "../../models/bug.model";
import { UserErrorMessages } from "../../constants/userErrorMessag";
export class BugController {
  static async createBug(
    req: Request<{}, {}, createBug>,
    res: Response<IBugWithDeveloper | null>,
    next: NextFunction,
  ) {
    try {
      let imgurl = "";
      let imagePublicId = "";
      if (req.file) {
        imgurl = req.file.path;
        imagePublicId = req.file.filename;
      }
      const newBug: IBugWithDeveloper | null = await BugManagr.createBug(
        req.body,
        Number(req.user?.id),
        String(imgurl),
        imagePublicId,
      );
      return res.status(successCodes.CREATED).json(newBug);
    } catch (error) {
      console.log("error creating new bug  :: ", error);
      next(error);
    }
  }
  static async getBugState(
    req: Request,
    res: Response<IBugState>,
    next: NextFunction,
  ) {
    const role = String(req.user?.userType);
    const userId = Number(req.user?.id);
    const projectId = Number(req.query.projectId);
    try {
      const result = await BugManagr.getBugState(userId, role, projectId);
      return res.status(successCodes.OK).json({
        totalBugs: result.totalBugs,
        pendingBugs: result.pendingBugs,
        completedBugs: result.completedBugs,
      });
    } catch (error: unknown) {
      console.log("error in getting bugs using status :: ", error);
      next(error);
    }
  }

  static async getAllBugs(
    req: Request,
    res: Response<IBugs>,
    next: NextFunction,
  ) {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 6;
    const projectId = Number(req.query.projectId);
    const title = (req.query.title as string) || "";
    if (projectId) {
      try {
        //will get bugs associated with a project
        await projectManager.validateProjectId(projectId);
        const result = await BugManagr.getAllBugs(
          Number(req.user?.id),
          String(req.user?.userType),
          page,
          limit,
          title,
          projectId,
        );
        return res.status(successCodes.OK).json({
          totalBugs: result.totalBugs,
          pages: result.pages,
          statusCount: result.statusCount,
          bugsWithDeveloper: result.bugsWithDeveloper,
        });
      } catch (error) {
        console.log(
          "error in getting bugs on a project in bug controller :: ",
          error,
        );
        next(error);
      }
    } else {
      try {
        //will get bugs associated with a user
        const result = await BugManagr.getAllBugs(
          Number(req.user?.id),
          String(req.user?.userType),
          page,
          limit,
          title,
        );
        console.log(result.bugsWithDeveloper);
        return res.status(successCodes.OK).json({
          totalBugs: result.totalBugs,
          pages: result.pages,
          statusCount: result.statusCount,
          bugsWithDeveloper: result.bugsWithDeveloper,
        });
      } catch (error) {
        console.log("error in getting bugs in controller :: ", error);
        next(error);
      }
    }
  }

  static async updateBug(
    req: Request<{ bugId: string }, {}, createBug>,
    res: Response,
    next: NextFunction,
  ) {
    const bugId = Number(req.params.bugId);
    const userType = String(req.user?.userType);
    const userId = Number(req.user?.id);

    try {
      if (userType === "developer") {
        const status = req.body.status as status;
        await BugManagr.updateBugStatus(bugId, status, userId);
        return res.status(successCodes.OK).json({
          message: successMessages.MESSAGES.UPDATED,
        });
      } else if (userType === "sqa") {
        let imgurl = "";
        let imagePublicId = "";
        if (req.file) {
          imgurl = req.file.path;
          imagePublicId = req.file.filename;
        }

        const updatedBug = await BugManagr.updateBug(
          req.body,
          imgurl,
          imagePublicId,
          bugId,
          userId,
        );
        return res.status(200).json({
          message: successMessages.MESSAGES.UPDATED,
          ...updatedBug,
        });
      }

      return res.status(403).json({ message: UserErrorMessages.UNAUTHORIZED });
    } catch (error: any) {
      console.error("Error occurred in updateBug controller :: ", error);
      next(error);
    }
  }

  static async deleteBug(
    req: Request<{ bugId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const bugId = req.params.bugId;
      await BugManagr.deleteBug(Number(bugId), Number(req.user?.id));
      return res.status(successCodes.OK).json({
        message: successMessages.MESSAGES.DELETED,
      });
    } catch (error) {
      console.log("error in deleting bug..", error);
    }
  }
}
