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
    res: Response<project>,
    next: NextFunction,
  ) {
    try {
      let imgurl = "";
      if (req.file) {
        imgurl = `/uploads/projects/${req.file.filename}`;
      }
      const project: project = await projectManager.createProject(
        req.body,
        String(imgurl),
        Number(req.user?.id),
      );
      return res.status(errorCodes.CREATED).json({
        sucess: true,
        message: successMessages.MESSAGES.CREATED,
        managerId: project.managerId,
        name: project.name,
        projectId: project.projectId,
        image: project.image,
      });
    } catch (error) {
      console.log("error ocured in projectController.createProject", error);
      next(error);
    }
  }
  //get specifi proejets using user  id based on role manger sqa and developer
  static async getProjects(req: Request, res: Response, next: NextFunction) {
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
        count: result?.totalProjects,
        message: `total number of porjects found ${result?.totalProjects}`,
        projects: result.projects,
        pages: result.pages,
      });
    } catch (error) {
      console.log("error in fetching projects..... ", error);
      next(error);
    }
  }

  static async deleteProjectById(
    req: Request<{ projectId: string }>,
    res: Response<deleteProjectResponse>,
    next: NextFunction,
  ) {
    const projectId = String(req.params.projectId);
    try {
      //first validate project is connected with manager
      const managerId = String(req.user!.id);
      await projectManager.deleteProjectById(projectId, managerId);
      return res.status(200).json({
        sucess: true,
        message: "proeject deleted sucessfully",
      });
    } catch (error) {
      next(error);
    }
  }

  //edit project
  static async editProject(
    req: Request<{ projectId: string }, {}, createProject>,
    res: Response,
    next: NextFunction,
  ) {
    const projectId: number = Number(req.params.projectId);
    try {
      let imgURL = "";
      if (req.file) {
        imgURL = `/uploads/projects/${req.file.filename}`;
      }
      await projectManager.editProject(
        projectId,
        req.body,
        Number(req.user?.id),
        imgURL,
      );
      return res.status(successCodes.OK).json({
        status: true,
        message: successMessages.MESSAGES.UPDATED,
      });
    } catch (error) {
      next(error);
    }
  }
}
