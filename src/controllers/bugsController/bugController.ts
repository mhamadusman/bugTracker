import { Request, Response, NextFunction } from "express";
import { createBug, IBugs, IBugState } from "../../types/types";
import { BugManagr } from "./bugsManager";
import { successCodes } from "../../constants/sucessCodes";
import { successMessages } from "../../constants/sucessMessages";
import { Bug } from "../../models/bug.model";
import { getBugs } from "../../types/types";
import { ProjectUils } from "../../utilities/projectUtils";
import { projectManager } from "../projectController/projectManager";

export class BugController {
  static async createBug(
    req: Request<{}, {}, createBug>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let imgurl = null;
      if (req.file) {
        imgurl = `/uploads/bugs/${req.file.filename}`;
      }
      console.log("img path", imgurl);
      console.log("data is ", req.body);
      await BugManagr.createBug(req.body, Number(req.user?.id), String(imgurl));

      return res.status(successCodes.CREATED).json({
        sucess: true,
        message: successMessages.MESSAGES.CREATED,
      });
    } catch (error) {
      console.log("error creating new bug inside bug controller :: ", error);
      next(error);
    }
  }

  //it will return bug status....
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
          totalBugs: result?.totalBugs,
          pages: result.pages,
          bugs: result.bugs,
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
        return res.status(successCodes.OK).json({
          totalBugs: result?.totalBugs,
          pages: result.pages,
          bugs: result.bugs,
        });
      } catch (error) {
        console.log("error in getting bugs in controller :: ", error);
        next(error);
      }
    }
  }

  static async updateBug(
    req: Request<{ bugId: string }, {}, any>,
    res: Response,
    next: NextFunction,
  ) {
    const bugId = Number(req.params.bugId);
    const userType = String(req.user?.userType);
    const userId = Number(req.user?.id);

    if (userType === "developer") {
      try {
        const { bugStatus } = req.body;
        await BugManagr.updateBugStatus(bugId, bugStatus, userId);
        return res.status(successCodes.NO_CONTENT).json({
          success: true,
          message: successMessages.MESSAGES.UPDATED,
        });
      } catch (error) {
        next(error);
      }
    } else if (userType === "sqa") {
      try {
        let imgurl = req.file ? `/uploads/bugs/${req.file.filename}` : "";
        await BugManagr.updateBug(req.body, imgurl, bugId);
        return res.status(successCodes.NO_CONTENT).json({
          success: true,
          message: successMessages.MESSAGES.UPDATED,
        });
      } catch (error) {
        next(error);
      }
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
      return res.status(successCodes.NO_CONTENT).json({
        message: successMessages.MESSAGES.DELETED,
      });
    } catch (error) {
      console.log("error in deleting bug..", error);
    }
  }
}
