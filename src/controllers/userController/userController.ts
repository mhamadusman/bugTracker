import { NextFunction, Request, Response } from 'express';
import { User } from '../../models/users.model';
import { userHandler } from '../../handlers/userHandler';
import { UserUtil } from '../../utilities/userUtil';
import { successCodes } from '../../constants/sucessCodes';
import { UserProjects } from '../../models/userProjects.model';
import { UserManager } from './userManager';
import { updateUser } from '../../types/types';
import { successMessages } from '../../constants/sucessMessages';

export class UserController {
  //get all users
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users: User[] | null = await userHandler.getAllUsers();
      return res.status(200).json({
        success: true,
        count: users.length,
        message: `total number of users are ${users.length}`,
        users: users,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserManager.findById(Number(req.user?.id));
      return res.status(successCodes.OK).json({
        sucess: true,
        user: {
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          image: user.image,
          role: user.userType,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  //get developers  on a project
  static async getDevelopers(req: Request<{ projectId: string }>, res: Response, next: NextFunction) {
    const projectId = Number(req.params.projectId);
    try {
      const users: User[] | [] = await UserManager.getDevelopers(projectId);
      console.log('develoeprs', users);
      return res.status(successCodes.OK).json({
        success: true,
        developers: users,
      });
    } catch (error) {
      console.log('error in fetching users on a specific project from usersProject table ', error);
      next(error);
    }
  }
  static async updateProfile(req: Request<{}, updateUser>, res: Response, next: NextFunction) {
    try {
      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/users/${req.file.filename}`;
      }
      await UserManager.updateUser(req.body, Number(req.user?.id), imageUrl);
      return res.status(successCodes.NO_CONTENT).json({
        message: successMessages.MESSAGES.UPDATED,
      });
    } catch (error) {
      next(error);
    }
  }
}
