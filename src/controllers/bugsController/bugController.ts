import { Request, Response, NextFunction } from 'express';
import { createBug, IBugs } from '../../types/types';
import { BugManagr } from './bugsManager';
import { successCodes } from '../../constants/sucessCodes';
import { successMessages } from '../../constants/sucessMessages';
import { Bug } from '../../models/bug.model';
import { getBugs } from '../../types/types';
import { ProjectUils } from '../../utilities/projectUtils';
import { projectManager } from '../projectController/projectManager';

export class BugController {
  static async createBug(req: Request<{}, {}, createBug>, res: Response, next: NextFunction) {
    try {
      let imgurl = null;
      if (req.file) {
        imgurl = `/uploads/bugs/${req.file.filename}`;
      }
      console.log('img path', imgurl);
      console.log('data is ', req.body);
      await BugManagr.createBug(req.body, Number(req.user?.id), String(imgurl));

      return res.status(successCodes.CREATED).json({
        sucess: true,
        message: successMessages.MESSAGES.CREATED,
      });
    } catch (error) {
      console.log('error creating new bug inside bug controller :: ', error)
      next(error);
    }
  }

  static async getBugsOnAProject(req: Request, res: Response<IBugs>, next: NextFunction) {
      const page: number = Number(req.query.page) || 1
      const limit: number  = Number(req.query.limit) || 5
      const projectId = Number(req.query.projectId)
    try {
      //validate project Id
      await projectManager.validateProjectId(projectId)
      const result = await BugManagr.getBugsonAproject(projectId, Number(req.user?.id), String(req.user?.userType), page , limit);
      return res.status(successCodes.OK).json({
        totalBugs: result?.totalBugs,
        pages: result.pages,
        bugs: result.bugs

      });
    } catch (error) {
      console.log('error in getting bugs on a project in bug controller :: ', error)
      next(error);
    }
  }

  static async updateBug(req: Request<{ bugId: string }, {}, any>, res: Response, next: NextFunction) {
    const bugId = Number(req.params.bugId);
    const userType = req.user?.userType;
    const userId = Number(req.user?.id);

    if (userType === 'developer') {
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
    } else if (userType === 'sqa') {
      try {
        let imgurl = req.file ? `/uploads/bugs/${req.file.filename}` : null;
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

  static async getBugs(req: Request, res: Response, next: NextFunction) {
    try {
      const role = req.user?.userType;
      const id = req.user?.id;
      console.log('to get all bugs to a developer');
      const bugs: Bug[] | [] = await BugManagr.allbugs(role as string, Number(id));
      console.log('these are all bugs ... ', bugs);
      return res.status(successCodes.OK).json({
        status: true,
        bugs: bugs,
      });
    } catch (error) {
      console.log('error in fetching bugs in bug controller', error);
      next();
    }
  }

  static async deleteBug(req: Request<{ bugId: string }>, res: Response, next: NextFunction) {
    try {
      const bugId = req.params.bugId;
      await BugManagr.deleteBug(Number(bugId), Number(req.user?.id));
      return res.status(successCodes.NO_CONTENT).json({
        message: successMessages.MESSAGES.DELETED,
      });
    } catch (error) {
      console.log('error in deleting bug..', error);
    }
  }
}
