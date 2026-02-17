import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Exception } from "../helpers/exception";
import { UserErrorMessages } from "../constants/userErrorMessag";
import { errorCodes } from "../constants/errorCodes";
import { User } from "../models/users.model";
import { AuthUtils } from "../utilities/authUtils";
import { UserUtil } from "../utilities/userUtil";

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
    let token = authorization?.split(" ")[1];
    if (!token && req.cookies) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      return res.status(errorCodes.UNAUTHORIZED).json({
        message: UserErrorMessages.ACCESS_TOKEN_EXPIRED,
      });
    }

    try {
      const decode = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET as string
      ) as myJwtType;
      const user = await UserUtil.findUserByid(decode.userId);
      req.user = user;
      next()
    } catch (error) {
      res.status(errorCodes.UNAUTHORIZED).json({
        message: UserErrorMessages.ACCESS_DENIED,
      });
    }
  }

  static async authenticateRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) {
        console.log("console from authenticateRefreshToken middleware :: No refresh token provided in cookies");
        return next(
          new Exception(
            UserErrorMessages.REFRESH_TOKEN_EXPIRED,
            errorCodes.UNAUTHORIZED,
          ),
        );
      }
      AuthUtils.validateRefreshTokenSTR(String(refreshToken));
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string 
      ) as myJwtType;
      const user = await AuthUtils.validateUserAndRefreshtoken(
        decoded.userId,
        refreshToken,
      );
      req.user = user;
      next();
    } catch (err) {
      console.error("Error in refresh token middle ware ::", err);
      next(err);
    }
  }

  static async autorizeManagerRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (req.user?.userType === "manager") {
        return next();
      }
      throw new Exception(
        UserErrorMessages.ACCESS_DENIED,
        errorCodes.UNAUTHORIZED,
      );
    } catch (error) {
      console.log("error in authenticating manager role :: ", error);
      next(error);
    }
  }

  static async autorizeSQArole(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (req.user?.userType === "sqa") {
        return next();
      }
      throw new Exception(
        UserErrorMessages.ACCESS_DENIED,
        errorCodes.UNAUTHORIZED,
      );
    } catch (error) {
      console.log("error in authenticating qa role :: ", error);
      next(error);
    }
  }

  static async autorizeDeveloperRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (req.user?.userType === "developer") {
        return next();
      }
      throw new Exception(
        UserErrorMessages.ACCESS_DENIED,
        errorCodes.UNAUTHORIZED,
      );
    } catch (error) {
      console.log("error in authenticating developer role :: ", error);
      next(error);
    }
  }
}
