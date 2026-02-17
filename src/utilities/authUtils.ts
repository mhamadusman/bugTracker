import bcrypt from "bcrypt";
import { User } from "../models/users.model";
import { token } from "../helpers/token";
import { errorCodes } from "../constants/errorCodes";
import { Exception } from "../helpers/exception";
import { UserErrorMessages } from "../constants/userErrorMessag";
import { SignUpErrorMessages } from "../constants/signUpErrorMessages";
import { createUser, loginResponse, UserTypes } from "../types/types";
import { ValidationError } from "../types/types";
import { userHandler } from "../handlers/userHandler";
import { UserUtil } from "./userUtil";
export class AuthUtils {
 static async validateUserDataForSignUp(data: createUser) {
    const errors: ValidationError[] = [];
    const { name, email, password, userType, phoneNumber } = data;
    const types = Object.values(UserTypes);

    if (!name?.trim()) {
      errors.push({ field: "name", message: SignUpErrorMessages.NAME_REQUIRED });
    }

    if (!this.validateEmail(email)) {
      errors.push({ field: "email", message: SignUpErrorMessages.INVALID_EMAIL_FORMAT });
    } else {
      const existingUser = await userHandler.findUserByEmail(email);
      if (existingUser) {
        errors.push({
          field: "email",
          message: SignUpErrorMessages.EMAIL_ALREADY_EXISTS,
        });
      }
    }

    if (!this.validatePasswordLength(password)) {
      errors.push({
        field: "password",
        message: SignUpErrorMessages.PASSWORD_TOO_SHORT,
      });
    }

    if (!userType || !types.includes(userType)) {
      errors.push({
        field: "userType",
        message: SignUpErrorMessages.INVALID_USER_TYPE,
      });
    }

    if (!phoneNumber?.trim()) {
      errors.push({
        field: "phoneNumber",
        message: SignUpErrorMessages.PHONE_REQUIRED,
      });
    } else if (!this.validatePhoneNumber(phoneNumber)) {
      errors.push({
        field: "phoneNumber",
        message: SignUpErrorMessages.PHONE_INVALID_FORMAT,
      });
    }

    if (errors.length > 0) {
      throw new Exception(errors, errorCodes.BAD_REQUEST);
    }
}

  static validatePhoneNumber(phone: string): boolean {
    return /^\d+$/.test(phone.trim());
  }
  static validatePasswordLength(password: string) {
    if (!password || password.trim().length < 8) {
      return false;
    }
    return true;
  }
  static validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    return true;
  }

  static async createHashedPassword(password: string): Promise<string> {
    password = await bcrypt.hash(password, 10);
    return password;
  }

  static async validateLoginReqeust(
    email: string,
    password: string,
  ): Promise<loginResponse> {
    const user = await userHandler.findUserByEmail(email);
    if (!user) {
      throw new Exception(
        UserErrorMessages.INVALID_CREDENTIALS,
        errorCodes.UNAUTHORIZED,
      );
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Exception(
        UserErrorMessages.INVALID_CREDENTIALS,
        errorCodes.UNAUTHORIZED,
      );
    }
    const userToken = await token.getLoginToken(user.id);
    const refreshToken = await token.getRefreshToken(user.id);
    await userHandler.udpatRefreshToken(refreshToken, email);
    return {
      token: userToken,
      userType: user.userType,
      refreshToken: refreshToken,
    };
  }
  static validateRefreshTokenSTR(refreshToken: string) {
    if (!refreshToken) {
      throw new Exception(
        UserErrorMessages.REFRESH_TOKEN_EXPIRED,
        errorCodes.UNAUTHORIZED,
      );
    }
  }
  static async validateUserAndRefreshtoken(
    id: number,
    refreshToken: string,
  ): Promise<User> {
    const user = await UserUtil.findUserByid(id);
    if (!user) {
      throw new Exception(UserErrorMessages.LOGIN_AGAIN , errorCodes.UNAUTHORIZED)
    }
    if (user.refreshToken !== refreshToken) {
      console.log("refresh tokens are not same .... ");
      throw new Exception(
        UserErrorMessages.TOKEN_EXPIRED,
        errorCodes.UNAUTHORIZED,
      );
    }
    return user;
  }
}
