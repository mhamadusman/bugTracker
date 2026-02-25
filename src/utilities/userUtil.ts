import { errorCodes } from "../constants/errorCodes";
import { Exception } from "../helpers/exception";
import { UserErrorMessages } from "../constants/userErrorMessag";
import { updateUser } from "../types/types";
import { User } from "../models/users.model";
import { userHandler } from "../handlers/userHandler";
import { AuthUtils } from "./authUtils";
import { UserProfileErrorMessages } from "../constants/UserProfileErrorMessages";
import { UserFields } from "../constants/UserFields";
import { ValidationError } from "../types/types";

export class UserUtil {
  static async findUserWithEmail(email: string) {
    const user = await User.findOne({
      where: { email: email },
    });
    if (user) {
      throw new Exception(
        UserErrorMessages.USER_ALREADY_EXISTS,
        errorCodes.CONFLICT_WITH_CURRENT_STATE,
      );
    }
  }
  static async validateUpdateRequest(data: updateUser, id: number) {
    const { name, email, password, phoneNumber } = data;
    const errors: ValidationError[] = [];
    if (name !== undefined && name.trim().length === 0) {
      errors.push({
        field: UserFields.NAME,
        message: UserProfileErrorMessages.NAME_REQUIRED,
      });
    }

    if (email) {
      const existingUser = await userHandler.findUserByEmail(email);
      if (existingUser && Number(existingUser.id) !== Number(id)) {
        errors.push({
          field: UserFields.EMAIL,
          message: UserProfileErrorMessages.EMAIL_ALREADY_EXISTS,
        });
      }
    }

    if (phoneNumber !== undefined) {
      const phone = phoneNumber.trim();
      if (phone.length === 0) {
        errors.push({
          field: UserFields.PHONE_NUMBER,
          message: UserProfileErrorMessages.PHONE_REQUIRED,
        });
      } else if (!/^\+?[0-9]+$/.test(phone.trim())) {
        errors.push({
          field: UserFields.PHONE_NUMBER,
          message: UserProfileErrorMessages.PHONE_INVALID,
        });
      }
    }

    if (password && password.trim().length > 0) {
      const response = AuthUtils.validatePasswordLength(password);
      if (!response) {
        errors.push({
          field: UserFields.PASSWORD,
          message: UserProfileErrorMessages.PASSWORD_LENGTH,
        });
      }
    }

    if (errors.length > 0) {
      throw new Exception(errors, errorCodes.BAD_REQUEST);
    }
  }
  static async findUserByid(id: number) {
    const user = await userHandler.findById(id);
    if (!user) {
      throw new Exception(
        UserErrorMessages.USER_NOT_FOUND,
        errorCodes.BAD_REQUEST,
      );
    }
    return user;
  }
}
