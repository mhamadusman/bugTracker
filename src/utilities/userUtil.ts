import { errorCodes } from '../constants/errorCodes';
import { Exception } from '../helpers/exception';
import { UserErrorMessages } from '../constants/userErrorMessag';
import { createUser, updateUser } from '../types/types';
import { User } from '../models/users.model';
import { userHandler } from '../handlers/userHandler';
import { AuthUtils } from './authUtils';

export class UserUtil {
  static async findUserWithEmail(email: string) {
    const user = await User.findOne({
      where: { email: email },
    });
    if (user) {
      throw new Exception(UserErrorMessages.USER_ALREADY_EXISTS, errorCodes.CONFLICT_WITH_CURRENT_STATE);
    }
  }
  static async validateUpdateRequest(data: updateUser, id: number) {
    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new Exception(UserErrorMessages.INVALID_DATA, errorCodes.BAD_REQUEST);
    }
    if (data.email) {
      const response = await userHandler.findUserByEmail(data.email);
      if (response && response.id !== id) {
        throw new Exception(UserErrorMessages.EMAIL_ALREADY_EXISTS, errorCodes.BAD_REQUEST);
      }
    }
    if (data.password && data.password.trim().length > 0) {
      AuthUtils.validatePasswordLength(data.password);
    }
  }
  static async findUserByid(id: number){
    const user  = await userHandler.findById(id)
    if(!user){
      throw new Exception(UserErrorMessages.USER_NOT_FOUND , errorCodes.BAD_REQUEST)
    }
    return user 
  }
}
