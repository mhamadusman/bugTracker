import { Request, Response, NextFunction } from 'express';
import { AuthManager } from './authManager';
import { successMessages } from '../../constants/sucessMessages';
import { createUser, signUpResponse } from '../../types/types';
import { successCodes } from '../../constants/sucessCodes';

class AuthController {
  static async signUp(req: Request<{}, signUpResponse, createUser>, res: Response<signUpResponse>, next: NextFunction) {
    try {
      console.log('sign-up data is: ', req.body);
      const data = await AuthManager.signUp(req.body);
      return res.status(200).json({
        sucess: true,
        message: `user ${successMessages.MESSAGES.CREATED}`,
        user_id: data.id,
        email: data.email,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  static async login(req: Request<{}, {}, { email: string; password: string; user: string }>, res: Response, next: NextFunction) {
    try {
      const data = await AuthManager.login(req.body.email, req.body.password);
      res.cookie('auth_token', data.token, {
        httpOnly: true,
        maxAge: 60 * 1000,
      });

      res.cookie('refresh_token', data.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(successCodes.OK).json({
        message: 'Authorized',
        userType: data.userType,
        token: data.token,
        refreshToken: data.refreshToken
      });
    } catch (error) {
      console.log('error in login...in authController ' , error)
      next(error);
    }
  }
  static async refreshToken(req: Request , res: Response , next: NextFunction){
    try {
      console.log('refresh token data from controller :: ', req.user?.id)
      const data = await AuthManager.getRefreshToken(Number(req.user?.id) , String(req.user?.email) , String(req.user?.userType))
      console.log('refresh token data from controller :: ', data)
      res.cookie('auth_token', data.token, {
        httpOnly: true,
        maxAge: 60 * 1000,
      });

      res.cookie('refresh_token', data.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(successCodes.OK).json({
        message: 'Authorized',
        userType: data.userType,
        token: data.token,
        refreshToken: data.refreshToken
      });
    } catch (error) {
      console.log('error in refresh token controller during refresh token  ' , error)
      next(error);
    }  

  }
}

export default AuthController;
