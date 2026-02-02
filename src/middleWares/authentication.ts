import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/custome_variables.json';
import cookieParser from 'cookie-parser';
import { userHandler } from '../handlers/userHandler';

import { Request, Response, NextFunction } from 'express';
import { Exception } from '../helpers/exception';
import { UserErrorMessages } from '../constants/userErrorMessag';
import { errorCodes } from '../constants/errorCodes';
import { errorMessages } from '../constants/errorMessages';
import { User } from '../models/users.model';
import { AuthUtils } from '../utilities/authUtils';
import { UserUtil } from '../utilities/userUtil';

interface myJwtType extends JwtPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export class Authentication {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    let token = authorization?.split(' ')[1];

    if (!token && req.cookies) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      return res.status(errorCodes.UNAUTHORIZED).json({
        message: UserErrorMessages.ACCESS_TOKEN_EXPIRED,
      });
    }

    try {
      const decode = jwt.verify(token, config.jwt_key) as myJwtType;
      const user = await UserUtil.findUserByid(decode.userId)
      req.user = user;
      next();
    } catch (error) {
      res.status(errorCodes.UNAUTHORIZED).json({
        message: UserErrorMessages.ACCESS_DENIED,
      });
    }
  }


  static async authenticateRefreshToken(req: Request, res: Response, next: NextFunction) {
    console.log('inside refresh token.......')
    const authorization = req.headers.authorization;
    let refreshToken = authorization?.split(' ')[1];

    if (!refreshToken && req.cookies) {
      refreshToken = req.cookies.refresh_token;
    }
    if(!refreshToken){
        console.log('refresh token is :: ' , refreshToken)
        throw new Exception (UserErrorMessages.REFRESH_TOKEN_EXPIRED, errorCodes.UNAUTHORIZED)
    }
    console.log('refresh token is :: ' , refreshToken)
    AuthUtils.validateRefreshTokenSTR(String(refreshToken))
    try {
      const decoded = jwt.verify(refreshToken, config.jwt_key) as myJwtType;
      console.log('decode value inside refreseh token :: ', decoded.userId)
      const user = await AuthUtils.validateUserAndRefreshtoken(decoded.userId , refreshToken)
      console.log('decode value inside refreseh token and usr is :: ', user)
      req.user = user;
      return next();

    } catch (err) {
        console.log('error is authenticate refresh token middleware:: ', err)
        next(err)
    }
  }

  //check manager role autherization
  static async autorizeManagerRole(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('inside authorization for user role');
      console.log(req.body);
      console.log('this is the user details which i attach to req , ', req.user);

      //   const user  = await userHandler.findById(Number(req.body.managerId))
      if (req.user?.userType === 'manager') {
        console.log(`this is the user : ${req.user?.name} : ${req.user?.userType}`);
        console.log('role is verified for manager ');
        return next();
      } else {
        console.log('user not verified...');
      }
      throw new Exception(UserErrorMessages.ACCESS_DENIED, errorCodes.UNAUTHORIZED);
    } catch (error) {
      next(error);
    }
  }

  //validat sqa role for creating bug

  static async autorizeSQArole(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      console.log('this is the user details which i attach to req , ', req.user);

      //   const user  = await userHandler.findById(Number(req.body.managerId))
      if (req.user?.userType === 'sqa') {
        console.log(`this is the user : ${req.user?.name} : ${req.user?.userType}`);
        console.log('role is verified for sqa role ');
        return next();
      } else {
        console.log('user not verified...');
      }
      throw new Exception(UserErrorMessages.ACCESS_DENIED, errorCodes.UNAUTHORIZED);
    } catch (error) {
      next(error);
    }
  }

  static async autorizeDeveloperRole(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
      console.log('this is the user details which i attach to req , ', req.user);

      //   const user  = await userHandler.findById(Number(req.body.managerId))
      if (req.user?.userType === 'developer') {
        console.log(`this is the user : ${req.user?.name} : ${req.user?.userType}`);
        console.log('role is verified for developer role ');
        return next();
      } else {
        console.log('user not verified...');
      }
      throw new Exception(UserErrorMessages.ACCESS_DENIED, errorCodes.UNAUTHORIZED);
    } catch (error) {
      next(error);
    }
  }
}
