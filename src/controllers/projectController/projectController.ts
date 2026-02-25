import { Request, Response, NextFunction } from "express";
import {
  createProject,
  project,
  deleteProjectResponse,
  IProjects,
} from "../../types/types";
import { projectManager } from "./projectManager";
import { User } from "../../models/users.model";
import { errorCodes } from "../../constants/errorCodes";
import { successCodes } from "../../constants/sucessCodes";
import { successMessages } from "../../constants/sucessMessages";
import { emailService } from "../../services/emailService";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export class ProjectController {
  static async createProjct(
    req: Request<{}, project, createProject>,
    res: Response<{ message: string }>,
    next: NextFunction,
  ) {
    try {
      let imgurl = "";
      if (req.file) {
        imgurl = `/uploads/projects/${req.file.filename}`;
      }

      let { developerIds, sqaIds, name, description, managerName } = req.body;
      const allRecepient = await projectManager.getAllRecepientEmails(
        sqaIds,
        developerIds,
      );

      const project = await projectManager.createProject(
        req.body,
        String(imgurl),
        Number(req.user?.id),
      );
      emailService.notifyNewProjectCreation(
        allRecepient,
        managerName,
        name,
        description,
      );

      return res.status(errorCodes.CREATED).json({
        message: successMessages.MESSAGES.CREATED,
      });
    } catch (error: any) {
      console.log(
        "error ocured in projectController.createProject",
        error.message,
      );
      next(error);
    }
  }

  static async getProjects(
    req: Request,
    res: Response<IProjects>,
    next: NextFunction,
  ) {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 6;
    const name = (req.query.name as string) || "";

    try {
      const result: IProjects = await projectManager.getProjects(
        Number(req.user?.id),
        String(req.user?.userType),
        page,
        limit,
        name,
      );

      return res.status(successCodes.OK).json({
        totalProjects: result.totalProjects,
        pages: result.pages,
        projectsWithDetails: result.projectsWithDetails,
      });
    } catch (error) {
      console.log("error during fetching projects :: ", error);
      next(error);
    }
  }

  static async deleteProjectById(
    req: Request<{ projectId: string }>,
    res: Response<deleteProjectResponse>,
    next: NextFunction,
  ) {
    const projectId = Number(req.params.projectId);
    try {
      const managerId = Number(req.user?.id);
      await projectManager.deleteProjectById(projectId, managerId);
      return res.status(200).json({
        message: successMessages.MESSAGES.DELETED,
      });
    } catch (error) {
      console.log("error during deleting project :: ", error);
      next(error);
    }
  }

  static async editProject(
    req: Request<{ projectId: string }, {}, createProject>,
    res: Response,
    next: NextFunction,
  ) {
    const projectId: number = Number(req.params.projectId);
    const managerId: number = Number(req.user?.id);
    try {
      let imgURL: string = "";
      if (req.file) {
        imgURL = `/uploads/projects/${req.file.filename}`;
      }

      await projectManager.editProject(projectId, req.body, managerId, imgURL);
      return res.status(successCodes.OK).json({
        message: successMessages.MESSAGES.UPDATED,
      });
    } catch (error) {
      console.log("error during edit project :: ", error);
      next(error);
    }
  }
}
