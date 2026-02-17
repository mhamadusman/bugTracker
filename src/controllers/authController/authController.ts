import { Request, Response, NextFunction } from "express";
import { AuthManager } from "./authManager";
import { successMessages } from "../../constants/sucessMessages";
import { createUser, signUpResponse } from "../../types/types";
import { successCodes } from "../../constants/sucessCodes";

class AuthController {
  static async signUp(
    req: Request<{}, signUpResponse, createUser>,
    res: Response<signUpResponse>,
    next: NextFunction,
  ) {
    try {
      await AuthManager.signUp(req.body);
      return res.status(200).json({
        message: `user ${successMessages.MESSAGES.CREATED}`,
      });
    } catch (error: unknown) {
      console.log('error during signup request :: ', error)
      next(error);
    }
  }
  static async login(
    req: Request<{}, {}, { email: string; password: string; user: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await AuthManager.login(req.body.email, req.body.password);
      res.cookie("auth_token", data.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("refresh_token", data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(successCodes.OK).json({
        message: "Authorized",
        userType: data.userType,
      });
    } catch (error) {
      console.log("error in login...in authController ", error);
      next(error);
    }
  }
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthManager.getRefreshToken(
        Number(req.user?.id),
        String(req.user?.userType),
        String(req.user?.email),
      );
      res.cookie("auth_token", data.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1 * 24 * 60 * 60 * 1000
      });
      res.cookie("refresh_token", data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(successCodes.OK).json({
        message: "Authorized",
        userType: data.userType,
      });
    } catch (error) {
      console.log(
        "error in refresh token controller during refresh token  ",
        error,
      );
      next(error);
    }
  }
  static async logout(req: Request , res: Response , next: NextFunction){
      const userId = Number(req.user?.id)
      const refreshToken = req.cookies?.refresh_token;
      if(refreshToken){
        try{
            await AuthManager.logOut(userId, refreshToken)
            res.clearCookie('auth_token')
            res.clearCookie('refresh_token')
            return res.status(successCodes.OK).json({
              message: successMessages.MESSAGES.LOG_OUT
            })
        }catch(error){
          console.log('error in logout :: ' , error)
          next(error)
        }
      }else{
        return res.status(successCodes.NO_CONTENT)
      }
      
  }
}
export default AuthController;
