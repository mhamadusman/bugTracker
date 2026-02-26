import { NextFunction, Request, Response } from "express";
import { User } from "../../models/users.model";
import { userHandler } from "../../handlers/userHandler";
import { successCodes } from "../../constants/sucessCodes";
import { UserManager } from "./userManager";
import { updateUser } from "../../types/types";
import { successMessages } from "../../constants/sucessMessages";

export class UserController {
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
      console.log('error in creating user profile :: ' , error)
      next(error);
    }
  }
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserManager.findById(Number(req.user?.id));
      return res.status(successCodes.OK).json({
        user: {
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          image: user.image,
          role: user.userType,
        },
      });
    } catch (error) {
      console.log('error in getting user profile :: ' , error)
      next(error);
    }
  }
  //get  users having role=developer on a project
  static async getDevelopers(
    req: Request<{ projectId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    const projectId = Number(req.params.projectId);
    try {
      const developers = await UserManager.getDevelopers(projectId);
      return res.status(successCodes.OK).json({
        developers: developers,
      });
    } catch (error) {
      console.log(
        "error in fetching developers on a specific project  ",
        error,
      );
      next(error);
    }
  }
  static async updateProfile(
    req: Request<{}, updateUser>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/users/${req.file.filename}`;
      }
      await UserManager.updateUser(req.body, Number(req.user?.id), imageUrl);
      return res.status(successCodes.OK).json({
        message: successMessages.MESSAGES.UPDATED,
      });
    } catch (error) {
      console.log("error happened in update user profile :: ", error);
      next(error);
    }
  }

}
